const axios = require('axios')
const EventEmmiter = require('events')
const eventBus = new EventEmmiter()

/**
 * Class for creating new http connection and fetching server params
 * @class HttpClient
 */
class HttpClient {
  /**
   * Creates an instance of HttpClient.
   * @constructor
   * @param {Object} config
   * @param {string} config.baseUrl - ip address of Roschat server
   * @memberof HttpClient
   */
  constructor (config) {
    this.getServerConfig(config.baseUrl).then(res => {
      eventBus.emit('got-server-config', res.data)
    })
  }

  /**
   * Gets Roschat server config
   * @param {string} url - ip address of Roschat server
   * @returns {Promise}
   * @memberof HttpClient
   */
  async getServerConfig (url) {
    const res = await axios.get(`${url}/ajax/config.json`)
    return res
  }
}

module.exports = { HttpClient, eventBus }
