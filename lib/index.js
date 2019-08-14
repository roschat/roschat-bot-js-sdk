const { HttpClient, eventBus } = require('./http')
const { SEND_BOT_MESSAGE, BOT_MESSAGE_RECEIVED, BOT_MESSAGE_WATCHED, SET_BOT_KEYBOARD, DELETE_BOT_MESSAGE } = require('./events')
const SocketClient = require('./socket')

class RoschatBot {
  constructor ({ config, options = {}, commands }) {
    this.config = config
    this.serverConfig = null
    this.socket = null
    this.socketClient = null
  }

  start () {
    return new Promise((resolve, reject) => {
      this.httpClient = new HttpClient(this.config)
      eventBus.on('got-server-config', (data) => {
        this.serverConfig = data
        this.socketClient = new SocketClient({ config: this.config, options: this.options, serverConfig: data })
        this.socket = this.socketClient.socket
        const { token, name } = this.config
        this.socket.emit('start-bot', { token, name }, (res) => resolve(res))
      })
    })
  }

  on (eventName, callback) {
    this.socket.on(eventName, callback)
  }

  emit (eventName, options, callback) {
    this.socket.emit(eventName, options, callback)
  }

  sendMessage (options, data, cb) {
    if (!options.cid) {
      console.log('Для отправки сообщения необходимо cid пользователя')
      return
    }
    function onSendMessageError (res) {
      if (!res.id) {
        console.log('Не удалось отправить сообщение')
      }
    }
    this.emit(SEND_BOT_MESSAGE, { ...options, data }, cb || onSendMessageError)
  }

  sendMessageReceived (options, cb) {
    function onSendMessageReceivedError (res) {
      if (res.error) {
        console.log('Не удалось отметить сообщение полученным: ', options)
      }
    }
    this.emit(BOT_MESSAGE_RECEIVED, options, cb || onSendMessageReceivedError)
  }

  sendMessageWatched (options, cb) {
    function onSendMessageWatchedError (res) {
      if (res.error) {
        console.log('Не удалось отметить сообщение просмотренным: ', options)
      }
    }
    this.emit(BOT_MESSAGE_WATCHED, options, cb || onSendMessageWatchedError)
  }

  setBotKeyboard (options) {
    if (!options.keyboard) {
      console.log('Обязательное поле keyboard не предоставлено')
    }
    this.emit(SET_BOT_KEYBOARD, options)
  }

  deleteBotMessage (options, cb) {
    if (!options.id) {
      console.log('Обязательное поле id не предоставлено')
    }
    function onDeleteBotMessageError (res) {
      if (res.error) {
        console.log(`${res.error}: Не удалось удалить сообщение ${options.id}`)
      }
    }
    this.emit(DELETE_BOT_MESSAGE, options, cb || onDeleteBotMessageError)
  }
}

module.exports = RoschatBot
