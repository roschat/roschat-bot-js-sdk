# roschat-bot
JavaScript SDK для написания ботов для сервера РОСЧАТ. [Описание протокола](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api) ботов.

## Установка
Склонируйте git репозиторий
```
git clone https://github.com/roschat/roschat-bot-js-sdk
cd roschat-bot-js-sdk
npm install
```
Или установите с помощью NPM
```
npm install roschat-bot --save
```


## Использование
Импортируйте класс `RochatBot` из модуля `roschat-bot` и создайте новый экземпляр класса
```js
const { RoschatBot } = require('roschat-bot')
// Или если склонировали репозиторий, то в файле `./bot/index.js`
// const { RoschatBot } = require('../index')

const bot = new RoschatBot({
  config: {
    token: 'YOUR_BOT_TOKEN', // сгенерированый уникальный токен
    name: 'YOUR_BOT_NAME', // название бота
    baseUrl: 'https://example.com' // адрес сервера РОСЧАТ
  }
})
```

Для начала прослушивания событий используйте `bot.start()`
```js
bot.start()
  .then(res => {
    // Обработчики событий сервера
  })
  .catch(error => {
    // Обработка ошибки при инициализации
  })
```

## Пример API
Обработка входящего события от сервера
```js
const { BOT_MESSAGE_EVENT, RoschatBot } = require('roschat-bot')
// ...
bot.on(BOT_MESSAGE_EVENT, (res) => {
  // Обработчики сообщения от пользователя
})
```
Событие "отправить сообщение"
```js
bot.sendMessage({cid: 100}, 'Тестовое сообщение', callbackFunc)
// тоже самое что
bot.emit('send-bot-message', {cid: 100, data: 'Тестовое сообщение'}, callbackFunc)
```

## Методы RoschatBot
### Инициализация:
#### `start(): new Promise`
Вызывается для получения конфигурации сервера и инициализации бота 

### Обработка сообщений:
#### `on(BOT_MESSAGE_EVENT, function)`
Событие `bot-message-event` - Уведомление о новом сообщении от пользователя ([описание](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-send-bot-message))

#### `sendMessage({data, cid[, cidType, dataType,  dataFile, replyId]}[, callback])`
Для отправки сообщения пользователю ([описание](
https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-send-bot-message
))

#### `sendMessageReceived({id}[, callback])`
Сообщить о получении ботом сообщения пользователя ([описание](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-bot-message-received))

#### `sendMessageWatched({id}[, callback])`
Сообщить о просмотре сообщения пользователя ([описание](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-bot-message-watched))

#### `deleteBotMessage({id}[, callback])`
Запрос на удаление сообщение ботом ([описание](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-delete-bot-message))

### Обработка нажатий кнопок
#### `on(BOT_BUTTON_EVENT, function)`
Событие `bot-button-event` - нажатие кнопки пользователем ([описание](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-bot-button-event))

#### `setBotKeyBoard({cid, keyboard[, action]})`
Установить клавиатуру в чате с пользователем ([описание](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-set-bot-keyboard))


## Пример бота
В папке [`example`](https://github.com/roschat/roschat-bot-js-sdk/tree/master/example) можно найти реализацию бота для сервера Росчат с использованием данного SDK. 
