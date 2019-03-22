import COMMON from '../common.js'

import BABYLON from 'babylonjs'
import 'babylonjs-loaders'

COMMON.addLabel('BabylonJS')

const engine = new BABYLON.Engine(COMMON.canvas, true)

const scene = new BABYLON.Scene(engine)
scene.imageProcessingConfiguration.toneMappingEnabled = true
scene.imageProcessingConfiguration.toneMappingType =
  BABYLON.ImageProcessingConfiguration.tonemapping_aces
scene.imageProcessingConfiguration.exposure = 1

const camera = new BABYLON.ArcRotateCamera(
  'Camera',
  Math.PI / 2 + Math.PI / 6,
  Math.PI / 2 - Math.PI / 12,
  1,
  new BABYLON.Vector3(0, 0, 0),
  scene
)

camera.setTarget(BABYLON.Vector3.Zero())
camera.attachControl(COMMON.canvas, false)
camera.fov = (COMMON.fov * Math.PI) / 180.0
camera.minZ = COMMON.near
// camera.maxZ = COMMON.far
const xAxis = BABYLON.MeshBuilder.CreateBox(
  'xAxis',
  { height: 0.003, width: 0.4, depth: 0.003 },
  scene
)
xAxis.material = new BABYLON.StandardMaterial('myMaterial', scene)
xAxis.material.emissiveColor = new BABYLON.Color3(1, 0, 0)
xAxis.position = new BABYLON.Vector3(-0.2, 0, 0)

const yAxis = BABYLON.MeshBuilder.CreateBox(
  'yAxis',
  { height: 0.4, width: 0.003, depth: 0.003 },
  scene
)
yAxis.material = new BABYLON.StandardMaterial('myMaterial', scene)
yAxis.material.emissiveColor = new BABYLON.Color3(0, 1, 0)
yAxis.position = new BABYLON.Vector3(0, 0.2, 0)

const zAxis = BABYLON.MeshBuilder.CreateBox(
  'yAxis',
  { height: 0.003, width: 0.003, depth: 0.4 },
  scene
)
zAxis.material = new BABYLON.StandardMaterial('myMaterial', scene)
zAxis.material.emissiveColor = new BABYLON.Color3(0, 0, 1)
zAxis.position = new BABYLON.Vector3(0, 0, 0.2)

const hdrTexture = new BABYLON.HDRCubeTexture(COMMON.panoramaUrl, scene, 512)
scene.createDefaultSkybox(hdrTexture, true)

BABYLON.SceneLoader.Append(
  COMMON.modelBasePath,
  COMMON.modelFileName,
  scene,
  function() {}
)

engine.runRenderLoop(function() {
  scene.render()
})

window.addEventListener('resize', function() {
  engine.resize()
})
