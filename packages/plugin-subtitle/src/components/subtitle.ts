import { ImpulsarClientPlugin, ImpulsarClientPluginEvents, ImpulsarClientPluginReceiveText, ImpulsarClientPluginReceiveTextName } from '@impulsar/client'
import { ImpulsarPluginSubtitleOptions } from '../types/subtitle'

export class ImpulsarPluginSubtitle extends ImpulsarClientPlugin {
  name: string = 'ImpulsarPluginSubtitle'
  element: Element

  constructor (options: ImpulsarPluginSubtitleOptions) {
    super()
    this.element = options.element
  }

  receiveText = (input: ImpulsarClientPluginReceiveText) => {
    if (input.name !== ImpulsarClientPluginReceiveTextName.SUBTITLE) return
    this.render(input.data)
    this.emit(ImpulsarClientPluginEvents.TEXT_RECIVED, {
      input: input,
      plugin: this
    })
  }

  render = (data: string) => {
    const list = data.split('.').map(x => `${x}.`)
    const listHtml = list.map(x => `<li>${x}</li>`)
    this.element.innerHTML = `<ul>${listHtml}</ul>`
  }
}
