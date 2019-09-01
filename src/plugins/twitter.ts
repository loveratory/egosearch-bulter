import { Context, TwitterConfig, Message } from '../types'
import Twit = require('twit')
import { Observable } from 'rxjs'
import * as t from 'io-ts'
import { pipe } from 'fp-ts/lib/pipeable'
import { fold, map } from 'fp-ts/lib/Either'

export const convertConfigFromEnv = (env: typeof process.env): TwitterConfig => {
	const A = t.type({
		EGS_SUB_TWITTER_CONSUMER_KEY: t.string,
		EGS_SUB_TWITTER_CONSUMER_SECRET: t.string,
		EGS_SUB_TWITTER_TOKEN: t.string,
		EGS_SUB_TWITTER_TOKEN_SECRET: t.string,
	})
	const B = t.partial({
		EGS_SUB_TWITTER_IGNORE_RT: t.string,
		EGS_SUB_TWITTER_LANG: t.string
	})
	const T = t.intersection([A, B])
	const R = pipe(
		T.decode(env),
		map<t.TypeOf<typeof T>, TwitterConfig>(env => (
			{
				consumerKey: env.EGS_SUB_TWITTER_CONSUMER_KEY,
				consumerSecret: env.EGS_SUB_TWITTER_CONSUMER_SECRET,
				accessToken: env.EGS_SUB_TWITTER_TOKEN,
				accessTokenSecret: env.EGS_SUB_TWITTER_TOKEN_SECRET,
				preferences: {
					ignoreRetweets: !!(env.EGS_SUB_TWITTER_IGNORE_RT && env.EGS_SUB_TWITTER_IGNORE_RT === "1"),
					langEquals: env.EGS_SUB_TWITTER_LANG
				}
			}
		)),
		fold<t.Errors, TwitterConfig, t.Errors | TwitterConfig>(e => e, c => c)
	)
	if (Array.isArray(R)) {
		throw R
	}
	return R
}

const extract = (tweet: any): string => {
	// RT
  if (tweet.retweeted_status) {
    return `RT @${tweet.retweeted_status.user.screen_name}: ${extract(tweet.retweeted_status)}`
	}
	// QT
  if (tweet.is_quote_status && !tweet.retweeted_status && tweet.quoted_status) {
    return `QT ${tweet.text.substr(...tweet.display_text_range)} @${tweet.quoted_status.user.screen_name}: ${extract(tweet.quoted_status)}`
	}

	// URL の展開
	let message = tweet.text
  if (tweet.entities.urls) {
    tweet.entities.urls.forEach(url => {
      message = message.replace(url.url, url.expanded_url)
    })
  }
  return message
}

export const validate = (_: Context, __: TwitterConfig) => (tweet: unknown): any => {
	return tweet as any
}
export const filter = ({ disregards }: Context, { preferences }: TwitterConfig) => (tweet: any): boolean => {
	if (disregards.some(d => tweet.text.includes(d))) return false
	if (preferences.ignoreRetweets && tweet.retweeted_status) return false
	if (
		preferences.langEquals &&
		!(
			(tweet.lang && tweet.lang === preferences.langEquals) ||
			(tweet.user.lang && tweet.user.lang === preferences.langEquals)
		)
	) return false

	// PASS :)
	return true
}
export const convertToMessage = (tweet: any): Message => {
	return {
		href: new URL(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`),
		plugin: 'twitter',
		message: extract(tweet)
	}
}

export const createObservable = ({ logger, tracks }: Context, config: TwitterConfig) => new Observable<unknown>(subscribe => {
	const twit = new Twit({
		consumer_key: config.consumerKey,
		consumer_secret: config.consumerSecret,
		access_token: config.accessToken,
		access_token_secret: config.accessTokenSecret,
	})
	const stream = twit.stream('statuses/filter', { track: tracks.join(',') })

	stream.on('tweet', (tweet: any) => {
		logger.debug(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
		subscribe.next(tweet as unknown)
	})
	stream.on('error', (e) => {
		subscribe.error(e)
	})
	stream.on('disconnect', () => {
		subscribe.complete()
	})
	stream.on('connected', () => {
		logger.debug('connected')
	})
})
