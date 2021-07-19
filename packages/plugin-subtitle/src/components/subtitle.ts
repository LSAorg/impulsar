import { ImpulsarClientPlugin, ImpulsarClientPluginEvents, ImpulsarClientPluginReceiveText, ImpulsarClientPluginReceiveTextName } from '@impulsar/client'
import { ImpulsarPluginSubtitleOptions } from '../types/subtitle'

export class ImpulsarPluginSubtitle extends ImpulsarClientPlugin {
  name: string = 'ImpulsarPluginSubtitle'
  element: Element
  timeout: any

  constructor (options: ImpulsarPluginSubtitleOptions) {
    super()
    this.element = options.element
  }

  receiveText = (input: ImpulsarClientPluginReceiveText) => {
    if (input.name !== ImpulsarClientPluginReceiveTextName.SUBTITLE) return
    this.render(input.data)
    this.scheduleCleaning()
    this.emit(ImpulsarClientPluginEvents.TEXT_RECIVED, {
      input: input,
      plugin: this
    })
  }

  scheduleCleaning = () => {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = setTimeout(this.clean, 10 * 1000)
  }

  clean = () => {
    this.render('')
  }

  render = (data: string) => {
    const list = data.split('.').map(x => `${x}`)
    const listHtml = list.map(x => `<li>${x}</li>`)
    this.element.innerHTML = `<ul>${listHtml}</ul>`
  }
}
