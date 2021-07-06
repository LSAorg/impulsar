import { ImpulsarClientPlugin, ImpulsarClientOptions, ImpulsarClientPluginEvents, ImpulsarClientPluginReceiveAnimation } from '@impulsar/client'
import { ImpulsarPluginWebGLRenderOptions } from '../types/webgl-render'
import { Scene, WebGLRenderer, PerspectiveCamera, Mesh, Color, Fog, HemisphereLight, DirectionalLight, PlaneGeometry, MeshPhongMaterial, AnimationMixer, Object3D, GridHelper } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { modelBase } from '../constants/webgl-render'

export class ImpulsarPluginWebGLRender extends ImpulsarClientPlugin {
  name: string = 'ImpulsarPluginWebGLRender'
  element: Element

  host?: string

  scene: Scene
  camera: PerspectiveCamera
  hemiLight: HemisphereLight
  dirLight: DirectionalLight
  ground: Mesh
  fbxLoader: FBXLoader
  renderer: WebGLRenderer
  mixer?: AnimationMixer

  constructor (options: ImpulsarPluginWebGLRenderOptions) {
    super()
    this.element = options.element

    this.scene = new Scene()
    this.scene.background = new Color(0xa0a0a0)
    this.scene.fog = new Fog(0xa0a0a0, 200, 1000)

    this.camera = new PerspectiveCamera(45, this.element.clientWidth / this.element.clientHeight, 1, 2000)
    this.camera.position.set(100, 200, 300)
    this.camera.lookAt(0, 100, 0)

    this.hemiLight = new HemisphereLight(0xffffff, 0x444444)
    this.hemiLight.position.set(0, 200, 0)
    this.scene.add(this.hemiLight)

    this.dirLight = new DirectionalLight(0xffffff)
    this.dirLight.position.set(0, 200, 100)
    this.dirLight.castShadow = true
    this.dirLight.shadow.camera.top = 100
    this.dirLight.shadow.camera.bottom = -100
    this.dirLight.shadow.camera.left = -120
    this.dirLight.shadow.camera.right = 120
    this.scene.add(this.dirLight)

    this.ground = new Mesh(new PlaneGeometry(2000, 2000), new MeshPhongMaterial({ color: 0x999999, depthWrite: false }))
    this.ground.rotation.x = -Math.PI / 2
    this.ground.receiveShadow = true
    this.scene.add(this.ground)

    const grid = new GridHelper(2000, 20, 0x000000, 0x000000)
		//grid.material.opacity = 0.2
		//grid.material.transparent = true
	  this.scene.add(grid)

    this.fbxLoader = new FBXLoader()

    this.renderer = new WebGLRenderer({ antialias: true })
    this.renderer.setSize(this.element.clientWidth, this.element.clientHeight)
    this.renderer.setAnimationLoop(this.renderLoop)

    this.element.appendChild(this.renderer.domElement)
  }

  init = (options: ImpulsarClientOptions) => {
    this.host = options.host
    if (this.host) {
      this.loadModels()
      this.emit(ImpulsarClientPluginEvents.READY, {
        plugin: this
      })
    }
  }

  loadModels = () => {
    const baseModelUrl = `${this.host}${modelBase}`

    this.fbxLoader.load(baseModelUrl, (object: any) => {
      this.mixer = new AnimationMixer(object)
      const action = this.mixer.clipAction(object.animations[0])
      action.play()

      object.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      this.scene.add(object)
    })

    console.log('Load Models', baseModelUrl)
  }

  renderLoop = (time: number) => {
    this.renderer.render(this.scene, this.camera)
  }

  receiveAnimation = (input: ImpulsarClientPluginReceiveAnimation) => {
    this.emit(ImpulsarClientPluginEvents.ANIMATION_RECIVED, {
      input: input,
      plugin: this
    })
  }

  render = (data: any) => {
    const list = data.split('.').map(x => `${x}.`)
    const listHtml = list.map(x => `<li>${x}</li>`)
    this.element.innerHTML = `<ul>${listHtml}</ul>`
  }
}
