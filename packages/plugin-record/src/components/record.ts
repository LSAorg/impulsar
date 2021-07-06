import RecordRTC, { StereoAudioRecorder } from 'recordrtc'
import { ImpulsarClientPlugin, ImpulsarClientPluginEvents } from '@impulsar/client'
import { ImpulsarPluginRecordOptions } from '../types/record'
import * as defaults from '../constants/record'

export class ImpulsarPluginRecord extends ImpulsarClientPlugin {
  autoStart: boolean
  name: string = 'ImpulsarPluginRecord'
  record: RecordRTC | null = null

  constructor (options: ImpulsarPluginRecordOptions) {
    super()
    this.autoStart = options.autoStart ?? defaults.autoStart
  }

  onPermissionsGranted = (stream: MediaStream) => {
    this.record = new RecordRTC(stream, {
      type: 'audio',
      mimeType: defaults.mimeType,
      sampleRate: defaults.sampleRate,
      desiredSampRate: defaults.desiredSampRate,
      recorderType: StereoAudioRecorder,
      numberOfAudioChannels: defaults.numberOfAudioChannels,
      timeSlice: defaults.timeSlice,
      ondataavailable: (blob: any) => {
        this.streamAudio({
          data: blob
        })
      }
    })
  }

  requestPremissions = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.onPermissionsGranted(stream)
      return true
    } catch {
      this.log({
        data: 'Can\'t get the getUserMedia permissions'
      })
      return false
    }
  }

  start = async () => {
    if (this.record !== null) {
      this.record.startRecording()
    } else {
      const havePermission = await this.requestPremissions()
      if (havePermission) {
        this.start()
      }
    }
  }

  stop = () => {
    if (this.record !== null) {
      this.record.stopRecording()
    }
  }

  init = () => {
    if (this.autoStart) {
      this.start()
    }
    this.emit(ImpulsarClientPluginEvents.READY, {
      plugin: this
    })
  }
}
