'use strict'

const User = require('./src/user')
const Brain = require('./src/brain')
const Robot = require('./src/robot')
const Adapter = require('./src/adapter')
const Response = require('./src/response')
const Listener = require('./src/listener')
const Message = require('./src/message')
const DataStore = require('./src/datastore')
const TextMessage = require('./src/text-message')
const CatchAllMessage = require('./src/catch-all-message')
const TopicMessage = require('./src/topic-message')
const LeaveMessage = require('./src/leave-message')
const EnterMessage = require('./src/enter-message')

module.exports = {
  User: User.User,
  Brain,
  Robot: Robot,
  Adapter: Adapter.Adapter,
  Response,
  Listener: Listener.Listener,
  TextListener: Listener.TextListener,
  Message: Message.Message,
  TextMessage: TextMessage.TextMessage,
  EnterMessage: EnterMessage.EnterMessage,
  LeaveMessage: LeaveMessage.LeaveMessage,
  TopicMessage: TopicMessage.TopicMessage,
  CatchAllMessage: CatchAllMessage.CatchAllMessage,
  DataStore: DataStore.DataStore,
  DataStoreUnavailable: DataStore.DataStoreUnavailable,

  loadBot (adapterName, enableHttpd, botName, botAlias) {
    return new module.exports.Robot(adapterName, enableHttpd, botName, botAlias)
  }
}
