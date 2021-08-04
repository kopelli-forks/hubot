import { EventEmitter } from "stream"
import DataStore from "./datastore"

export default class Robot {
    /**
     *
     * @param adapter the adapter name
     * @param httpd whether to enable the HTTP daemon
     * @param name the name of the robot; defaults to 'Hubot'
     * @param alias an alternative name to refer to the robot as
     */
    constructor(adapter: string, httpd: boolean, name: string, alias: string)

    version: string

    run(): void

    load(path: string): void

    loadExternalScripts(path: string): void

    adapter: EventEmitter

    shutdown(): void

    datastore?: DataStore

    emit(eventName: string, ...args: any[])
}
