module.exports = (RED) => {
    RED.nodes.registerType('baidu-face-configurator', class {
      constructor (config) {
        RED.nodes.createNode(this, config)
        Object.assign(this, config)
      }
    })
  }