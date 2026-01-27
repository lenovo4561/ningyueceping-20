/*
 * 用户相关接口
 */
import $ajax from '../ajax'

const baseUrl = 'https://quick.shijinzhuang.com/'

export default {
  init(data) {
    return $ajax.get(`${baseUrl}user/init.do`, data)
  }
}
