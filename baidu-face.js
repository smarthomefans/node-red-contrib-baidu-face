const Baidu = require('./lib/Baidu')

module.exports = RED => {

     // 人脸识别
  RED.nodes.registerType('baidu-face', class {
    constructor (config) {
      const node = this
      RED.nodes.createNode(node, config)
      const baiduface = RED.nodes.getNode(config.baiduface)
      node.on('input', async data => {
        try {
          const bd = new Baidu(node, baiduface)

          // 合并值,未细想
          for (const key in config) { if (config[key] != '' && config[key] != null) { data[key] = config[key] } }
          
          // 人脸识别
          const userInfo = await bd.searchFace(data)
          data.payload = userInfo
          node.status({ text: `识别成功:${data._msgid}` })
          node.send(data)
        } catch (err) {
          node.status({ text: err.message, fill: 'red', shape: 'ring' })
          node.warn(err)
        }
      })
    }
  })
}
