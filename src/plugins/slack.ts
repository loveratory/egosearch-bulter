import { Message } from '../types'

export const consumer = (/* config */) => (m: Message) => {
	console.log(`#${m.plugin} [${m.href}] ${m.message}`)
}
