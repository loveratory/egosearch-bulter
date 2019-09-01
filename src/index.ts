import * as twitterPlugin from './plugins/twitter'
import * as consolePlugin from './plugins/console'
import * as slackPlugin from './plugins/slack'

import { Logger, Context } from './types'
import * as t from 'io-ts'
import { pipe } from 'fp-ts/lib/pipeable'
import { fold, map } from 'fp-ts/lib/Either'
import * as ops from 'rxjs/operators'

// FIXME: あとでなおす
const consoleLogger: Logger = {
	info(m) { console.log(m) },
	debug(m) { console.log(m) },
	warn(m) { console.error(m) },
	error(m) { console.error(m) }
}

type Config = {
	tracks: string[],
	disregards: string[]
}

const convertConfigFromEnv = (env: typeof process.env): Config => {
	const T = t.type({
		EGS_SUB_TRACKS: t.string,
		EGS_SUB_DISREGARDS: t.string,
	})
	const R = pipe(
		T.decode(env),
		map<t.TypeOf<typeof T>, Config>(env => ({
			tracks: env.EGS_SUB_TRACKS.split(','),
			disregards: env.EGS_SUB_DISREGARDS.split(','),
		})),
		// TODO: 利点を殺している? 再考したい
		fold<t.Errors, Config, t.Errors | Config>(e => e, c => c)
	)
	if (Array.isArray(R)) {
		throw R
	}
	return R
}

const main = (logger: Logger) =>  {
	// もし設定が取得できないなら、復旧しない
	const config = convertConfigFromEnv(process.env)
	const twitterConfig = twitterPlugin.convertConfigFromEnv(process.env)
	const slackConfig = slackPlugin.convertConfigFromEnv(process.env)

	const context: Context = { logger, ...config }

	const run = () => {
		const o = twitterPlugin.createObservable(context, twitterConfig).pipe(
			ops.map(twitterPlugin.validate(context, twitterConfig)),
			ops.filter(twitterPlugin.filter(context, twitterConfig)),
			ops.map(twitterPlugin.convertToMessage)
		)

		const s = o.subscribe({
			next: (m) => {
				consolePlugin.consume()(m)
				slackPlugin.consume(slackConfig)(m)
			},
			error: (e) => {
				logger.error(e)
				s.unsubscribe()
				// TODO: 永続化の責務は分割する
				run()
			},
			complete: () => {
				logger.error('completed')
				s.unsubscribe()
				// TODO: 永続化の責務は分割する
				run()
			}
		})
	}

	run()
}

main(consoleLogger)
