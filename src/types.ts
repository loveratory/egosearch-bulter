export interface Logger {
	debug(message: string): void
	info(message: string): void
	warn(message: string): void
	error(error: string | Error): void
}

export type TwitterConfig = {
	consumerKey: string
	consumerSecret: string
	accessToken: string
	accessTokenSecret: string
	preferences: {
		ignoreRetweets: boolean
		langEquals?: string
	}
}
export type SlackConfig = {
	incomingHookURI: string,
}
export type Context = {
	logger: Logger
	tracks: string[]
	disregards: string[]
}
export type Message = {
	href: URL
	plugin: 'twitter'
	message: string
}
