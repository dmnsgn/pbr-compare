import COMMON from '../common.js'

import * as clay from 'claygl'
import ClayAdvancedRenderer from 'claygl-advanced-renderer'

COMMON.addLabel('ClayGL')

clay.application.create(COMMON.canvas, {
  autoRender: false,

  init(app) {
    this._advancedRenderer = new ClayAdvancedRenderer(
      app.renderer,
      app.scene,
      app.timeline,
      {
        shadow: true,
        temporalSuperSampling: {
          enable: false
        },
        postEffect: {
          enable: true,
          bloom: {
            enable: false
          },
          screenSpaceAmbientOcclusion: {
            temporalFilter: true,
            enable: true,
            intensity: 1.5,
            radius: 0.4
          },
          FXAA: {
            enable: false
          }
        }
      }
    )

    this._camera = app.createCamera(COMMON.initialPosition, [0, 0, 0])
    this._camera.fov = (0.8 / Math.PI) * 180

    this._control = new clay.plugin.OrbitControl({
      target: this._camera,
      domElement: app.container
    })

    this._control.on('update', () => {
      this._advancedRenderer.render()
    })

    const xAxis = app.createCube({ color: 'red' })
    xAxis.scale.x = 0.4 / 2
    xAxis.scale.y = 0.003 / 2
    xAxis.scale.z = 0.003 / 2
    xAxis.position.x = 0.2

    const yAxis = app.createCube({ color: 'green' })
    yAxis.scale.x = 0.003 / 2
    yAxis.scale.y = 0.4 / 2
    yAxis.scale.z = 0.003 / 2
    yAxis.position.y = 0.2

    const zAxis = app.createCube({ color: 'blue' })
    zAxis.scale.x = 0.003 / 2
    zAxis.scale.y = 0.003 / 2
    zAxis.scale.z = 0.4 / 2
    zAxis.position.z = 0.2

    app
      .createAmbientCubemapLight(COMMON.panoramaUrl, 1, 0.8, 0)
      .then((result) => {
        const skybox = new clay.plugin.Skybox({
          scene: app.scene
        })
        skybox.setEnvironmentMap(result.environmentMap)
        this._advancedRenderer.render()
      })

    app.loadModel(COMMON.modelUrl)

    window.addEventListener(
      'resize',
      () => {
        app.renderer.resize(window.innerWidth, window.innerHeight)
        this._camera.aspect = app.renderer.getViewportAspect()
        this._advancedRenderer.render()
      },
      false
    )
  },

  loop(app) {
    this._control.update(app.frameTime)
  }
})
