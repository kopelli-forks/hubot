'use strict'
import Robot from './src/robot'

export default function loadBot(adapterName: string, enableHttpd: boolean, botName: string, botAlias: string) {
  return new Robot(adapterName, enableHttpd, botName, botAlias)
}