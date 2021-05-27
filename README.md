# roschat-bot-js-sdk
JavaScript SDK для написания ботов для сервера РОСЧАТ. [Описание протокола](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api) ботов.

## Установка
Установите с помощью NPM
```
npm install roschat-bot-js-sdk --save
```
или склонируйте git репозиторий
```
git clone https://github.com/roschat/roschat-bot-js-sdk
cd roschat-bot-js-sdk
npm install
```


## Использование
Импортируйте класс `RochatBot` из модуля `roschat-bot` и создайте новый экземпляр класса
```js
const { RoschatBot } = require('roschat-bot')
// Или если склонировали репозиторий, то в файле `./bot/index.js`
// const { RoschatBot } = require('../index')

const bot = new RoschatBot({
  token: 'YOUR_BOT_TOKEN', // сгенерированый уникальный токен
  name: 'YOUR_BOT_NAME', // название бота
  baseUrl: 'https://example.com' // адрес сервера РОСЧАТ
})
```

Для инициализации и запуска бота используйте `bot.start()`
```javascript
bot.start()
  .then(_ => {
    // Обработчики событий сервера
  })
  .catch(error => {
    // Обработка ошибки при инициализации
  })
```

## Простой пример
Обработка входящего события от сервера
```js
const { BOT_MESSAGE_EVENT, RoschatBot } = require('roschat-bot')

try {
  await bot.start()
  bot.on(BOT_MESSAGE_EVENT, (res) => {
    console.log('Получено сообщение: ', res.id, res.cid, res.data)
  })
} catch (err) {
  console.log(err)
}
```

Запрос "бот -> сервер" "отправить сообщение"
```js
bot.sendMessage({cid: 100}, 'Тестовое сообщение', callbackFunc)
// тоже самое что
bot.emit('send-bot-message', {cid: 100, data: 'Тестовое сообщение'}, callbackFunc)
```

## Методы RoschatBot
### Инициализация:
Инициализировать работу бота

__`start(): new Promise`__


### Работа с сообщениями
**Событие `bot-message-event`**

Уведомление о новом сообщении от пользователя ([описание](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-send-bot-message))

__`on(BOT_MESSAGE_EVENT, function)`__


**Запрос `send-bot-message`**

Отправить сообщения пользователю ([описание](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-send-bot-message
))

__`sendMessage({cid[, cidType, dataType, replyId]}, data[, callback])`__


**Запрос `bot-message-received`**

Сообщить о получении сообщения пользователя ([описание](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-bot-message-received))

__`sendMessageReceived({id}[, callback])`__


**Запрос `bot-message-watched`**

Сообщить о просмотре сообщения пользователя ([описание](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-bot-message-watched))

__`sendMessageWatched({id}[, callback])`__



**Запрос `delete-bot-message`**

Удалить сообщение в чате ([описание](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-delete-bot-message))

__`deleteBotMessage({id}[, callback])`__

### Работа с клавиатурой
**Событие `bot-button-event`**

Нажатие кнопки пользователем ([описание](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-bot-button-event))

__`on(BOT_BUTTON_EVENT, function)`__

**Запрос `set-bot-keyboard`**

Установить клавиатуру в чате с пользователем ([описание](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-set-bot-keyboard))

__`setBotKeyboard({cid, keyboard[, action]})`__

## Пример бота
В папке [`example`](https://github.com/roschat/roschat-bot-js-sdk/tree/master/example) можно найти реализацию бота для сервера РОСЧАТ с использованием данного SDK. 
