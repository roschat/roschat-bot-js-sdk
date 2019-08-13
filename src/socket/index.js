const io = require('socket.io-client')

class SocketClient {
  constructor ({ config, serverConfig, commands, options }) {
    this.socket = null
    this.commands = commands
    this.initSocket(config, serverConfig, options)
    for (const event in commands.on) {
      console.log('event: ', event)
      const { eventName, cb } = commands.on[event]
      this.socket.on(eventName, cb)
    }
  }

  initSocket (config, serverConfig, options = { query: 'type-bot' }) {
    this.socket = io(`${config.baseUrl}:${serverConfig.webSocketsPort}`, options)
    this.socket.on('connect', (msg) => {
      const { eventName, options, cb } = this.commands.emit.startBot
      this.socket.emit(eventName, options, cb)
    })
  }
}

module.exports = SocketClient
