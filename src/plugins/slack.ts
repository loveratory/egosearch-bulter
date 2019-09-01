import { Context, SlackConfig, Message } from '../types'
import { Observable } from 'rxjs'
import * as t from 'io-ts'
import { pipe } from 'fp-ts/lib/pipeable'
import { fold, map } from 'fp-ts/lib/Either'
import axios from 'axios'

export const convertConfigFromEnv = (env: typeof process.env): SlackConfig => {
	const T = t.type({
		EGS_PUB_SLACK_INCOMMING_HOOK_URI: t.string,
	})
	const R = pipe(
		T.decode(env),
		map<t.TypeOf<typeof T>, SlackConfig>(env => (
			{
				incomingHookURI: env.EGS_PUB_SLACK_INCOMMING_HOOK_URI
			}
		)),
		fold<t.Errors, SlackConfig, t.Errors | SlackConfig>(e => e, c => c)
	)
	if (Array.isArray(R)) {
		throw R
	}
	return R
}

export const consume = (config: SlackConfig) => (m: Message) => {
	return axios.post(config.incomingHookURI, {
		text: m.href
	})
}
