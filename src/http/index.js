const axios = require('axios')
const EventEmmiter = require('events')
const eventBus = new EventEmmiter()

class HttpClient {
  constructor (config) {
    this.getServerConfig(config.baseUrl)
  }

  async getServerConfig (url) {
    const res = await axios.get(`${url}/ajax/config.json`)
    eventBus.emit('got-server-config', res.data)
    return res
  }
}

module.exports = { HttpClient, eventBus }
