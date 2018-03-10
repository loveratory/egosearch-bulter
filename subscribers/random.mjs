import EventEmitter from 'events'

import crypto from 'crypto'

const randomBytesPromise = (size = 128) => new Promise ((resolve, reject) => {
  crypto.randomBytes(size, (e, buf) => {
    return e ? reject(e) : resolve(buf)
  })
})

export default class extends EventEmitter {
  constructor () {
    super()
    const publisher = async () => {
      this.emit('message', {
        message: (await randomBytesPromise(64)).toString('hex'),
        origin: `https://github.com/BindEmotions/egosearch-bulter`,
        user_id: 'crypto.randomBytes(64)',
        service: 'random',
        timestamp: Date.now()
      })
      const ms = (Math.ceil(Math.random() * 100) * 250)
      setTimeout(publisher, ms)
    }
    publisher()
  }
}
