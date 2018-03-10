import * as subscribers from './subscribers'
import * as publishers from './publishers'

import config from './config'

import EgosearchBulter from './lib'

const bulter = new EgosearchBulter()
// disregard messages
bulter.use((data) => {
  const message = data.message
  const rm = config.disregards.map(keyword => message.includes(keyword))
  return !rm.includes(true)
})

config.services.publishers.forEach(ps => {
  const publisher = new publishers[ps]
  bulter.on('message', publisher.socket())
})

config.services.subscribers.forEach(ss => {
  const subscriber = new subscribers[ss]
  subscriber.on('message', bulter.socket())
})
