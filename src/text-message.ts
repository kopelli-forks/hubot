import { Message } from './message'
import { User } from './user'

export class TextMessage extends Message {
  text: string
    id: string
  // Represents an incoming message from the chat.
  //
  // user - A User instance that sent the message.
  // text - A String message.
  // id   - A String of the message ID.
  constructor (user: User, text: string, id: string) {
    super(user)
    this.text = text
    this.id = id
  }

  // Determines if the message matches the given regex.
  //
  // regex - A Regex to check.
  //
  // Returns a Match object or null.
  match (regex: RegExp) {
    return this.text.match(regex)
  }

  // String representation of a TextMessage
  //
  // Returns the message text
  toString () {
    return this.text
  }
}
