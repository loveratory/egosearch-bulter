import { Message } from '../types'

export const consume = () => (m: Message) => {
	console.log(`#${m.plugin} [${m.href}] ${m.message}`)
}
