import io from 'socket.io-client'
import { BotConfig, ServerConfig } from '../types'

/**
 * Class for creatig new socket connection
 * @class SocketClient
 */
export class SocketClient {
  /**
   * Creates an instance of SocketClient.
   * @constructor
   * @param {{token: string, name: string, baseUrl: string}} config - Config for creating new bot instance
   * @param {{webSocketsPort: string}} serverConfig - Config of Roschat server
   */
    socket!: SocketIOClient.Socket
    baseUrl: string
    serverConfig: ServerConfig
  constructor (config: BotConfig, serverConfig: ServerConfig) {
    this.baseUrl = config.baseUrl
    this.serverConfig = serverConfig
  }

  public init () {
    const socketOptions = { query: 'type-bot', rejectUnauthorized: false }
    this.socket = io.connect(`${this.baseUrl}:${this.serverConfig.webSocketsPort}`, socketOptions)
  }
}
