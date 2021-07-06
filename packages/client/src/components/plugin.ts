import { uuid } from 'uuidv4'
import { EventEmitter } from 'events'
import { ImpulsarClientPluginEvents, ImpulsarClientPluginLog, ImpulsarClientPluginReceiveAnimation, ImpulsarClientPluginReceiveText, ImpulsarClientPluginStreamAudio } from '../types/plugin'
import { ImpulsarClientOptions, ImpulsarClientSendDataName, ImpulsarClientStreamDataName } from '../types/client'

export class ImpulsarClientPlugin extends EventEmitter {
  uuid: string
  name: string = 'BasePlugin'

  constructor () {
    super()
    this.uuid = uuid()
  }

  init = (options: ImpulsarClientOptions) => {
    this.emit(ImpulsarClientPluginEvents.READY, {
      plugin: this
    })
  }

  log = (input: ImpulsarClientPluginLog) => {
    this.emit(ImpulsarClientSendDataName.LOG, {
      input: input,
      plugin: this
    })
  }

  receiveText = (input: ImpulsarClientPluginReceiveText) => {
    this.emit(ImpulsarClientPluginEvents.TEXT_RECIVED, {
      input: input,
      plugin: this
    })
  }

  receiveAnimation = (input: ImpulsarClientPluginReceiveAnimation) => {
    this.emit(ImpulsarClientPluginEvents.ANIMATION_RECIVED, {
      input: input,
      plugin: this
    })
  }

  streamAudio = (input: ImpulsarClientPluginStreamAudio) => {
    this.emit(ImpulsarClientStreamDataName.STREAM_AUDIO, {
      input: input,
      plugin: this
    })
  }
}
