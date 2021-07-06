import { ImpulsarClientPlugin } from '../components/plugin'

export type ImpulsarClientOptions = {
  debug?: boolean
  host?: string
  autoConnect?: boolean
  plugins?: ImpulsarClientPlugin[]
}

export enum ImpulsarClientStreamDataName {
  STREAM_AUDIO = 'stream-audio',
}

export type ImpulsarClientStreamData = {
  name: ImpulsarClientStreamDataName
  data: Blob
}

export enum ImpulsarClientSendDataName {
  LOG = 'log',
}

export type ImpulsarClientSendData = {
  name: ImpulsarClientSendDataName
  data: any
}

export enum ImpulsarClientReciveDataName {
  SUBTITLE = 'subtitle'
}

export type ImpulsarClientReciveData = {
  name: ImpulsarClientReciveDataName
  data: any
}
