import dotenv from 'dotenv-safe'

import { twitter as twitterSubscriber } from './subscribers'
import { slack as slackPublisher } from './publishers'

dotenv.load()
