// vue.config.js
const UniappDevtoolLauncherWebpackPlugin = require("uniapp-devtool-launcher-webpack-plugin");

module.exports = {
  configureWebpack: {
    plugins: [
      new UniappDevtoolLauncherWebpackPlugin()
    ]
  }
}