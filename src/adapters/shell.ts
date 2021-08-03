'use strict'

import fs from 'fs'
import readline from 'readline'
import Stream from 'stream'
import cline from 'cline'
import chalk from 'chalk'

import { Adapter } from '../adapter'

import { TextMessage } from '../text-message'
import Robot from '../robot'

const historySize = process.env.HUBOT_SHELL_HISTSIZE != null ? parseInt(process.env.HUBOT_SHELL_HISTSIZE) : 1024

const historyPath = '.hubot_history'

class Shell extends Adapter {
  send (envelope: any, ...strings: any[]) {
    Array.from(strings).forEach(str => console.log(chalk.bold(`${str}`)))
  }

  emote (envelope: any, ...strings: any[]) {
    Array.from(strings).map(str => this.send(envelope, `* ${str}`))
  }

  reply (envelope: any, ...strings: any[]) {
    this.send(envelope, ...strings.map(s => `${envelope.user.name}: ${s}`))
  }

  run () {
    this.buildCli()

    loadHistory((error, history) => {
      if (error) {
        console.log(error.message)
      }

      this.cli.history(history)
      this.cli.interact(`${this.robot.name}> `)
      return this.emit('connected')
    })
  }

  shutdown () {
    this.robot.shutdown()
    return process.exit(0)
  }

  buildCli () {
    this.cli = cline()

    this.cli.command('*', (input: string) => {
      let userId: string | number = process.env.HUBOT_SHELL_USER_ID || '1'
      if (userId.match(/A\d+z/)) {
        userId = parseInt(userId)
      }

      const userName = process.env.HUBOT_SHELL_USER_NAME || 'Shell'
      const user = this.robot.brain.userForId(userId, { name: userName, room: 'Shell' })
      this.receive(new TextMessage(user, input, 'messageId'))
    })

    this.cli.command('history', () => {
      Array.from(this.cli.history()).map(item => console.log(item))
    })

    this.cli.on('history', (item: string) => {
      if (item.length > 0 && item !== 'exit' && item !== 'history') {
        fs.appendFile(historyPath, `${item}\n`, error => {
          if (error) {
            this.robot.emit('error', error)
          }
        })
      }
    })

    this.cli.on('close', () => {
      let history = this.cli.history()

      if (history.length <= historySize) {
        return this.shutdown()
      }

      const startIndex = history.length - historySize
      history = history.reverse().splice(startIndex, historySize)
      const fileOpts = {
        mode: 0x180
      }

      const outstream = fs.createWriteStream(historyPath, fileOpts)
      outstream.on('finish', this.shutdown.bind(this))

      for (let i = 0, len = history.length; i < len; i++) {
        const item = history[i]
        outstream.write(item + '\n')
      }

      outstream.end(this.shutdown.bind(this))
    })
  }
}

exports.use = (robot: Robot) => new Shell(robot)

// load history from .hubot_history.
//
// callback - A Function that is called with the loaded history items (or an empty array if there is no history)
function loadHistory (callback: { (error: any, history: any): any; (arg0: Error, arg1: any[]): void; (...args: any[]): void }) {
  if (!fs.existsSync(historyPath)) {
    return callback(new Error('No history available'))
  }

  const instream = fs.createReadStream(historyPath)
  const outstream = new Stream.Duplex()
  const items: any[] = []

  readline.createInterface({ input: instream, output: outstream, terminal: false })
    .on('line', function (line) {
      line = line.trim()
      if (line.length > 0) {
        items.push(line)
      }
    })
    .on('close', () => callback(null, items))
    .on('error', callback)
}
