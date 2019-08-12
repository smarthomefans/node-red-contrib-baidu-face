const Baidu = require('./lib/Baidu')

module.exports = RED => {

  // 人脸识别
  RED.nodes.registerType('baidu-face', class {
    constructor(config) {
      const node = this
      RED.nodes.createNode(node, config)
      const baiduface = RED.nodes.getNode(config.baiduface)
      node.on('input', async data => {
        try {
          const bd = new Baidu(node, baiduface)

          // 合并值,未细想
          for (const key in config) { if (config[key] != '' && config[key] != null) { data[key] = config[key] } }

          data.max_face_num = data.max_face_num || 5
          data.max_score = data.max_score || 70
          data.user_list = data.user_list || {}
          // 人脸识别
          const userInfo = await bd.searchFace(data)
          data.payload = userInfo
          node.status({ text: `识别成功:${data._msgid}` })
          node.send([data, null])
        } catch (err) {
          node.status({ text: err.message, fill: 'red', shape: 'ring' })
          node.warn(err)
          data.payload = {}
          data.error_msg = err.message
          node.send([null, data])
        }
      })
    }
  })

  // 人流量统计
  RED.nodes.registerType('baidu-body-num', class {
    constructor(config) {
      const node = this
      RED.nodes.createNode(node, config)
      const baiduface = RED.nodes.getNode(config.baiduface)
      node.on('input', async data => {
        try {
          const bd = new Baidu(node, baiduface)

          // 合并值,未细想
          for (const key in config) { if (config[key] != '' && config[key] != null) { data[key] = config[key] } }


          // 人流量统计
          const personInfo = await bd.bodyNum(data)
          data.payload = personInfo
          node.status({ text: `识别成功:${data._msgid}` })
          node.send([data, null])
        } catch (err) {
          node.status({ text: err.message, fill: 'red', shape: 'ring' })
          node.warn(err)
          data.error_msg = err.message
        }
      })
    }
  })

  // 人流量统计（动态版）
  RED.nodes.registerType('baidu-dynamic-body-num', class {
    constructor(config) {
      const node = this
      RED.nodes.createNode(node, config)
      const baiduface = RED.nodes.getNode(config.baiduface)
      node.on('input', async data => {
        try {
          const bd = new Baidu(node, baiduface)

          // 合并值,未细想
          for (const key in config) { if (config[key] != '' && config[key] != null) { data[key] = config[key] } }


          //人流量统计（动态版）
          const personInfo = await bd.dynamicDodyNum(data)
          data.payload = personInfo
          node.status({ text: `识别成功:${data._msgid}` })
          node.send([data, null])
        } catch (err) {
          node.status({ text: err.message, fill: 'red', shape: 'ring' })
          node.warn(err)
          data.error_msg = err.message
        }
      })
    }
  })

  //人体检测和属性识别
  RED.nodes.registerType('baidu-body-attr', class {
    constructor (config) {
      const node = this
      RED.nodes.createNode(node, config)
      const baiduface = RED.nodes.getNode(config.baiduface)
      node.on('input', async data => {
        try {
          const bd = new Baidu(node, baiduface)

          // 合并值,未细想
          for (const key in config) { if (config[key] != '' && config[key] != null) { data[key] = config[key] } }
         
          // 人体检测和属性识别
          const personInfo = await bd.bodyAttr(data)
          data.payload = personInfo
          node.status({ text: `识别成功:${data._msgid}` })
          node.send([data, null])
        } catch (err) {
          node.status({ text: err.message, fill: 'red', shape: 'ring' })
          node.warn(err)
          data.payload = {}
          data.error_msg = err.message
          node.send([null ,data]) 
        }
      })
    }
  })
}
