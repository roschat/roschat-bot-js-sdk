const io = require('socket.io-client')

/**
 * Class for creatig new socket connection
 * @class SocketClient
 */
class SocketClient {
  /**
   * Creates an instance of SocketClient.
   * @constructor
   * @param {Object} options
   * @param {{token: string, name: string, baseUrl: string}} options.config - Config for creating new bot instance
   * @param {{webSocketsPort: string}} options.serverConfig - Config of Roschat server
   * @param {Object} options.socketOptions - Options for new socket connectiong
   */
  constructor ({ config, serverConfig, socketOptions }) {
    this.initSocket(config, serverConfig, socketOptions)
  }

  initSocket (config, serverConfig, socketOptions = { query: 'type-bot' }) {
    this.socket = io(`${config.baseUrl}:${serverConfig.webSocketsPort}`, socketOptions)
  }
}

module.exports = SocketClient
