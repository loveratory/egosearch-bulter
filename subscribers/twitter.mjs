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
      console.log(`[twitter] message id: ${data.id}, id_str: ${data.id_str}`)
      this.emit('message', {
        message: data.text,
        origin: `https://twitter.com/${data.user.screen_name}/status/${data.id_str}`,
        user_name: data.user.name,
        user_icon: data.user.profile_image_url_https,
        user_id: data.user.screen_name,
        user_url: `https://twitter.com/${data.user.screen_name}`,
        service: 'twitter',
        service_icon: 'https://abs.twimg.com/icons/apple-touch-icon-192x192.png',
        timestamp: data.timestamp_ms / 1000
      })
    })
    process.env.EGS_SUB_TWITTER_TRACKS.split(',').forEach(track => {
      this.t.track(track)
    })
  }
}
