'use strict'

import * as fs from 'fs'
import OptParse from 'optparse'
import * as path from 'path'
import Hubot from '..'

const pathResolve = path.resolve

const switches = [
  ['-a', '--adapter ADAPTER', 'The Adapter to use'],
  ['-d', '--disable-httpd', 'Disable the HTTP server'],
  ['-h', '--help', 'Display the help information'],
  ['-l', '--alias ALIAS', "Enable replacing the robot's name with alias"],
  ['-n', '--name NAME', 'The name of the robot in chat'],
  ['-r', '--require PATH', 'Alternative scripts path'],
  ['-t', '--config-check', "Test hubot's config to make sure it won't fail at startup"],
  ['-v', '--version', 'Displays the version of hubot installed']
]

const options = {
  adapter: process.env.HUBOT_ADAPTER || 'shell',
  alias: process.env.HUBOT_ALIAS || false,
  create: process.env.HUBOT_CREATE || false,
  enableHttpd: process.env.HUBOT_HTTPD || true,
  scripts: process.env.HUBOT_SCRIPTS !== undefined ? [process.env.HUBOT_SCRIPTS] : null || [],
  name: process.env.HUBOT_NAME || 'Hubot',
  path: process.env.HUBOT_PATH || '.',
  configCheck: false,
  version: false
}

const Parser = new OptParse.OptionParser(switches)
Parser.banner = 'Usage hubot [options]'

Parser.on('adapter', (_: any, value: string) => {
  options.adapter = value
})

Parser.on('disable-httpd', (opt: any) => {
  options.enableHttpd = false
})

Parser.on('help', function (opt: any, value: string) {
  console.log(Parser.toString())
  return process.exit(0)
})

Parser.on('alias', function (opt: any, value: string) {
  if (!value) {
    value = '/'
  }
  options.alias = value
})

Parser.on('name', (opt: any, value: string) => {
  options.name = value
})

Parser.on('require', (opt: any, value: string) => {
  options.scripts.push(value)
})

Parser.on('config-check', (opt: any) => {
  options.configCheck = true
})

Parser.on('version', (opt: any, value: string) => {
  options.version = true
})

Parser.on((opt: any, value: string) => {
  console.warn(`Unknown option: ${opt}`)
})

Parser.parse(process.argv)

if (process.platform !== 'win32') {
  process.on('SIGTERM', () => process.exit(0))
}

const robot = Hubot.loadBot(options.adapter, options.enableHttpd, options.name, options.alias)

if (options.version) {
  console.log(robot.version)
  process.exit(0)
}

if (options.configCheck) {
  loadScripts()
  console.log('OK')
  process.exit(0)
}

robot.adapter.once('connected', loadScripts)

robot.run()

function loadScripts () {
  robot.load(pathResolve('.', 'scripts'))
  robot.load(pathResolve('.', 'src', 'scripts'))

  loadExternalScripts()

  options.scripts.forEach((scriptPath) => {
    if (scriptPath[0] === '/') {
      return robot.load(scriptPath)
    }

    robot.load(pathResolve('.', scriptPath))
  })
}

function loadExternalScripts () {
  const externalScripts = pathResolve('.', 'external-scripts.json')

  if (!fs.existsSync(externalScripts)) {
    return
  }

  fs.readFile(externalScripts, { encoding: "utf-8" }, function (error, data) {
    if (error) {
      throw error
    }

    try {
      robot.loadExternalScripts(JSON.parse(data))
    } catch (error) {
      console.error(`Error parsing JSON data from external-scripts.json: ${error}`)
      process.exit(1)
    }
  })
}
