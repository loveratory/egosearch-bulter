import EventEmitter from 'events'
import util from 'util'

const checkFilters = async (data, filters) => {
  const results = await Promise.all(filters.map(filter => filter(data)))
  if (results.filter(v => !v).length > 0) {
    throw Error(`some filters didn't allow messages. ${util.inspect({filters: `[${filters.toString()}]`, results})}`)
  }
}

export default class extends EventEmitter {
  constructor () {
    super()
    this.filters = []
  }

  socket () {
    return (message) => {
      this.junction(message).catch(console.error)
    }
  }

  async junction (message) {
    await checkFilters(message, this.filters)
    this.emit('message', message)
  }

  use (fn) {
    this.filters.push(fn)
  }
}
