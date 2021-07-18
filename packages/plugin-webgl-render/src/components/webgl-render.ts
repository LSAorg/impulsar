import { ImpulsarClientPlugin, ImpulsarClientOptions, ImpulsarClientPluginEvents, ImpulsarClientPluginReceiveAnimation } from '@impulsar/client'
import { ImpulsarPluginWebGLRenderOptions } from '../types/webgl-render'
import { Scene, WebGLRenderer, PerspectiveCamera, Mesh, Color, Fog, HemisphereLight, DirectionalLight, PlaneGeometry, MeshPhongMaterial, AnimationMixer, GridHelper, AnimationAction, Clock } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { modelBase, animations, animationBase } from '../constants/webgl-render'
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
  clock: Clock
  player?: any
  mixer?: AnimationMixer
  animationsCache: Record<string, AnimationAction> = {}
  animationCurrent: string | null = null
  animationLock: boolean = false
  animationQueue: string[] = []

  constructor (options: ImpulsarPluginWebGLRenderOptions) {
    super()
    this.element = options.element

    this.scene = new Scene()
    this.scene.background = new Color(0xa0a0a0)
    this.scene.fog = new Fog(0xa0a0a0, 200, 1000)

    this.camera = new PerspectiveCamera(45, this.element.clientWidth / this.element.clientHeight, 1, 2000)
    this.camera.position.set(0, 175, 125)
    this.camera.lookAt(0, 140, 0)

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
    this.scene.add(grid)

    this.fbxLoader = new FBXLoader()

    this.clock = new Clock()

    this.renderer = new WebGLRenderer({ antialias: true })
    this.renderer.setSize(this.element.clientWidth, this.element.clientHeight)
    this.renderer.setAnimationLoop(this.renderLoop)

    this.element.appendChild(this.renderer.domElement)

    setTimeout(() => {
      this.animationQueue = ['hola', 'si', 'no', 'hola']
    }, 3000)
  }

  init = async (options: ImpulsarClientOptions) => {
    this.host = options.host
    if (this.host) {
      await this.loadModels()
      await this.initAnimations()
      this.initPlayer()
      this.emit(ImpulsarClientPluginEvents.READY, {
        plugin: this
      })
    }
  }

  loadFBX = (path: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.fbxLoader.load(path, (object: any) => {
        resolve(object as any)
      }, (xhr) => {
        this.log({
          data: `${path} -> (${(xhr.loaded / xhr.total * 100)}%)`
        })
      }, (err) => {
        reject(err)
      })
    })
  }

  loadModels = async () => {
    const baseModelUrl = `${this.host}${modelBase}`
    const playerFBX = await this.loadFBX(baseModelUrl)
    playerFBX.traverse((child: any) => {
      if (child.isMesh) {
        // child.material.transparent = false
        child.material.alphaTest = 0
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    this.player = playerFBX
  }

  initPlayer = () => {
    this.scene.add(this.player)
  }

  initAnimations = async () => {
    this.mixer = new AnimationMixer(this.player)
    await this.playAnimation(animationBase)
  }

  playAnimation = async (key: string) => {
    await this.loadAnimation(key)
    if (this.animationCurrent === key) {
      this.animationLock = false
      return
    }
    if (this.animationCurrent === null) {
      this.animationCurrent = key
      this.animationsCache[key].play()
    } else {
      this.animationsCache[this.animationCurrent].fadeOut(0.5)
      this.animationsCache[key].reset()
      this.animationsCache[key].fadeIn(0.5)
      this.animationsCache[key].play()
      this.animationCurrent = key
    }
    this.animationLock = false
  }

  loadAnimation = async (key: string) => {
    if (this.animationsCache[key]) return true

    const animationUrl = `${this.host}${animations}${key}.fbx`
    const animationFBX = await this.loadFBX(animationUrl)
    const animationAction = this.mixer?.clipAction(animationFBX.animations[0])
    if (animationAction) {
      if (key !== animationBase) {
        animationAction.repetitions = 1
        animationAction.clampWhenFinished = true
      }
      this.animationsCache[key] = animationAction
    }
  }

  processAnimationQueue = () => {
    if (this.animationLock) return
    if (this.animationCurrent === null) return
    if (this.animationQueue.length === 0 && this.animationCurrent === animationBase) {
      return
    }
    if (this.animationCurrent !== animationBase && !this.animationsCache[this.animationCurrent].paused) {
      return
    }
    const nextAnimation = this.animationQueue.shift()
    if (nextAnimation) {
      this.animationLock = true
      this.playAnimation(nextAnimation)
    } else {
      this.playAnimation(animationBase)
    }
  }

  renderLoop = (time: number) => {
    if (this.mixer) {
      this.processAnimationQueue()
      this.mixer.update(this.clock.getDelta())
    }
    this.renderer.render(this.scene, this.camera)
  }

  receiveAnimation = (input: ImpulsarClientPluginReceiveAnimation) => {
    this.animationQueue.push(...input.data)
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
