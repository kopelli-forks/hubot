'use strict'

import { Adapter } from '../../src/adapter'
import Robot from '../../src/robot'

export class MockAdapter extends Adapter {
  send (envelope: any, ...strings: any[]) {
    this.emit('send', envelope, ...strings)
  }

  reply (envelope: any, ...strings: any[]) {
    this.emit('reply', envelope, ...strings)
  }

  topic (envelope: any, ...strings: any[]) {
    this.emit('topic', envelope, ...strings)
  }

  play (envelope: any, ...strings: any[]) {
    this.emit('play', envelope, ...strings)
  }

  run () {
    this.emit('connected')
  }

  close () {
    this.emit('closed')
  }
}

export const use = (robot: Robot) => new MockAdapter(robot)

