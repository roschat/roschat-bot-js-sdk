const io = require('socket.io-client')
const { START_BOT } = require('../events')

class SocketClient {
  constructor ({ config, serverConfig, commands, options }) {
    this.socket = null
    this.commands = commands
    this.initSocket(config, serverConfig, options)
    for (const event in commands.on) {
      const { cb } = commands.on[event]
      this.socket.on(event, cb)
    }
  }

  initSocket (config, serverConfig, options = { query: 'type-bot' }) {
    this.socket = io(`${config.baseUrl}:${serverConfig.webSocketsPort}`, options)
    this.socket.on('connect', (msg) => {
      const { options, cb } = this.commands.emit[START_BOT]
      this.socket.emit(START_BOT, options, cb)
    })
  }
}

module.exports = SocketClient
