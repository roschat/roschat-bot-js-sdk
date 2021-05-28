import {HttpClient} from './http'
import {BOT_MESSAGE_RECEIVED, BOT_MESSAGE_WATCHED, DELETE_BOT_MESSAGE, GET_BOT_ACS_INFO, GET_BOT_CHATS_CHANGES, GET_BOT_CHATS_LAST_REVISION, GET_BOT_MESSAGE, GET_BOT_MESSAGES, GET_BOT_MESSAGES_CHANGES, GET_BOT_MESSAGES_LAST_REVISION, GET_BOT_MESSAGE_DETAILS, SEND_BOT_MESSAGE, SET_BOT_KEYBOARD, START_BOT, } from './events'
import {SocketClient} from './socket'
import { anyEventType, Bot, BotConfig } from './types'
import fn from './utils/fn'

export class RoschatBot implements Bot {
  config: BotConfig
  socket!: SocketClient["socket"]
  httpClient!: HttpClient
  /**
   * Creates an instance of RoschatBot.
   * @constructor
   * @param {Object} options - Options to construct class instance
   * @param {{token: string, name: string, baseUrl: string}} options.config - Config for creating new bot instance
   * @memberof RoschatBot
   */
  constructor (config: BotConfig) {
    this.config = config
    this.httpClient = new HttpClient()
  }

  public async connect (): Promise<void> {
    const serverConfig = await this.httpClient.getServerConfig(this.config.baseUrl)
    const socketClient = new SocketClient(this.config, serverConfig)
    socketClient.init()
    this.socket = socketClient.socket
    return new Promise((resolve) => {
      socketClient.socket.on('connect', () => {resolve()})
    })
  }

  /**
   * Gets server config and starts socket connection
   * @returns {Promise}
   * @memberof RoschatBot
   */
  public async start (): Promise<any> {
    await this.connect()
    return new Promise((resolve, reject) => {
      const { token, name } = this.config
      this.emit(START_BOT, { token, name }, (res: {error: string}) => {
        if (res.error) {
          reject(res.error)
        } else {
          resolve(res)
        }
      })
    })
  }

  /**
   * Handles incoming events
   * @param {String} eventName - event name
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  on (eventName: anyEventType, callback: any) {
    this.socket.on(eventName, callback)
  }

  /**
   * Invokes event by its name
   * @param {String} eventName - event name
   * @param {Object} params - provided event data
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  emit (eventName: anyEventType, params?: any, callback?: Function) {
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
  public sendMessage (
    params: {
      cid: any;
      dataType?: any;
      token?: any;
      name?: any;
      cidType?: "user" | "group" | undefined;
      keyboard?: any[] | undefined;
      action?: string | undefined;
      id?: number | undefined
    },
    data: any,
    callback: (...args: any[]) => void = fn
  ) {
    if (!params.cid) {
      throw new Error('Для отправки сообщения необходимо cid пользователя')
    }
    if (params.dataType && !['text', 'data', 'unstored', 'system'].includes(params.dataType)) {
      throw new Error('Поле dataType должно иметь одно из следующих значений: text, data, unstored, system')
    }

    this.emit(SEND_BOT_MESSAGE, { ...params, data }, callback)
  }

  /**
   * Invokes 'bot-message-received' event
   * @param {Object} params
   * @param {number} params.id - id of message to mark as received
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  public sendMessageReceived (
    params: any,
    callback: (...args: any[]) => void = fn
  ) {
    this.emit(BOT_MESSAGE_RECEIVED, params, callback)
  }

  /**
   * Invokes 'bot-message-watched' event
   * @param {Object} params
   * @param {number} params.id - id of message to mark as watched
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  public sendMessageWatched (
    params: any,
    callback: (...args: any[]) => void = fn
  ) {
    this.emit(BOT_MESSAGE_WATCHED, params, callback)
  }

  /**
   * Interact with bot keyboard
   * @param {{cidType: 'user' | 'group', cid: number, keyboard: Array, action: string}} params - event params
   * @memberof RoschatBot
   */
  public setBotKeyboard (
    params: {
      cidType: 'user' | 'group',
      cid: number,
      keyboard: Array<any>,
      action: string
    },
    callback: (...args: any[]) => void = fn
  ) {
    if (params.keyboard === undefined) {
      throw new Error('Обязательное поле keyboard не предоставлено')
    }
    this.emit(SET_BOT_KEYBOARD, params, callback)
  }

