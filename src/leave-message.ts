import { Message } from './message'

// Represents an incoming user exit notification.
//
// user - A User instance for the user who left.
// text - Always null.
// id   - A String of the message ID.
export class LeaveMessage extends Message {}
