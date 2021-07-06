export enum ImpulsarClientPluginEvents {
  READY = 'ready',
  TEXT_RECIVED = 'text_recived',
  ANIMATION_RECIVED = 'animation_recived'
}

export enum ImpulsarClientPluginReceiveTextName {
  SUBTITLE = 'subtitle'
}

export type ImpulsarClientPluginReceiveText = {
  name: ImpulsarClientPluginReceiveTextName
  data: string
}

export enum ImpulsarClientPluginReceiveAnimationName {
  DEFAULT = 'default'
}

export type ImpulsarClientPluginReceiveAnimation = {
  name: ImpulsarClientPluginReceiveAnimationName
  data: any
}

export type ImpulsarClientPluginStreamAudio = {
  data: any
}

export type ImpulsarClientPluginLog = {
  data: string
}
