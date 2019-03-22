/* global loadGltf */

import COMMON from '../common.js'
import pc from './playcanvas-stable.min.js'
import './playcanvas-gltf.js'

COMMON.addLabel('PlayCanvas')

const app = new pc.Application(COMMON.canvas, {
  mouse: new pc.Mouse(COMMON.canvas)
})
app.start()

require('./orbit-camera.js')

app.scene.gammaCorrection = pc.GAMMA_SRGB
app.scene.toneMapping = pc.TONEMAP_ACES

const camera = new pc.Entity('camera')
camera.addComponent('camera', {
  clearColor: [0, 0, 0],
  fov: COMMON.fov,
  horizontalFov: false
})
camera.setPosition(...COMMON.initialPosition)
camera.lookAt(0, 0, 0)

camera.addComponent('script')
camera.script.create('orbitCamera', {
  attributes: {
    distanceMax: COMMON.far,
    distanceMin: COMMON.near
  }
})
camera.script.create('mouseInput', {
  attributes: {
    orbitSensitivity: 0.3,
    distanceSensitivity: 0.15
  }
})
app.root.addChild(camera)

const xAxis = new pc.Entity()
xAxis.addComponent('model', {
  type: 'box'
})
xAxis.setLocalScale(0.4, 0.003, 0.003)
xAxis.setLocalPosition(0.2, 0, 0)
const material1 = new pc.BasicMaterial()
material1.color.set(1, 0, 0)
material1.update()
xAxis.model.model.meshInstances[0].material = material1
app.root.addChild(xAxis)

const yAxis = new pc.Entity()
yAxis.addComponent('model', {
  type: 'box'
})
yAxis.setLocalScale(0.003, 0.4, 0.003)
yAxis.setLocalPosition(0, 0.2, 0)
const material2 = new pc.BasicMaterial()
material2.color.set(0, 1, 0)
yAxis.model.model.meshInstances[0].material = material2
app.root.addChild(yAxis)

const zAxis = new pc.Entity()
zAxis.addComponent('model', {
  type: 'box'
})
zAxis.setLocalScale(0.003, 0.003, 0.4)
zAxis.setLocalPosition(0, 0, 0.2)
const material3 = new pc.BasicMaterial()
material3.color.set(0, 0, 1)
zAxis.model.model.meshInstances[0].material = material3
app.root.addChild(zAxis)

const gltfRoot = new pc.Entity()
app.root.addChild(gltfRoot)
app.assets.loadFromUrl(COMMON.modelUrl, 'json', function(err, asset) {
  const json = asset.resource
  const gltf = JSON.parse(json)
  loadGltf(
    gltf,
    app.graphicsDevice,
    function(model) {
      const asset = new pc.Asset('gltf', 'model', {
        url: ''
      })
      asset.resource = model
      asset.loaded = true
      app.assets.add(asset)

      const gltf = new pc.Entity('gltf')
      gltf.addComponent('model', {
        asset: asset
      })
      app.root.addChild(gltf)
    },
    {
      basePath: COMMON.modelBasePath
    }
  )
})

let texCounter = 0
const loadedCubeFace = function() {
  texCounter++
  if (texCounter === 6) {
    const cubemapAsset = new pc.Asset(
      'pisa',
      'cubemap',
      {
        url: '../assets/Pisa/playcanvas/pisa.dds'
      },
      {
        textures: [
          app.assets.find('pisa_posx.jpg').id,
          app.assets.find('pisa_negx.jpg').id,
          app.assets.find('pisa_posy.jpg').id,
          app.assets.find('pisa_negy.jpg').id,
          app.assets.find('pisa_posz.jpg').id,
          app.assets.find('pisa_negz.jpg').id
        ],
        magFilter: 1,
        minFilter: 5,
        anisotropy: 1,
        loadFaces: true,
        name: 'Pisa',
        //"rgbm": true,
        prefiltered: '../assets/Pisa/playcanvas/pisa.dds'
      }
    )
    app.scene.skyboxMip = 0
    cubemapAsset.loadFaces = true

    app.assets.add(cubemapAsset)
    app.assets.load(cubemapAsset)
    cubemapAsset.ready(function() {
      app.scene.setSkybox(cubemapAsset.resources)
    })
  }
}
app.assets.loadFromUrl(
  '../assets/Pisa/playcanvas/pisa_posx.jpg',
  'texture',
  function(err, asset) {
    loadedCubeFace()
  }
)
app.assets.loadFromUrl(
  '../assets/Pisa/playcanvas/pisa_negx.jpg',
  'texture',
  function(err, asset) {
    loadedCubeFace()
  }
)
app.assets.loadFromUrl(
  '../assets/Pisa/playcanvas/pisa_posy.jpg',
  'texture',
  function(err, asset) {
    loadedCubeFace()
  }
)
app.assets.loadFromUrl(
  '../assets/Pisa/playcanvas/pisa_negy.jpg',
  'texture',
  function(err, asset) {
    loadedCubeFace()
  }
)
app.assets.loadFromUrl(
  '../assets/Pisa/playcanvas/pisa_posz.jpg',
  'texture',
  function(err, asset) {
    loadedCubeFace()
  }
)
app.assets.loadFromUrl(
  '../assets/Pisa/playcanvas/pisa_negz.jpg',
  'texture',
  function(err, asset) {
    loadedCubeFace()
  }
)

function onResize() {
  const W = window.innerWidth
  const H = window.innerHeight

  COMMON.canvas.width = W
  COMMON.canvas.height = H
  COMMON.canvas.style.width = `${W}px`
  COMMON.canvas.style.height = `${H}px`
}

window.addEventListener('resize', onResize)
onResize()
