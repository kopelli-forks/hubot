'use strict'

import { DataStoreUnavailable } from "./datastore"
import Robot from "./robot"

export class User implements Record<string, any> {
  private _getRobot: (() => Robot) | (() => void)
  name: string
  private id: string
  room?: string

  // Represents a participating user in the chat.
  //
  // id      - A unique ID for the user.
  // options - An optional Hash of key, value pairs for this user.
  constructor (id: string, options?: {robot?: Robot, [key: string]: any}) {
    this.id = id

    let capturedOptions: Record<string, any>
    if (options == null || options == undefined) {
      capturedOptions = {}
    } else {
      capturedOptions = options
    }

    // Define a getter method so we don't actually store the
    // robot itself on the user object, preventing it from
    // being serialized into the brain.
    if (capturedOptions.robot) {
      const robot = capturedOptions.robot
      delete capturedOptions.robot
      this._getRobot = function () { return robot }
    } else {
      this._getRobot = function () { }
    }

    Object.keys(capturedOptions).forEach((key) => {
      this.set(key, capturedOptions[key])
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
