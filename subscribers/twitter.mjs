import Twitter from 'twitter'
import EventEmitter from 'events'

export default class extends EventEmitter {
  constructor() {
    super()
    this.client = new Twitter({
      consumer_key: process.env.EGS_SUB_TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.EGS_SUB_TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.EGS_SUB_TWITTER_TOKEN,
      access_token_secret: process.env.EGS_SUB_TWITTER_TOKEN_SECRET,
    })
    this.t = this.client.stream('statuses/filter', {
      track: process.env.EGS_SUB_TRACKS
    })
    this.regist()
  }
  regist() {
    this.t.on('data', data => {
      // ignore retweet if ignore flag was turned on
      if (process.env.EGS_SUB_TWITTER_IGNORE_RT === '1' && data.retweeted_status) return
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
    this.t.on('error', error => {
      throw error
    })
  }
}
