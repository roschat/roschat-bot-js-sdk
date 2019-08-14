const io = require('socket.io-client')

class SocketClient {
  constructor ({ config, serverConfig, options }) {
    // this.socket = null
    this.initSocket(config, serverConfig, options)
  }

  initSocket (config, serverConfig, options = { query: 'type-bot' }) {
    this.socket = io(`${config.baseUrl}:${serverConfig.webSocketsPort}`, options)
  }
}

module.exports = SocketClient
