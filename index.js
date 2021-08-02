'use strict'

const inherits = require('util').inherits

const hubotExport = require('./es2015')

/**
 * @typedef {Object} Hubot
 * @property {function} loadBot creates a new robot
 * @property {Object} User the user class
 */
// make all es2015 class declarations compatible with CoffeeScript’s extend
// see https://github.com/hubotio/evolution/pull/4#issuecomment-306437501
/**
 * @returns {Hubot} hubot object
 */
module.exports = Object.keys(hubotExport).reduce((map, current) => {
  if (current !== 'loadBot') {
    map[current] = makeClassCoffeeScriptCompatible(hubotExport[current])
  } else {
    map[current] = hubotExport[current]
  }
  return map
}, {})

function makeClassCoffeeScriptCompatible (klass) {
  function CoffeeScriptCompatibleClass () {
    const Hack = Function.prototype.bind.apply(klass, [null].concat([].slice.call(arguments)))
    const instance = new Hack()

    // pass methods from child to returned instance
    for (const key in this) {
      instance[key] = this[key]
    }

    // support for constructor methods which call super()
    // in which this.* properties are set
    for (const key in instance) {
      this[key] = instance[key]
    }

    return instance
  }
  inherits(CoffeeScriptCompatibleClass, klass)

  return CoffeeScriptCompatibleClass
}
