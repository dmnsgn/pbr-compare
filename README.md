# PBR Compare

Testing different PBR implementations for glTF in WebGL with HDR Envmaps and IBL.

**Please Note:** On a daily basis I use PEX so pull requests, improvements and other engine suggestions welcome!

Required features:

- glTF 2.0 loading
- HDR equirectangular panorama skybox (fallback to engine specific Cubemap layout if not supported)
- PBR Rendering with image based lighting and prefiltered rough reflections
- SSAO

![](screenshot.png)

## Live demo

[http://dmnsgn.github.io/pbr-compare/index.html](http://dmnsgn.github.io/pbr-compare/index.html)

## Running code

```
npm install
npm start
```

## Notes

### [ClayGL](http://claygl.xyz)

- I'm using [Advanced Renderer](https://github.com/pissang/claygl-advanced-renderer) for SSAO.
- [ ] There is inconsistency with environment map orientation [#5](https://github.com/vorg/pbr-compare/issues/5)

### [PEX](http://pex.gl)

- [ ] There is inconsistency with environment map orientation
- [ ] There is inconsistency with environment map orientation [#5](https://github.com/vorg/pbr-compare/issues/5)

### [THREE](http://threejs.org)

- [ ] I'm using HDR Cubemap instead of Equirect HDR Panorama [#3](https://github.com/vorg/pbr-compare/issues/3)
- [ ] I'm using LDR Cubemap for Skybox and HDR cubemap for reflections [#4](https://github.com/vorg/pbr-compare/issues/4)

### [BabylonJS](http://babylonjs.com)

- No issues here

### [PlayCanvas](http://playcanvas.com)

- [ ] Albedo seems to be broken and too dark

## Credits

**Flight Helmet**
Donated by Microsoft for glTF testing
Created by [Patrick Ryan](https://www.linkedin.com/in/patrickcryan)

**Vatican Road by HDRI Heaven**
https://hdrihaven.com/hdri/?c=outdoor&h=vatican_road
