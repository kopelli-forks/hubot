'use strict'

/* global describe, it, beforeEach */

const expect = require('chai').expect
const User = require('../src/user')
const DataStoreUnavailable = require('../src/datastore').DataStoreUnavailable

describe('User', function () {
  beforeEach(function () {
    const backingDatastore = new Map()
    this.mockRobot = {
      datastore: {
        _set: function (key, value, _) { backingDatastore.set(key, value) },
        _get: function (key, value, _) { return backingDatastore.get(key, value) }
      }
    }
  })
  describe('new', function () {
    it('uses id as the default name', function () {
      const user = new User.User('hubot', { robot: this.mockRobot })

      expect(user.name).to.equal('hubot')
    })

    it('sets attributes passed in', function () {
      const user = new User.User('hubot', { foo: 1, bar: 2, robot: this.mockRobot })

      expect(user.get('foo')).to.equal(1)
      expect(user.get('bar')).to.equal(2)
    })

    it('uses name attribute when passed in, not id', function () {
      const user = new User.User('hubot', { name: 'tobuh', robot: this.mockRobot })

      expect(user.name).to.equal('tobuh')
    })
  })

  describe('set', function () {
    it('throws an error when robot is not provided in constructor', function () {
      const user = new User.User('hubot')

      expect(function () {
        return user.set('key', 'value')
      }).to.throw(DataStoreUnavailable)
    })
  })
})
