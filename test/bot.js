const config = require('./config')
const RoschatBot = require('../src/index')
const axios = require('axios')

const { name, token } = config

const emit = {
  startBot: {
    eventName: 'start-bot',
    options: { name, token },
    cb (data) {
      console.log('> Bot started', data)
    }
  },
  sendBotMessage: {
    eventName: 'send-bot-message',
    cb (data) {
      console.log('> Message sent to user', data)
    }
  },
  botMessageReceived: {
    eventName: 'bot-message-received',
    cb (data) {
      console.log('> Message from bot received', data)
    }
  },
  setBotKeyboard: {
    eventName: 'set-bot-keyboard',
    cb (data) {
      console.log('> Установлена новая клавиатура')
    }
  }
}
let onNews = function (cid) {
  const { eventName, cb } = emit.sendBotMessage
  this.emit(eventName, { cid, data: 'Сейчас будут новости!' }, cb)
}
let onKeyboard = function (cid) {
  const { eventName, cb } = emit.setBotKeyboard
  const keyboard = [
    [
      {
        text: 'Шутка',
        callbackData: 'jokes'
      },
      {
        text: 'Новости',
        callbackData: 'news'
      }
    ]
  ]
  this.emit(eventName, { cid, keyboard, action: 'show' }, cb)
}
let onDefaultText = function (cid, data) {
  const { eventName, cb } = emit.sendBotMessage
  this.emit(eventName, { cid, data: `Ваше сообщение наоборот: ${data.split('').reverse().join('')}` }, cb)
}
let onStart = function (cid) {
  const { eventName, cb } = emit.sendBotMessage
  this.emit(eventName, { cid, data: 'Приветстую!' }, cb)
}
let onJoke = function (cid) {
  axios.get('https://icanhazdadjoke.com/', {
    headers: {
      Accept: 'application/json'
    }
  })
    .then(res => {
      const { eventName, cb } = emit.sendBotMessage
      this.emit(eventName, { cid, data: res.data.joke }, cb)
    })
}
const on = {
  botMessageEvent: {
    eventName: 'bot-message-event',
    cb (res) {
      onStart = onStart.bind(this)
      onDefaultText = onDefaultText.bind(this)
      onKeyboard = onKeyboard.bind(this)
      onNews = onNews.bind(this)
      onJoke = onJoke.bind(this)
      const { cid, data, dataType } = res
      switch (data) {
        case '/start':
          onStart(cid)
          break
        case '/news':
          onNews(cid)
          break
        case '/keyboard':
          onKeyboard(cid)
          break
        case '/joke':
          onJoke(cid)
          break
        default:
          if (dataType === 'text') {
            onDefaultText(cid, data)
          } else {
            console.log('> не текстовое сообщение от пользователя')
          }
      }
    }
  },
  botButtonEvent: {
    eventName: 'bot-button-event',
    cb (res) {
      const { cid, callbackData } = res
      onNews = onNews.bind(this)
      onJoke = onJoke.bind(this)
      switch (callbackData) {
        case 'jokes':
          onJoke(cid)
          break
        case 'news':
          onNews(cid)
          break
      }
    }
  }
}

/* eslint-disable-next-line */
const newBot = new RoschatBot({ config, commands: { emit, on } })