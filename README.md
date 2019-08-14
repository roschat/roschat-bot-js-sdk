# roschat-bot
JavaScript SDK для написания ботов для сервера РОСЧАТ.

## Установка
Склонируйте git репозиторий
```
git clone https://github.com/roschat/roschat-bot-js-sdk
cd roschat-bot-js-sdk
npm install
```
Или установите из NPM
```
npm install roschat-bot --save
```


## Использование
Импортируйте класс `RochatBot` из модуля `roschat-bot` и создайте новый инстанс бота
```js
const { RoschatBot } = require('roschat-bot')
// Или если склонировали репозиторий, то в файле `./bot/index.js`
// const { RoschatBot } = require('../index')

const bot = new RoschatBot({
  config: {
    token: 'YOUR_BOT_TOKEN', // сгенерированый уникальный токен
    name: 'YOUR_BOT_NAME', // название бота
    baseUrl: 'https://example.com' // ip адрес сервера Росчат
  }
})
```

Для начала прослушивания событий используйте `bot.start()`
```js
bot.start().then(res => {
  // Ваши обработчики событий
})
```

## Пример API
Обработка входящего события от сервера
```js
const { BOT_MESSAGE_EVENT, RoschatBot } = require('roschat-bot')
// ...
bot.on(BOT_MESSAGE_EVENT, (res) => {
  // Ваши обработчики событий
})
```
Событие "отправить сообщение"
```js
bot.sendMessage({cid: 100}, 'Тестовое сообщение', callbackFunc)
// тоже самое что
bot.emit('send-bot-message', {cid: 100, data: 'Тестовое сообщение'}, callbackFunc)
```

## Методы

### Методы RoschatBot:

#### `on(eventName, function)`
Обработка одного из входящих событий `eventName`:
* **BOT_MESSAGE_EVENT** - Уведомление о новом сообщении от пользователя ([описание](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-send-bot-message))
* **BOT_BUTTON_EVENT** - Событие на нажатие кнопки клавиатуры ([описание](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-bot-button-event))

#### `sendMessage({data, cid[, cidType, dataType,  dataFile, replyId]}[, callback])`
Отправить сообщение пользователю ([описание](
https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-send-bot-message
))

#### `sendMessageReceived({id}[, callback])`
Сообщить о получении сообщения пользователя ([описание](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-bot-message-received))


#### `sendMessageWatched({id}[, callback])`
Сообщить о просмотре сообщения пользователя ([описание](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-bot-message-watched))

#### `setBotKeyBoard({cid, keyboard[, action]})`
Установить клавиатуру в чате с пользователем ([описание](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-set-bot-keyboard))

#### `start([options]): new Promise`
Вызов для получения конфигурации сервера и инициализации бота 


## Пример бота
В папке `example` можно найти пример имплементации бота для сервера Росчат с использованием данного SDK. 