const { HttpClient, eventBus } = require('./http')
const SocketClient = require('./socket')

class RoschatBot {
  constructor ({ config, options = {}, commands }) {
    this.config = config
    this.httpClient = new HttpClient(this.config)
    this.serverConfig = null
    eventBus.on('got-server-config', (data) => {
      this.serverConfig = data
      this.socketClient = new SocketClient({ config, options, commands, serverConfig: data })
    })
    // this.token = token
    // this.baseUrl = options.baseUrl
    // this.webSocketsPort = options.webSocketsPort
  }
}

module.exports = RoschatBot
