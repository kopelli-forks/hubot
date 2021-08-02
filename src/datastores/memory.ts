'use strict'

import { DataStore } from '../datastore'

export class InMemoryDataStore extends DataStore {
  private data: Record<'global'|'users', Record<string, any>>
  constructor (robot: unknown) {
    super(robot)
    this.data = {
      global: {},
      users: {}
    }
  }

  _get (key:string , table: 'global'|'users') {
    return Promise.resolve(this.data[table][key])
  }

  _set (key: string, value: any, table: 'global'|'users') {
    return Promise.resolve(this.data[table][key] = value)
  }
}
