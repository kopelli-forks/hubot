'use strict'

import { User } from "./user"

export class Message {
  id: string = ''
  user: User
  private done: boolean
  room: string
  text?: string
  // Represents an incoming message from the chat.
  //
  // user - A User instance that sent the message.
  constructor (user: User, done: boolean = false) {
    this.user = user
    this.done = done
    this.room = this.user.room || ''
  }

  // Indicates that no other Listener should be called on this object
  //
  // Returns nothing.
  finish () {
    this.done = true
  }
}
