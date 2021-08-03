'use strict'

import * as fs from 'fs'
import { Command } from 'commander'
import * as path from 'path'
import loadBot from '..'

const pathResolve = path.resolve

//const options = {
//  adapter: process.env.HUBOT_ADAPTER || 'shell',
//  alias: process.env.HUBOT_ALIAS || false,
//  create: process.env.HUBOT_CREATE || false,
//  enableHttpd: process.env.HUBOT_HTTPD || true,
//  scripts: process.env.HUBOT_SCRIPTS !== undefined ? [process.env.HUBOT_SCRIPTS] : null || [],
//  name: process.env.HUBOT_NAME || 'Hubot',
//  configCheck: false,
//  version: false
//}

const program = new Command()
program
  .option('-a, --adapter <adapter>', 'The Adapter to use', process.env.HUBOT_ADAPTER || 'shell')
  .option('-d, --disable-httpd', 'Disable the HTTP server', process.env.HUBOT_HTTPD || false)
  .option('-l, --alias [alias]', 'Enable replacing the robot\'s name with alias', (value) => !value ? '/' : value, process.env.HUBOT_ALIAS)
  .option('-n, --name <name>', 'The name of the robot in chat', process.env.HUBOT_NAME || 'Hubot')
  .option('-r, --require <path>', 'Alternative script path to load', (value, prev: string[]) => { prev.push(value); return prev }, [])
  .option('-t, --config-check', 'Test the configuration to make sure there are no failures at startup', false)
  .option('-v, --version', 'Display the version installed', false)
  .addHelpText('beforeAll', 'Usage hubot [options]')

program.parse(process.argv)
const options = program.opts();

if (process.platform !== 'win32') {
  process.on('SIGTERM', () => process.exit(0))
}

const robot = loadBot(options.adapter, !options.disableHttpd, options.name, options.alias)

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

  options.require.forEach((scriptPath: string) => {
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
