const config = require('./config')
const { RoschatBot, START_BOT, SEND_BOT_MESSAGE, BOT_MESSAGE_EVENT, SET_BOT_KEYBOARD, BOT_BUTTON_EVENT, DELETE_BOT_MESSAGE, BOT_MESSAGE_RECEIVED, BOT_MESSAGE_WATCHED } = require('../index')
const axios = require('axios')

const { name, token } = config

const emit = {
  [START_BOT]: {
    options: { name, token },
    cb ({ error }) {
      if (error) {
        console.log('Ошибка: ', error)
      } else {
        console.log('> Бот запущен')
      }
    }
  },
  [SEND_BOT_MESSAGE]: {
    cb ({ id }) {
      console.log(`< Сообщение <${id}> доставлено пользователю`)
    }
  },
  [SET_BOT_KEYBOARD]: {
    cb (data) {
      console.log('> Установлена новая клавиатура')
      console.log(data)
    }
  },
  [BOT_MESSAGE_RECEIVED]: {
    cb ({ error }) {
      if (error) {
        console.log('Ошибка: ', error)
      } else {
        console.log(`< Сообщение доставлено боту`)
      }
    }
  },
  [BOT_MESSAGE_WATCHED]: {
    cb ({ error }) {
      if (error) {
        console.log('Ошибка: ', error)
      } else {
        console.log(`< Сообщение просмотрено ботом`)
      }
    }
  },
  [DELETE_BOT_MESSAGE]: {
    cb ({ error }) {
      if (error) {
        console.log('Ошибка: ', error)
      } else {
        console.log(`< Удаление сообщения`)
      }
    }
  }
}
const on = {
  [BOT_MESSAGE_EVENT]: {
    cb (res) {
      onStart = onStart.bind(this)
      onDefaultText = onDefaultText.bind(this)
      onKeyboard = onKeyboard.bind(this)
      onNews = onNews.bind(this)
      onJoke = onJoke.bind(this)
      const { cid, data, dataType, id } = res
      if (dataType === 'text') {
        this.emit(BOT_MESSAGE_RECEIVED, { id }, emit[BOT_MESSAGE_RECEIVED].cb)
        this.emit(BOT_MESSAGE_WATCHED, { id }, emit[BOT_MESSAGE_WATCHED].cb)
      }
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
  [BOT_BUTTON_EVENT]: {
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

let onNews = function (cid) {
  const { cb } = emit[SEND_BOT_MESSAGE]
  this.emit(SEND_BOT_MESSAGE, { cid, data: 'Сейчас будут новости!' }, cb)
}

let onKeyboard = function (cid) {
  const { cb } = emit[SET_BOT_KEYBOARD]
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
  this.emit(SET_BOT_KEYBOARD, { cid, keyboard, action: 'show' }, cb)
}

let onDefaultText = function (cid, data) {
  const { cb } = emit[SEND_BOT_MESSAGE]
  this.emit(SEND_BOT_MESSAGE, { cid, data: `Ваше сообщение наоборот: ${data.split('').reverse().join('')}` }, cb)
}

let onStart = function (cid) {
  const { cb } = emit[SEND_BOT_MESSAGE]
  this.emit(SEND_BOT_MESSAGE, { cid, data: 'Приветстую!' }, cb)
}

let onJoke = function (cid) {
  axios.get('https://icanhazdadjoke.com/', {
    headers: {
      Accept: 'application/json'
    }
  })
    .then(res => {
      this.emit(
        SEND_BOT_MESSAGE,
        { cid, data: `<b>Читай быстро, шутка скоро пропадет</b><br/>${res.data.joke}` },
        ({ id }) => {
          console.log('Шутка доставлена', id)
          setTimeout(() => this.emit(DELETE_BOT_MESSAGE, { id }, emit[DELETE_BOT_MESSAGE].cb), 5000)
        }
      )
    })
}

/* eslint-disable-next-line */
const newBot = new RoschatBot({ config, commands: { emit, on } })
