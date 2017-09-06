import Twitter from 'node-tweet-stream'
import EventEmitter from 'events'

export default class extends EventEmitter {
  constructor() {
    super()
    this.t = new Twitter({
      consumer_key: process.env.EGS_SUB_TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.EGS_SUB_TWITTER_CONSUMER_SECRET,
      token: process.env.EGS_SUB_TWITTER_TOKEN,
      token_secret: process.env.EGS_SUB_TWITTER_TOKEN_SECRET,
    })
    this.regist()
  }
  regist() {
    this.t.on('tweet', data => {
      console.dir(data)
      this.emit('message', {
        message: data.text,
        name: data.user.name,
        icon: data.user.profile_image_url_https,
        service: 'twitter',
        service_icon: 'https://abs.twimg.com/icons/apple-touch-icon-192x192.png'
      })
    })
    process.env.EGS_SUB_TWITTER_TRACKS.split(',').forEach(track => {
      this.t.track(track)
    })
  }
}
