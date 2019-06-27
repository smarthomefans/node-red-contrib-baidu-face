const axios = require('axios')
const BaiduCode = require('./BaiduCode')
const qs = require('qs');

const EXPIRE_TIME = 1000 * 3600 * 2

class BaiduClass {
  constructor (node, config) {
    this.node = node
    this.config = config
  }
  getToken () {
    const { set: setCache, get: getCache } = this.node.context().global
    const { client_id, client_secret } = this.config
    const cache_key = `baidu-face-${client_id}`
    return new Promise(async (resolve, reject) => {
      try {
        const cache = getCache(cache_key)
        if (cache && cache.time && ((new Date().valueOf() - cache.time) < EXPIRE_TIME)) {
          // console.log('has cache', cache)
          resolve(cache.token)
          return
        }
        const { data } = await axios.get('https://aip.baidubce.com/oauth/2.0/token', {
          params: { grant_type: 'client_credentials', client_id, client_secret }
        }).catch(err => {
          throw new Error(`[百度Token]${err}`)
        })
        if (!data.access_token) {
          reject(new Error('[百度Token]token获取失败'))
        }
        setCache(cache_key, {
          token: data.access_token,
          time: new Date().valueOf()
        })
        resolve(data.access_token)
      } catch (err) { reject(err) }
    })
  }


  getAsr (amr) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await this.getToken()
        const { data } = await axios.post('https://vop.baidu.com/server_api', amr, {
          params: { dev_pid: 1537, token, cuid: 12345 },
          headers: { 'Content-Type': 'audio/amr;rate=8000' }
        }).catch(err => {
          throw new Error(`[百度Asr]${err}`)
        })
        if (data.err_no > 0) {
          const msg = BaiduCode[data.err_no] || data.err_msg
          throw new Error(`[百度Asr]${msg}`)
        }
        resolve(data.result)
      } catch (err) { reject(err) }
    })
  }

  searchFace(config){
    return new Promise(async (resolve, reject) => {

      try {
        const token = await this.getToken()

        const postData  = {image_type: 'BASE64', 'group_id_list': config.group_id_list , image: config.image , max_face_num: config.max_face_num }
        const { data } = await axios.post(`https://aip.baidubce.com/rest/2.0/face/v3/multi-search?access_token=${token}`, postData, {
          headers: { 'Content-Type': 'application/json' }
        }).catch(err => {
          throw new Error(`[百度baidubce]${err}`)
        })

        //222001 - 222026 统一为： 222001

        if (data.error_code > 0) {
          let code = -1;
          if (data.error_code >= 222001 && data.error_code <= 222026) {
            code = 222001
          }else {
            code = data.error_code
          }
          const msg = BaiduCode[code] || data.error_msg
          throw new Error(`[百度baidubce]${msg}`)
        }

        resolve(data.result)
      } catch (error) {
        reject(error) 
      }
    })
  }

  bodyNum(config){
    return new Promise(async (resolve, reject) => {

      try {
        const token = await this.getToken()

        const postData  = { image: config.image , show: config.show }

        const { data } = await axios.post(`https://aip.baidubce.com/rest/2.0/image-classify/v1/body_num?access_token=${token}`, qs.stringify(postData), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).catch(err => {
          throw new Error(`[百度body num]${err}`)
        })
        console.log(data)
        if (data.error_code > 0) {
          const msg = BaiduCode[data.error_code] || data.error_msg
          throw new Error(`[百度body num]${msg}`)
        }

        resolve(data)
      } catch (error) {
        reject(error) 
      }
    })
  }

  dynamicDodyNum(config){
    return new Promise(async (resolve, reject) => {

      try {
        const token = await this.getToken()

        const postData  = { image: config.image , show: config.show ,dynamic:false }

        const { data } = await axios.post(`https://aip.baidubce.com/rest/2.0/image-classify/v1/body_tracking?access_token=${token}`, qs.stringify(postData), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).catch(err => {
          throw new Error(`[百度 dynamic body num]${err}`)
        })
        console.log(data)
        if (data.error_code > 0) {
          const msg = BaiduCode[data.error_code] || data.error_msg
          throw new Error(`[百度 dynamic body num]${msg}`)
        }

        resolve(data)
      } catch (error) {
        reject(error) 
      }
    })
  }
}
module.exports = BaiduClass