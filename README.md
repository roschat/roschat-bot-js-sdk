# roschat-bot-js-sdk
JavaScript SDK для написания ботов для сервера РОСЧАТ. [Описание протокола ботов](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api).

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
const cb = (res) => console.log(res)
bot.sendMessage({cid: 100}, 'Тестовое сообщение', cb)
// тоже самое что
bot.emit('send-bot-message', {cid: 100, data: 'Тестовое сообщение'}, cb)
```

## Методы RoschatBot
### Открытие сессии:
Инициализировать работу бота

__`start(): new Promise`__


### Обмен сообщениями
**Событие [bot-message-event](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-send-bot-message)**

Уведомление о новом сообщении от пользователя

__`on(BOT_MESSAGE_EVENT, function)`__


**Запрос [send-bot-message](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-send-bot-message)**

Отправить сообщения пользователю

__`sendMessage({cid, [cidType, dataType, replyId]}, data, callback)`__


**Запрос [bot-message-received](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-bot-message-received)**

Сообщить о получении сообщения пользователя

__`sendMessageReceived({id}, callback)`__


**Запрос [bot-message-watched](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-bot-message-watched)**

Сообщить о просмотре сообщения пользователя

__`sendMessageWatched({id}, callback)`__


**Запрос [delete-bot-message](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-delete-bot-message)**

Удалить сообщение в чате

__`deleteBotMessage({id}, callback)`__


**Запрос [get-bot-messages](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-get-bot-messages)**

Запрос истории сообщений (начиная с последних записей в обратном порядке без учета удаленных сообщений).

__`getBotMessages({ cid, [cidType, beginId, cound, endId] }, callback)`__


**Запрос [get-bot-message](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-get-bot-message)**

Запрос сообщения.

__`getBotMessage({ cid, id, [cidType] }, callback)`__


**Запрос [get-bot-message-details](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-get-bot-message-details)**

Запрос деталей сообщения для группового чата.

__`getBotMessageDetails({ cid, id, [cidType] }, callback)`__

**Запрос [get-bot-messages-changes](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-get-bot-messages-changes)**

Запрос изменений истории сообщений.

__`getBotMessagesChanges({ cid, [cidType, minRev, endId] }, callback)`__


**Запрос [get-bot-messages-last-revision](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-get-bot-messages-last-revision)**

Запрос последней ревизии изменений сообщений.

__`getBotMessagesLastRevision(callback)`__

**Запрос [get-bot-messages-last-revision](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-get-bot-messages-last-revision)**

Запрос последней ревизии изменений сообщений.

__`getBotMessagesLastRevision(callback)`__

**Событие [bot-message-event](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-send-bot-message)**

Уведомление о новом сообщении беседы с ботом.

__`on(DELETE_BOT_CONVERSATION_EVENT, function)`__

## Чаты
**Запрос [get-bot-chats-changes](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-get-bot-chats-changes)**

Запрос изменений списка чатов.

__`getBotChatsChanges({minRev}, callback)`__

**Запрос [get-bot-messages-last-revision](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-get-bot-messages-last-revision)**

Запрос последней ревизии чатов.

__`getBotMessagesLastRevision(callback)`__
### Работа с клавиатурой
**Событие [bot-button-event](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-bot-button-event)**

Нажатие кнопки пользователем

__`on(BOT_BUTTON_EVENT, function)`__

**Запрос [set-bot-keyboard](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-set-bot-keyboard)**

Установить клавиатуру в чате с пользователем

__`setBotKeyboard({cid, keyboard[, action]})`__

### Работа со СКУД
**Событие [bbot-get-acs-info](https://github.com/roschat/roschat-docs/wiki/roschat-bot-api-bot-get-acs-info)**

Запрос ботом информации о пользователе РОСЧАТ из системы контроля и управления доступом (СКУД).

__`getBotAcsInfo({cid}, callback)`__

## Пример бота
В папке [`example`](https://github.com/roschat/roschat-bot-js-sdk/tree/master/example) можно найти реализацию бота для сервера РОСЧАТ с использованием данного SDK.
