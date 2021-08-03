import { Message } from './message'

// Represents an incoming user entrance notification.
//
// user - A User instance for the user who entered.
// text - Always null.
// id   - A String of the message ID.
export class EnterMessage extends Message {}
