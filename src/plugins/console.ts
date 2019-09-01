import { Message } from '../types'

export const consumer = (m: Message) => {
	console.log(`#${m.plugin} [${m.href}] ${m.message}`)
}
