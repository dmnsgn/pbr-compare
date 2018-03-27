
document.documentElement.style.height = '100%'
const clay = require('claygl')

document.body.style.height = '100%'
document.body.style.margin = '0'

var canvas = document.createElement('canvas')
canvas.style.width = '100%'
canvas.style.height = '100%'
canvas.id = 'viewport'
document.body.appendChild(canvas)

var app = clay.application.create('#viewport', {

    graphic: {
        shadow: true,

        // Enable tonemapping
        tonemapping: true,

        // Use linear color space instead of default sRGB.
        linear: true
    },

    init: function (app) {
        // Create camera
        this._camera = app.createCamera([4.82, 2.588, 8.36], [0, 0, 0]);
        this._camera.fov = 0.8 / Math.PI * 180
        this._camera.updateProjectionMatrix()

        // Create light
        // app.createDirectionalLight([-1, -1, -1]);

        // Use orbit control
        this._control = new clay.plugin.OrbitControl({
            // The target or orbit control. Usually is a camera.
            target: this._camera,
            // The HTMLDomElement where we need to addEventListener.
            domElement: app.container
        });

        app.createAmbientCubemapLight('../assets/vatican_road_2k.hdr', 1, 1, 1)//0.009125);

        var cubemap = new clay.TextureCube();
        app.loadTexture('../assets/vatican_road_2k.hdr', {
            flipY: false,
            exposure: 0.5
        }).then(function (panoramaTexture) {
            // Convert panorama to a cubemap
            clay.util.texture.panoramaToCubeMap(app.renderer, panoramaTexture, cubemap);

            var skybox = new clay.plugin.Skybox({
                // Attach skybox to the scene.
                scene: app.scene,
                // Use the cubemap as environment
                environmentMap: cubemap
            });
        });

        // Load model. return a load promise to make sure the look will be start after model loaded.
        return app.loadModel('../assets/FlightHelmet/glTF/FlightHelmet.gltf').then(function (scene) {
          // scene.meshes.forEach((m) => m.material.set('environmentMap', cubemap))
        })
    },

    loop: function (app) {
        // Control status must be updated each frame.
        this._control.update(app.frameTime);
    }
});
