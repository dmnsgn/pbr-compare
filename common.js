document.documentElement.style.width = '100%'
document.documentElement.style.height = '100%'
document.body.style.width = '100%'
document.body.style.height = '100%'
document.body.style.margin = '0'
document.body.style.padding = '0'
document.body.style.overflow = 'hidden'

const canvas = document.createElement('canvas')
canvas.style.width = '100%'
canvas.style.height = '100%'
document.body.appendChild(canvas)

function addLabel(name) {
  const label = document.createElement('p')
  label.innerText = name
  label.style.position = 'absolute'
  label.style.top = '10px'
  label.style.left = '10px'
  label.style.fontFamily = 'Arial, sans-serif'
  label.style.fontSize = '14px'
  label.style.backgroundColor = 'black'
  label.style.color = 'white'
  label.style.padding = '2px 4px'
  label.style.margin = '0'
  label.style.pointerEvents = 'none'
  document.body.appendChild(label)
}

module.exports = {
  canvas,
  addLabel,
  panoramaUrl: '../assets/Pisa/pisa.hdr',
  panoramaBasePath: '../assets/Pisa/',
  panoramaFileName: 'pisa.hdr',
  modelUrl: '../assets/FlightHelmet/glTF/FlightHelmet.gltf',
  modelBasePath: '../assets/FlightHelmet/glTF/',
  modelFileName: 'FlightHelmet.gltf',
  initialPosition: [0.482, 0.2588, 0.836],
  fov: 45,
  near: 0.1,
  far: 100
}
