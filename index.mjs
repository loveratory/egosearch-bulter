import * as subscribers from './subscribers'
import * as publishers from './publishers'

import config from './config'

const enabledSubServices = []

config.services.subscribers.forEach(ss => {
  enabledSubServices.push(new subscribers[ss]())
})

config.services.publishers.forEach(ps => {
  enabledSubServices.forEach(ess => {
    publishers[ps].init(ess)
  })
})
