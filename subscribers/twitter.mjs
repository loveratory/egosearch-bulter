import Twitter from 'twitter'
import EventEmitter from 'events'

import config from '../config'

const messageExtractor = (data) => {
  let message = data.text
  // if retweeted status, create custom message
  if (data.retweeted_status) {
    message = `RT @${data.retweeted_status.user.screen_name}: ${messageExtractor(data.retweeted_status)}`
  }
  // if quoted, non retweeted status, create custom message
  if (data.is_quote_status && !data.retweeted_status && data.quoted_status) {
    message = `QT ${data.text.substr(...data.display_text_range)} @${data.quoted_status.user.screen_name}: ${messageExtractor(data.quoted_status)}`
  }
  // if data.entries.urls, replace URLs on message with it origin URLs 
  if (data.entities.urls) {
    data.entities.urls.forEach(url => {
      message = message.replace(url.url, url.expanded_url)
    })
  }
  return message
}

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
      track: config.tracks.join(',')
    })
    this.regist()
  }

  extractMessage(data) {
    let message = data.text
    // if retweeted status, create custom message
    if (data.retweeted_status) {
      message = `RT @${data.retweeted_status.user.screen_name}: ${messageExtractor(data.retweeted_status)}`
    }
    // if quoted, non retweeted status, create custom message
    if (data.is_quote_status && !data.retweeted_status && data.quoted_status) {
      message = `QT ${data.text.substr(...data.display_text_range)} @${data.quoted_status.user.screen_name}: ${messageExtractor(data.quoted_status)}`
    }
    // if data.entries.urls, replace URLs on message with it origin URLs 
    if (data.entities.urls) {
      data.entities.urls.forEach(url => {
        message = message.replace(url.url, url.expanded_url)
      })
    }
    return message
  }

  regist() {
    this.t.on('data', data => {
      // ignore retweet if ignore flag was turned on
      if (process.env.EGS_SUB_TWITTER_IGNORE_RT === '1' && data.retweeted_status) return
      this.emit('message', {
        message: this.extractMessage(data),
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
