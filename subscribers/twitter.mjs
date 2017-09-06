import Twitter from 'node-tweet-stream'
import EventEmitter from 'events'

export default class extends EventEmitter {
  constructor() {
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
    })
  }
}