  /**
   * Invokes 'delete-bot-message' event
   * @param {{id: number}} params - request params
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  public deleteBotMessage (
    params: { id: number },
    callback: (...args: any[]) => void = fn
  ) {
    if (!params.id) {
      throw new Error('Обязательное поле id не предоставлено')
    }
    if (callback && !(callback instanceof Function)) {
      throw new Error('callback должен быть функцией')
    }
    this.emit(DELETE_BOT_MESSAGE, params, callback)
  }

  /**
   * Invokes 'get-bot-messages' event
   * @param {Object} params - provided parameters for event
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  public getBotMessages(
    params: {
     cidType?: 'user' |'group',
     cid: number,
     beginId?: number,
     count?: number,
     endId?: number
    },
    callback: (...args: any[]) => void = fn
  ) {
    if (callback && !(callback instanceof Function)) {
      throw new Error('callback должен быть функцией')
    }
    this.emit(GET_BOT_MESSAGES, params, callback)
  }

  /**
   * Invokes 'get-bot-message' event
   * @param {Object} params - provided parameters for event
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  public getBotMessage(
    params: {
     cidType?: 'user' |'group',
     cid: number,
     id: number
    },
    callback: (...args: any[]) => void = fn
  ) {
    if (callback && !(callback instanceof Function)) {
      throw new Error('callback должен быть функцией')
    }
    this.emit(GET_BOT_MESSAGE, params, callback)
  }

  /**
   * Invokes 'get-bot-message-details' event
   * @param {Object} params - provided parameters for event
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  public getBotMessageDetails(
    params: {
     cidType?: 'user' |'group',
     cid: number,
     id: number
    },
    callback: (...args: any[]) => void = fn
  ) {
    if (callback && !(callback instanceof Function)) {
      throw new Error('callback должен быть функцией')
    }
    this.emit(GET_BOT_MESSAGE_DETAILS, params, callback)
  }

  /**
   * Invokes 'get-bot-messages-changes' event
   * @param {Object} params - provided parameters for event
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  public getBotMessagesChanges(
    params: {
     cidType?: 'user' |'group',
     cid: number,
     minRev?: number,
     endId?: number
    },
    callback: (...args: any[]) => void = fn
  ) {
    if (callback && !(callback instanceof Function)) {
      throw new Error('callback должен быть функцией')
    }
    this.emit(GET_BOT_MESSAGES_CHANGES, params, callback)
  }

  /**
   * Invokes 'get-bot-messages-last-revision' event
   * @param {Object} params - provided parameters for event
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  public getBotMessagesLastRevision(callback: (...args: any[]) => void = fn) {
    if (callback && !(callback instanceof Function)) {
      throw new Error('callback должен быть функцией')
    }
    this.emit(GET_BOT_MESSAGES_LAST_REVISION, null, callback)
  }

  /**
   * Invokes 'get-bot-chats-changes' event
   * @param {Object} params - provided parameters for event
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  public getBotChatsChanges(
    params: {minRev: number} | null,
    callback: (...args: any[]) => void = fn
  ) {
    if (callback && !(callback instanceof Function)) {
      throw new Error('callback должен быть функцией')
    }
    this.emit(GET_BOT_CHATS_CHANGES, params?.minRev ? params : {minRev: 0}, callback)
  }

  /**
   * Invokes 'get-bot-chats-last-revision' event
   * @param {Object} params - provided parameters for event
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  public getBotChatsLastRevision(callback: (...args: any[]) => void = fn) {
    if (callback && !(callback instanceof Function)) {
      throw new Error('callback должен быть функцией')
    }
    this.emit(GET_BOT_CHATS_LAST_REVISION, null, callback)
  }

  /**
   * Invokes 'bot-get-acs-info' event
   * @param {Object} params.cid - cid пользователя для получения информация
   * @param {Function} [callback] - function to call on server response
   * @memberof RoschatBot
   */
  public getBotAcsInfo(
    params: {cid: number},
    callback: (...args: any[]) => void = fn
  ) {
    if (callback && !(callback instanceof Function)) {
      throw new Error('callback должен быть функцией')
    }
    this.emit(GET_BOT_ACS_INFO, params, callback)
  }
}
