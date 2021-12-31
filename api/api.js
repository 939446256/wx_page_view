import ZHHttp from './ZHHttp'

// 自定义接口
const requestConfig = {
  // ======================  通用  ======================
  // 列表
  getProductList: {
    post: '/api/business/product/queryForList'
  },
  // 添加
  addProduct: {
    post: '/api/business/product/add'
  },
}

/**
 * 请求例子:
 * 1. 最简请求 [注释: 默认取第一配置(多种GET,POST请求方法情况)]
 * const params = { name: "AK" }  //get请求默认为替换Path变量
 * zhHttp.getIsCollect(params).then(res => console.log)
 *
 * 2. 配置请求
 * 参数 method 请求方法 (默认:取配置第一个)
 * 参数 params 请求参数
 * 参数 urlParams 替换Path参数
 * const params = { name: "AK" }
 * const urlParams = { id: 9999 }
 * zhHttp.getIsCollect( { method: 'post', params: params, urlParams: urlParams } ).then(res => console.log)
 */
const zhHttp = ZHHttp(requestConfig)

export default zhHttp