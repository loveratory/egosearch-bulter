import dotenv from 'dotenv-safe'

dotenv.load()

if (!process.env.EGS_SUB_SERVICES || !process.env.EGS_PUB_SERVICES) {
  throw new Error('should set environment variable or setup .env')
}

return {
  services: {
    subscribers: process.env.EGS_SUB_SERVICES.split(',').map(v => v.trim()),
    publishers: process.env.EGS_PUB_SERVICES.split(',').map(v => v.trim())
  }
}
