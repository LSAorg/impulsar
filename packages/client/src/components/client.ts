import { connect as SocketClient } from 'socket.io-client'
import { SocketStream } from 'stream-socket.io'
import blobToStream from 'blob-to-stream'
import { ImpulsarClientPlugin } from './plugin'
import { ImpulsarClientOptions, ImpulsarClientReciveDataName, ImpulsarClientSendData, ImpulsarClientSendDataName, ImpulsarClientStreamData, ImpulsarClientStreamDataName } from '../types/client'
import { ImpulsarClientPluginEvents, ImpulsarClientPluginLog, ImpulsarClientPluginReceiveAnimation, ImpulsarClientPluginReceiveAnimationName, ImpulsarClientPluginReceiveText, ImpulsarClientPluginReceiveTextName, ImpulsarClientPluginStreamAudio } from '../types/plugin'
import * as defaults from '../constants/client'

export class ImpulsarClient {
  debug: boolean
  plugins: ImpulsarClientPlugin[]
  host: string
  autoConnect: boolean
  #io: SocketIOClient.Socket
  #ioStream: SocketStream
  connected: boolean = false

  constructor (options: ImpulsarClientOptions) {
    this.debug = options.debug ?? defaults.debug
    this.plugins = options.plugins ?? []
    this.host = options.host ?? defaults.host
    this.autoConnect = options.autoConnect ?? defaults.autoConnect
    this.#io = SocketClient(this.host, {
      autoConnect: false
    })
    this.#ioStream = new SocketStream()
    this.#init()
  }

  #log = (out: string) => {
    if (!this.debug) return
    console.log(`- ImpulsarClient: ${out}`)
  }

  #pluginsReady = ({ plugin }: { plugin: ImpulsarClientPlugin }) => {
    this.#log(`${plugin.name} plugin it's ready`)
  }

  #pluginsLog = ({ plugin, input }: { plugin: ImpulsarClientPlugin, input: ImpulsarClientPluginLog}) => {
    this.#log(`${plugin.name} - ${input.data}`)
  }

  #pluginsTextRecived = ({ plugin, input }: { plugin: ImpulsarClientPlugin, input: ImpulsarClientPluginReceiveText}) => {
    this.#log(`${plugin.name} - Recived - ${input.data}`)
  }

  #pluginsAnimationRecived = ({ plugin, input }: { plugin: ImpulsarClientPlugin, input: ImpulsarClientPluginReceiveAnimation}) => {
    this.#log(`${plugin.name} - Recived - ${input.data}`)
  }

  #pluginsStreamAudio = ({ plugin, input }: { plugin: ImpulsarClientPlugin, input: ImpulsarClientPluginStreamAudio}) => {
    this.#log(`${plugin.name} - stream audio`)
    this.stream({
      name: ImpulsarClientStreamDataName.STREAM_AUDIO,
      data: input.data
    })
  }

  #pluginsInit = () => {
    this.#log('plugins init')
    this.plugins.forEach(plugin => {
      plugin.on(ImpulsarClientPluginEvents.READY, this.#pluginsReady)
      plugin.on(ImpulsarClientSendDataName.LOG, this.#pluginsLog)
      plugin.on(ImpulsarClientPluginEvents.TEXT_RECIVED, this.#pluginsTextRecived)
      plugin.on(ImpulsarClientPluginEvents.ANIMATION_RECIVED, this.#pluginsAnimationRecived)
      plugin.on(ImpulsarClientStreamDataName.STREAM_AUDIO, this.#pluginsStreamAudio)
      plugin.init({
        autoConnect: this.autoConnect,
        host: this.host,
        debug: this.debug
      })
    })
  }

  #onIOConnect = () => {
    this.connected = true
    this.#log('io connected')
  }

  #onIODisconnect = () => {
    this.connected = false
    this.#log('io disconnected')
  }

  #onReciveSubtitle = ({ data }: {data: string}) => {
    this.#log('recive subtitle')
    this.plugins.forEach(plugin => {
      plugin.receiveText({
        name: ImpulsarClientPluginReceiveTextName.SUBTITLE,
        data: data
      })
    })
  }

  #onReciveDefaultAnimation = ({ data }: {data: any}) => {
    this.#log('recive default animation')
    this.plugins.forEach(plugin => {
      plugin.receiveAnimation({
        name: ImpulsarClientPluginReceiveAnimationName.DEFAULT,
        data: data
      })
    })
  }

  #initIO = () => {
    this.#io.on('connect', this.#onIOConnect)
    this.#io.on('disconnect', this.#onIODisconnect)
    this.#io.on(ImpulsarClientReciveDataName.SUBTITLE, this.#onReciveSubtitle)
    this.#io.on(ImpulsarClientPluginReceiveAnimationName.DEFAULT, this.#onReciveDefaultAnimation)
  }

  #init = () => {
    this.#log('init')
    this.#pluginsInit()
    this.#initIO()
    if (this.autoConnect) {
      this.connect()
    }
  }

  connect = () => {
    this.#log('connect')
    this.#io.connect()
  }

  disconnect = () => {
    this.#log('disconnect')
    this.#io.disconnect()
  }

  stream = (streamData: ImpulsarClientStreamData) => {
    if (!this.connected) return false
    const outStream = this.#ioStream.emit(this.#io, streamData.name, {})
    const inStream = blobToStream(streamData.data)
    inStream.pipe(outStream)
    return true
  }

  send = (sendData: ImpulsarClientSendData) => {
    if (!this.connected) return false
    this.#io.emit(sendData.name, sendData.data)
    return true
  }
}
