const { RoschatBot, BOT_MESSAGE_EVENT, BOT_BUTTON_EVENT } = require('../index')
const config = require('./config')

const bot = new RoschatBot({ config })

bot.start()
  .then(_ => {
    console.log('Бот успешно инициализирован')
    bot.on(BOT_MESSAGE_EVENT, (res) => {
      const { cid, data, dataType, id } = res
      if (dataType === 'unstored') return
      bot.sendMessageReceived({ id })
      bot.sendMessageWatched({ id }, () => console.log(' > Сообщение помечено просмотренным'))
      if (dataType === 'data') {
        const dataObj = JSON.parse(data)
        switch (dataObj.type) {
          case 'image':
          case 'location':
            bot.sendMessage(
              { cid, dataType: 'data' },
              data
            )
            break
          default:
            bot.sendMessage({ cid }, 'Не поддерживаемый тип сообщения')
        }
      } else if (dataType === 'text') {
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
      }
    })

    bot.on(BOT_BUTTON_EVENT, (data) => {
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
  })
  .catch(error => {
    console.log('Возникла ошибка при подключении бота: ', error)
  })
