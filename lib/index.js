const { HttpClient, eventBus } = require('./http')
const { SEND_BOT_MESSAGE, BOT_MESSAGE_RECEIVED, BOT_MESSAGE_WATCHED, SET_BOT_KEYBOARD, DELETE_BOT_MESSAGE } = require('./events')
const SocketClient = require('./socket')

/**
 * Represents class for creating bot for Roschat servers
 * @class RoschatBot
 */
class RoschatBot {
  /**
   * Creates an instance of RoschatBot.
   * @constructor
   * @param {Object} options - Options to construct class instance
   * @param {{token: string, name: string, baseUrl: string}} options.config - Config for creating new bot instance
   * @param {Object} options.socketOptions - Options for new socket connection
   * @memberof RoschatBot
   */
  constructor ({ config, socketOptions }) {
    this.config = config
    this.socketOptions = socketOptions
    this.serverConfig = null
    this.socket = null
    this.socketClient = null
  }

  /**
   * Gets server config and starts socket connection
   * @returns {Promise}
   * @memberof RoschatBot
   */
  start () {
    return new Promise((resolve, reject) => {
      this.httpClient = new HttpClient(this.config)
      eventBus.on('got-server-config', (data) => {
        this.serverConfig = data
        this.socketClient = new SocketClient({ config: this.config, socketOptions: this.socketOptions, serverConfig: data })
        this.socket = this.socketClient.socket
        const { token, name } = this.config
        this.socket.emit('start-bot', { token, name }, (res) => {
          if (res.error) {
            reject(res.error)
          } else {
            resolve(res)
          }
        })
      })
    })
  }

  /**
   * Handles incoming events
   * @param {String} eventName - event name
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  on (eventName, callback) {
    this.socket.on(eventName, callback)
  }

  /**
   * Invokes event by its name
   * @param {String} eventName - event name
   * @param {Object} params - provided event data
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  emit (eventName, params, callback) {
    this.socket.emit(eventName, params, callback)
  }

  /**
   * Invokes 'send-bot-message' event
   * @fires RoschatBot#send-bot-message
   * @param {{cid: string, cidType: 'user' | 'group', dataType: 'text' | 'data' | 'unstored' | 'system', replyId: number}} params - provided parameters for event
   * @param {string} data - message from bot
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  sendMessage (params, data, callback) {
    if (!params.cid) {
      console.log('Для отправки сообщения необходимо cid пользователя')
      return
    }
    if (params.dataType && !['text', 'data', 'unstored', 'system'].includes(params.dataType)) {
      console.log('Поле dataType должно иметь одно из следующих значений: text, data, unstored, system')
      return
    }
    function onSendMessageError (res) {
      if (!res.id) {
        console.log('Не удалось отправить сообщение')
      }
    }

    this.emit(SEND_BOT_MESSAGE, { ...params, data }, callback || onSendMessageError)
  }

  /**
   * Invokes 'bot-message-received' event
   * @param {Object} params
   * @param {number} params.id - id of message to mark as received
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  sendMessageReceived (params, callback) {
    function onSendMessageReceivedError (res) {
      if (res.error) {
        console.log('Не удалось отметить сообщение полученным: ', params)
      }
    }
    this.emit(BOT_MESSAGE_RECEIVED, params, callback || onSendMessageReceivedError)
  }

  /**
   * Invokes 'bot-message-watched' event
   * @param {Object} params
   * @param {number} params.id - id of message to mark as watched
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  sendMessageWatched (params, callback) {
    function onSendMessageWatchedError (res) {
      if (res.error) {
        console.log('Не удалось отметить сообщение просмотренным: ', params)
      }
    }
    this.emit(BOT_MESSAGE_WATCHED, params, callback || onSendMessageWatchedError)
  }

  /**
   * Interact with bot keyboard
   * @param {{cidType: 'user' | 'group', cid: number, keyboard: Array, action: string}} params - event params
   * @memberof RoschatBot
   */
  setBotKeyboard (params) {
    if (params.keyboard === undefined) {
      console.log('Обязательное поле keyboard не предоставлено')
    }
    this.emit(SET_BOT_KEYBOARD, params)
  }

  /**
   * Invokes 'delete-bot-message' event
   * @param {{id: number}} params - request params
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  deleteBotMessage (params, callback) {
    if (!params.id) {
      console.log('Обязательное поле id не предоставлено')
    }
    function onDeleteBotMessageError (res) {
      if (res.error) {
        console.log(`${res.error}: Не удалось удалить сообщение ${params.id}`)
      }
    }
    this.emit(DELETE_BOT_MESSAGE, params, callback || onDeleteBotMessageError)
  }
}

module.exports = RoschatBot
