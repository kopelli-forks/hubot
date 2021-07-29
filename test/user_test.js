'use strict'

/* global describe, it */

const expect = require('chai').expect
const User = require('../src/user')
const DataStoreUnavailable = require('../src/datastore').DataStoreUnavailable

describe('User', function () {
  describe('new', function () {
    it('uses id as the default name', function () {
      const user = new User('hubot')

      expect(user.name).to.equal('hubot')
    })

    it('sets attributes passed in', function () {
      const user = new User('hubot', { foo: 1, bar: 2 })

      expect(user.foo).to.equal(1)
      expect(user.bar).to.equal(2)
    })

    it('uses name attribute when passed in, not id', function () {
      const user = new User('hubot', { name: 'tobuh' })

      expect(user.name).to.equal('tobuh')
    })
  })

  describe('set', function () {
    it('throws an error when robot is not provided in constructor', function () {
      const user = new User('hubot')

      expect(function () {
        return user.set('key', 'value')
      }).to.throw(DataStoreUnavailable)
    })
  })
})
