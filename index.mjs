import dotenv from 'dotenv-safe'

import * as subscribers from './subscribers'
import * as publishers from './publishers'

dotenv.load()

const enabledSubServices = []

process.env.EGS_SUB_SERVICES.split(',').forEach(ss => {
  enabledSubServices.push(new subscribers[ss]())
})

process.env.EGS_PUB_SERVICES.split(',').forEach(ps => {
  enabledSubServices.forEach(ess => {
    publishers[ps].init(ess)
  })
})
