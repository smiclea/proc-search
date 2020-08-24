const lodash = require('lodash')
const webpack = require('webpack')
const CopyPkgJsonPlugin = require('copy-pkg-json-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

const isEnvProduction = process.env.NODE_ENV === 'production'
const isEnvDevelopment = process.env.NODE_ENV === 'development'
const dotenv = require('dotenv')

const dotenvConfig = dotenv && dotenv.config && dotenv.config()
const env = (dotenvConfig && dotenvConfig.parsed) || process.env
const envKeys = Object.keys(env).reduce((prev, next) => {
  // eslint-disable-next-line no-param-reassign
  prev[`process.env.${next}`] = JSON.stringify(env[next])
  return prev
}, {})

// #region Common settings
const commonConfig = {
  devtool: isEnvDevelopment ? 'source-map' : false,
  mode: isEnvProduction ? 'production' : 'development',
  output: { path: path.join(__dirname, 'dist') },
  node: { __dirname: false, __filename: false },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
      },
      {
        test: /\.(png|jpe?g|svg|woff2?|ttf|eot)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: './assets/[hash].[ext]',
        },
      },
    ],
  },
}
// #endregion

const mainConfig = lodash.cloneDeep(commonConfig)
mainConfig.entry = './src/main/main.ts'
mainConfig.target = 'electron-main'
mainConfig.output.filename = 'main.bundle.js'
mainConfig.plugins = [
  new webpack.DefinePlugin(envKeys),
  new CopyPkgJsonPlugin({
    remove: ['scripts', 'devDependencies', 'build'],
    replace: {
      main: './main.bundle.js',
      scripts: { start: 'electron ./main.bundle.js' },
      postinstall: 'electron-builder install-app-deps',
    },
  }),
]

const rendererConfig = lodash.cloneDeep(commonConfig)
rendererConfig.entry = './src/renderer/renderer.tsx'
rendererConfig.target = 'electron-renderer'
rendererConfig.output.filename = 'renderer.bundle.js'
rendererConfig.plugins = [
  new CopyPlugin({ patterns: ['./public/icon.png'] }),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, './public/index.html'),
  }),
]

module.exports = [mainConfig, rendererConfig]
