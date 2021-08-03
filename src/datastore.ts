'use strict'

export abstract class DataStore {
  private robot: unknown

  // Represents a persistent, database-backed storage for the robot. Extend this.
  //
  // Returns a new Datastore with no storage.
  constructor (robot: unknown) {
    this.robot = robot
  }

  // Public: Set value for key in the database. Overwrites existing
  // values if present. Returns a promise which resolves when the
  // write has completed.
  //
  // Value can be any JSON-serializable type.
  public set (key: string, value: any) {
    return this._set(key, value, 'global')
  }

  // Public: Assuming `key` represents an object in the database,
  // sets its `objectKey` to `value`. If `key` isn't already
  // present, it's instantiated as an empty object.
  public setObject (key: string, objectKey: string, value: unknown) {
    return this.get(key).then((obj) => {
      const target = (obj || {}) as Record<string, any>
      target[objectKey] = value
      return this.set(key, target)
    })
  }

  // Public: Adds the supplied value(s) to the end of the existing
  // array in the database marked by `key`. If `key` isn't already
  // present, it's instantiated as an empty array.
  public setArray (key: string, value: any) {
    return this.get(key).then((obj) => {
      const target = (obj || []) as any[]
      // Extend the array if the value is also an array, otherwise
      // push the single value on the end.
      if (Array.isArray(value)) {
        return this.set(key, target.push.apply(target, value))
      } else {
        return this.set(key, target.concat(value))
      }
    })
  }

  // Public: Get value by key if in the database or return `undefined`
  // if not found. Returns a promise which resolves to the
  // requested value.
  public get (key: unknown) {
    return this._get(key, 'global')
  }

  // Public: Digs inside the object at `key` for a key named
  // `objectKey`. If `key` isn't already present, or if it doesn't
  // contain an `objectKey`, returns `undefined`.
  public async getObject (key: string, objectKey: string) {
    const obj = await this.get(key)
    const target = (obj || {}) as Record<string, any>
    return target[objectKey]
  }

  // Private: Implements the underlying `set` logic for the datastore.
  // This will be called by the public methods. This is one of two
  // methods that must be implemented by subclasses of this class.
  // `table` represents a unique namespace for this key, such as a
  // table in a SQL database.
  //
  // This returns a resolved promise when the `set` operation is
  // successful, and a rejected promise if the operation fails.
  abstract _set (key: unknown, value: unknown, table: unknown): Promise<void>

  // Private: Implements the underlying `get` logic for the datastore.
  // This will be called by the public methods. This is one of two
  // methods that must be implemented by subclasses of this class.
  // `table` represents a unique namespace for this key, such as a
  // table in a SQL database.
  //
  // This returns a resolved promise containing the fetched value on
  // success, and a rejected promise if the operation fails.
  abstract _get (key: unknown, table: unknown): Promise<unknown>
}

export class DataStoreUnavailable extends Error {}