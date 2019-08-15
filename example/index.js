const { RoschatBot, BOT_MESSAGE_EVENT, BOT_BUTTON_EVENT } = require('../index')
const config = require('./config')

const bot = new RoschatBot({ config })

bot.start()
  .then(res => {
    bot.on(BOT_MESSAGE_EVENT, (res) => {
      const { cid, data, dataType, id } = res
      if (dataType === 'unstored') {
        return
      }
      bot.sendMessageReceived({ id })
      bot.sendMessageWatched({ id }, () => console.log(' > Сообщение помечено просмотренным'))
      switch (data) {
        case '/start':
          bot.sendMessage({ cid }, 'Сейчас начнем!')
          break
        case '/news':
          bot.sendMessage({ cid }, 'Сейчас будут новости!')
          break
        case '/keyboard':
          bot.sendMessage({ cid }, 'Сейчас будет клавиатура!')
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
          bot.setBotKeyboard({ cid, keyboard, action: 'show' })
          break
        case '/joke':
          bot.sendMessage({ cid }, 'Сейчас будет шутка!')
          break
        default:
          if (dataType === 'text') {
            bot.sendMessage({ cid }, `Ваше сообщение наоборот: <b> ${data.split('').reverse().join('')} </b>`)
          } else {
            bot.sendMessage({ cid }, 'Ваше сообщение имеет нетекстовый тип')
          }
      }
    })

    bot.on(BOT_BUTTON_EVENT, (data) => {
      console.log('нажата клавиша ', data)
      const { cid, callbackData } = data
      switch (callbackData) {
        case 'jokes':
          bot.sendMessage({ cid }, 'Сейчас будет шутка!')
          break
        case 'news':
          bot.sendMessage({ cid }, 'Сейчас будет новости!')
          break
      }
    })
    console.log('Бот успешно инициализирован')
  })
  .catch(error => {
    console.log('Возникла ошибка при подключении бота: ', error)
  })
