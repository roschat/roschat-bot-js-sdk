type START_BOT = 'start-bot'
type SEND_BOT_MESSAGE = 'send-bot-message'
type BOT_MESSAGE_EVENT = 'bot-message-event'
type BOT_MESSAGE_RECEIVED = 'bot-message-received'
type BOT_MESSAGE_WATCHED = 'bot-message-watched'
type DELETE_BOT_MESSAGE = 'delete-bot-message'
type DELETE_BOT_CONVERSATION_EVENT = 'delete-bot-conversation-event'
type GET_BOT_MESSAGES = 'get-bot-messages'
type GET_BOT_MESSAGE = 'get-bot-message'
type GET_BOT_MESSAGE_DETAILS = 'get-bot-message-details'
type GET_BOT_MESSAGES_CHANGES = 'get-bot-messages-changes'
type GET_BOT_MESSAGES_LAST_REVISION = 'get-bot-messages-last-revision'
type GET_BOT_UNWATCHED_MESSAGES = 'get-bot-unwatched-messages'
type GET_BOT_CHATS_CHANGES = 'get-bot-chats-changes'
type GET_BOT_CHATS_LAST_REVISION = 'get-bot-chats-last-revision'
type SET_BOT_KEYBOARD = 'set-bot-keyboard'
type BOT_BUTTON_EVENT = 'bot-button-event'
type BOT_GET_ACS_INFO = 'bot-get-acs-info'

export type anyEventType =
 | START_BOT
 | SEND_BOT_MESSAGE
 | BOT_MESSAGE_EVENT
 | BOT_MESSAGE_RECEIVED
 | BOT_MESSAGE_WATCHED
 | DELETE_BOT_MESSAGE
 | DELETE_BOT_CONVERSATION_EVENT
 | GET_BOT_MESSAGES
 | GET_BOT_MESSAGE
 | GET_BOT_MESSAGE_DETAILS
 | GET_BOT_MESSAGES_CHANGES
 | GET_BOT_MESSAGES_LAST_REVISION
 | GET_BOT_UNWATCHED_MESSAGES
 | GET_BOT_CHATS_CHANGES
 | GET_BOT_CHATS_LAST_REVISION
 | SET_BOT_KEYBOARD
 | BOT_BUTTON_EVENT
 | BOT_GET_ACS_INFO

export interface BotConfig {
  token: string
  baseUrl: string
  name: string
}

export interface ServerConfig {
  webSocketsPort: string
}

type CidType = 'user' | 'group'
type dataType = 'text' | 'data' | 'unstored' | 'system'

export interface Bot {
  emit(
    event: START_BOT,
    params: Pick<BotConfig, 'token' | 'name'>,
    callback: (res: {error: 'not-found' | 'bad-token' | 'unknown'}) => void
  )

  emit(
    event: SEND_BOT_MESSAGE,
    params: {cidType?: CidType, cid: number, dataType?: dataType, data: string, dataFile?: any, replyId?: number},
    callback: (res: {id: number}) => void
  )

  emit(
    event: BOT_MESSAGE_RECEIVED,
    params: {id: number},
    callback: (res: {error: 'not-found' | 'unknown'}) => void
  )

  emit(
    event: BOT_MESSAGE_WATCHED,
    params: {id: number},
    callback: (res: {error: 'not-found' | 'unknown'}) => void
  )

  emit(
    event: DELETE_BOT_MESSAGE,
    params: {id: number},
    callback: (res: {error: 'not-found' | 'unknown'}) => void
  )

  emit(
    event: GET_BOT_MESSAGES,
    params: {cidType?: CidType, cid: number, beginId?: number, count?: number, endId?: number},
    callback: (res: Array<{id: number, cidType: CidType, cid: number, senderId: number, dataType: dataType, data: string, time: number, receivedTime: number, watchedTime: number}>) => void
  )

  emit(
    event: BOT_GET_ACS_INFO,
    params: {cid: number},
    callback: (res: { locations: Array<{ in: boolean, time: string }>, journal: Array<{ from: string, to: string, status: string, text: string, comment: string }> }) => void
  )

  on(
    event: DELETE_BOT_CONVERSATION_EVENT,
    callback: (res: {cidType?: CidType, cid: number}) => void
  )

  on(
    event: BOT_MESSAGE_EVENT,
    callback: (res: {cidType?: CidType, cid: number, senderId: number, dataType: dataType, data: string, dataFile?: any, replyId?: number}) => void
  )
}