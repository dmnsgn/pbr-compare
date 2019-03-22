import COMMON from '../common.js'

import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

window.THREE = THREE
require('three/examples/js/loaders/HDRCubeTextureLoader')
require('three/examples/js/loaders/RGBELoader')
require('three/examples/js/pmrem/PMREMGenerator')
require('three/examples/js/pmrem/PMREMCubeUVPacker')

COMMON.addLabel('three.js')

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: COMMON.canvas
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.gammaOutput = true
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  COMMON.fov,
  window.innerWidth / window.innerHeight,
  COMMON.near,
  COMMON.far
)

const orbitControls = new OrbitControls(camera, renderer.domElement)
camera.position.set(...COMMON.initialPosition)
orbitControls.update()

const xAxis = new THREE.Mesh(
  new THREE.BoxGeometry(0.4, 0.003, 0.003),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
xAxis.position.set(0.2, 0, 0)
scene.add(xAxis)

const yAxis = new THREE.Mesh(
  new THREE.BoxGeometry(0.003, 0.4, 0.003),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
yAxis.position.set(0, 0.2, 0)
scene.add(yAxis)

const zAxis = new THREE.Mesh(
  new THREE.BoxGeometry(0.003, 0.003, 0.4),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
zAxis.position.set(0, 0, 0.2)
scene.add(zAxis)

const hdrCubeTextureLoader = new THREE.HDRCubeTextureLoader()
hdrCubeTextureLoader
  .setPath(COMMON.panoramaBasePath)
  .load(
    THREE.UnsignedByteType,
    ['px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr'],
    (hdrCubeMap) => {
      const pmremGenerator = new THREE.PMREMGenerator(hdrCubeMap)
      pmremGenerator.update(renderer)

      const pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(
        pmremGenerator.cubeLods
      )
      pmremCubeUVPacker.update(renderer)

      const hdrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget

      hdrCubeMap.magFilter = THREE.LinearFilter
      hdrCubeMap.needsUpdate = true

      pmremGenerator.dispose()
      pmremCubeUVPacker.dispose()

      scene.background = hdrCubeMap
      loadGLTF(hdrCubeRenderTarget.texture)
    }
  )

function loadGLTF(envMap) {
  const glTFloader = new GLTFLoader()
  glTFloader.load(COMMON.modelUrl, function(data) {
    const gltf = data
    const object = gltf.scene

    object.traverse(function(node) {
      if (node.isMesh) node.castShadow = true
    })
    object.traverse(function(node) {
      if (
        node.material &&
        (node.material.isMeshStandardMaterial ||
          (node.material.isShaderMaterial &&
            node.material.envMap !== undefined))
      ) {
        node.material.envMap = envMap
        node.material.needsUpdate = true
      }
    })

    scene.add(object)
  })
}

function animate() {
  requestAnimationFrame(animate)
  orbitControls.update()
  renderer.render(scene, camera)
}

animate()

window.addEventListener(
  'resize',
  () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  },
  false
)
