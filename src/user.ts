'use strict'

import { DataStoreUnavailable } from "./datastore"
import Robot from "./robot"

export default class User {
  private _getRobot: (() => Robot) | (() => void)
  private name: string
  private id: string

  // Represents a participating user in the chat.
  //
  // id      - A unique ID for the user.
  // options - An optional Hash of key, value pairs for this user.
  constructor (id: string, options: {robot?: Robot, [key: string]: any}) {
    this.id = id

    if (options == null) {
      options = {}
    }

    // Define a getter method so we don't actually store the
    // robot itself on the user object, preventing it from
    // being serialized into the brain.
    if (options.robot) {
      const robot = options.robot
      delete options.robot
      this._getRobot = function () { return robot }
    } else {
      this._getRobot = function () { }
    }

    Object.keys(options).forEach((key) => {
      (<Record<string, any>>this)[key] = options[key]
    })

    //@ts-ignore
    if (!this.name) {
      this.name = this.id.toString()
    }
  }

  public set (key: string, value: unknown) {
    return this._getDatastore()._set(this._constructKey(key), value, 'users')
  }

  public get (key: string) {
    return this._getDatastore()._get(this._constructKey(key), 'users')
  }

  private _constructKey (key: string) {
    return `${this.id}+${key}`
  }

  private _getDatastore () {
    const robot = this._getRobot()
    if (robot && robot.datastore) {
      return robot.datastore
    }

    throw new DataStoreUnavailable('datastore is not initialized')
  }
}
