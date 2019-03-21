const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const libs = ['pex', 'threejs', 'babylonjs', 'filament', 'claygl', 'playcanvas']

const entry = Object.values(libs).reduce((entries, lib) => {
  entries[lib] = `./${lib}/index.js`
  return entries
}, {})

const pages = Object.values(libs).map(
  (lib) =>
    new HtmlWebpackPlugin({
      inject: true,
      chunks: [`${lib}`],
      filename: `build/${lib}.html`
    })
)

module.exports = {
  entry,
  output: {
    filename: 'build/[name].js',
    path: __dirname
  },
  plugins: [
    ...pages,
    new CopyWebpackPlugin([
      { from: 'assets/filament/filament.wasm', to: 'build' }
    ])
  ],
  // externals: {
  //   fs: 'fs',
  //   crypto: 'crypto',
  //   path: 'path'
  // },
  node: { fs: 'empty' }
}
