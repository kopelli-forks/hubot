import { Message } from './message'

export class CatchAllMessage extends Message {
  readonly message: Message
  // Represents a message that no matchers matched.
  //
  // message - The original message.
  constructor (message: Message) {
    super(message.user)
    this.message = message
  }
}
