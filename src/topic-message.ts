import { TextMessage } from './text-message'

// Represents an incoming topic change notification.
//
// user - A User instance for the user who changed the topic.
// text - A String of the new topic
// id   - A String of the message ID.
export class TopicMessage extends TextMessage {}
