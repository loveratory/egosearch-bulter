import dotenv from 'dotenv-safe'
import fs from 'fs'

if (fs.existsSync('.env')) {
  dotenv.load()
}

function parse_track_query (query) {
  return query ? query.split(',') : []
}

if (!process.env.EGS_SUB_SERVICES || !process.env.EGS_PUB_SERVICES) {
  throw new Error('should set environment variable or setup .env')
}

export default {
  services: {
    subscribers: process.env.EGS_SUB_SERVICES.split(',').map(v => v.trim()),
    publishers: process.env.EGS_PUB_SERVICES.split(',').map(v => v.trim())
  },
  tracks: parse_track_query(process.env.EGS_SUB_TRACKS),
  disregards: parse_track_query(process.env.EGS_SUB_DISREGARDS)
}
