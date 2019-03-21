/* global LightType, Fov */

import COMMON from '../common.js'

// Not updated on npm
// import * as Filament from 'filament.js'
import * as Filament from '../assets/filament/filament.js'

import Trackball from 'gltumble'

COMMON.addLabel('Filament.js')

const ASSET_PATH = '../assets/filament'

const ibl_suffix = Filament.getSupportedFormatSuffix('etc s3tc')

const env = 'syferfontein_18d_clear_2k'
const ibl_url = `${ASSET_PATH}/${env}/${env}_ibl${ibl_suffix}.ktx`
const sky_url = `${ASSET_PATH}/${env}/${env}_skybox.ktx`
const helmet_filamat_url = `${ASSET_PATH}/helmet.filamat`
const filamesh_url = `${ASSET_PATH}/helmet.filamesh`

Filament.init(
  [
    `${COMMON.modelBasePath}FlightHelmet_baseColor.png`,
    `${COMMON.modelBasePath}FlightHelmet_occlusionRoughnessMetallic.png`,
    `${COMMON.modelBasePath}FlightHelmet_normal.png`,
    `${COMMON.modelBasePath}FlightHelmet_baseColor1.png`,
    `${COMMON.modelBasePath}FlightHelmet_occlusionRoughnessMetallic1.png`,
    `${COMMON.modelBasePath}FlightHelmet_normal1.png`,
    `${COMMON.modelBasePath}FlightHelmet_baseColor2.png`,
    `${COMMON.modelBasePath}FlightHelmet_occlusionRoughnessMetallic2.png`,
    `${COMMON.modelBasePath}FlightHelmet_normal2.png`,
    `${COMMON.modelBasePath}FlightHelmet_baseColor3.png`,
    `${COMMON.modelBasePath}FlightHelmet_occlusionRoughnessMetallic3.png`,
    `${COMMON.modelBasePath}FlightHelmet_normal3.png`,
    `${COMMON.modelBasePath}FlightHelmet_baseColor4.png`,
    `${COMMON.modelBasePath}FlightHelmet_occlusionRoughnessMetallic4.png`,
    `${COMMON.modelBasePath}FlightHelmet_normal4.png`,
    helmet_filamat_url,
    filamesh_url,
    ibl_url,
    sky_url
  ],
  () => {
    window.Fov = Filament.Camera$Fov
    window.LightType = Filament.LightManager$Type
    window.app = new App(COMMON.canvas)
  }
)

class App {
  constructor(canvas) {
    this.canvas = canvas
    const engine = (this.engine = Filament.Engine.create(this.canvas))
    this.scene = engine.createScene()
    this.trackball = new Trackball(canvas, { startSpin: 0 })

    const sunlight = Filament.EntityManager.get().create()
    Filament.LightManager.Builder(LightType.SUN)
      .color([0.98, 0.92, 0.89])
      .intensity(100000.0)
      .direction([0.6, -1.0, -0.8])
      .castShadows(true)
      .sunAngularRadius(1.9)
      .sunHaloSize(10.0)
      .sunHaloFalloff(80.0)
      .build(engine, sunlight)
    this.scene.addEntity(sunlight)

    const indirectLight = (this.ibl = engine.createIblFromKtx(ibl_url))
    this.scene.setIndirectLight(indirectLight)
    indirectLight.setIntensity(100000)

    const skybox = engine.createSkyFromKtx(sky_url)
    this.scene.setSkybox(skybox)

    const sampler = new Filament.TextureSampler(
      Filament.MinFilter.LINEAR_MIPMAP_LINEAR,
      Filament.MagFilter.LINEAR,
      Filament.WrapMode.CLAMP_TO_EDGE
    )

    const helmetMaterial = engine.createMaterial(helmet_filamat_url)

    const setTextures = function(minstance, suffix) {
      const setParam = minstance.setTextureParameter.bind(minstance)
      const createTex = engine.createTextureFromPng.bind(engine)
      const baseColor = `${
        COMMON.modelBasePath
      }FlightHelmet_baseColor${suffix}.png`
      const orm = `${
        COMMON.modelBasePath
      }FlightHelmet_occlusionRoughnessMetallic${suffix}.png`
      const normal = `${COMMON.modelBasePath}FlightHelmet_normal${suffix}.png`
      setParam('baseColor', createTex(baseColor, { srgb: true }), sampler)
      setParam('occlusionRoughnessMetallic', createTex(orm), sampler)
      setParam('normalMap', createTex(normal), sampler)
    }

    const GlassPlasticMat = helmetMaterial.createInstance()
    const LeatherPartsMat = helmetMaterial.createInstance()
    const LensesMat = helmetMaterial.createInstance()
    const MetalPartsMat = helmetMaterial.createInstance()
    const RubberWoodMat = helmetMaterial.createInstance()

    setTextures(GlassPlasticMat, '')
    setTextures(LeatherPartsMat, '1')
    setTextures(LensesMat, '2')
    setTextures(MetalPartsMat, '3')
    setTextures(RubberWoodMat, '4')

    const mats = {
      GlassPlasticMat,
      LeatherPartsMat,
      LensesMat,
      MetalPartsMat,
      RubberWoodMat
    }
    const mesh = engine.loadFilamesh(filamesh_url, null, mats)

    let rm = engine.getRenderableManager()
    let renderable = rm.getInstance(mesh.renderable)
    rm.setCastShadows(renderable, true)
    rm.setReceiveShadows(renderable, true)

    this.helmet = mesh.renderable
    this.scene.addEntity(mesh.renderable)

    this.swapChain = engine.createSwapChain()
    this.renderer = engine.createRenderer()
    this.camera = engine.createCamera()
    this.view = engine.createView()
    this.view.setCamera(this.camera)
    this.view.setScene(this.scene)
    this.resize()
    this.render = this.render.bind(this)
    this.resize = this.resize.bind(this)
    window.addEventListener('resize', this.resize)
    window.requestAnimationFrame(this.render)
  }

  render() {
    const tcm = this.engine.getTransformManager()
    const inst = tcm.getInstance(this.helmet)
    tcm.setTransform(inst, this.trackball.getMatrix())
    inst.delete()
    this.renderer.render(this.swapChain, this.view)
    window.requestAnimationFrame(this.render)
  }

  resize() {
    const dpr = window.devicePixelRatio
    const width = (this.canvas.width = window.innerWidth * dpr)
    const height = (this.canvas.height = window.innerHeight * dpr)
    this.view.setViewport([0, 0, width, height])
    const y = -0.125,
      eye = [0, y, 2],
      center = [0, y, 0],
      up = [0, 1, 0]
    this.camera.lookAt(eye, center, up)
    const aspect = width / height
    const fov = aspect < 1 ? Fov.HORIZONTAL : Fov.VERTICAL
    this.camera.setProjectionFov(30, aspect, 1.0, 10.0, fov)
  }
}
