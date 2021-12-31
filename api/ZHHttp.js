// import axiosApi from '@/api/AxiosApi'
import httpTool from './http'


const _ZHHttp = {}
// ======================  核心代码  ======================
/**
 * 请求例子:
 * 1. 最简请求 [注释: 默认取第一配置(多种GET,POST请求方法情况)]
 * const p = { name: "AK" }
 * wx.$ZHHttp.billingSetting(p).then(res => console.log)
 *
 * 2. 配置请求
 * 参数 method 请求方法 (默认取配置第一个)
 * 参数 params 请求参数
 * 参数 urlParams 替换URL参数
 * const p = { name: "AK" }
 * wx.$ZHHttp.billingSetting( { method: 'PUT', params: p, urlParams: {id: 9999} } ).then(res => console.log)
 */
export default function init(requestConfig) {
  for (const _apiKey in requestConfig) {
    const _apiConfig = requestConfig[_apiKey]
    const request = function(requestParams = {}) {
      // 自定义参数
      const {
        params,
        urlParams,
        method
      } = requestParams
      // 判断是否持有特定参数
      if (params || urlParams) {
        // 配置请求
        return buildRequest({ _apiConfig, _apiKey, ...requestParams })
      } else {
        // 最简请求
        return buildSimpleRequest(_apiConfig, requestParams)
      }
    }
    _ZHHttp[_apiKey] = request
  }
  return _ZHHttp
}

// 最简请求
function buildSimpleRequest(_apiConfig, requestParams) {
  const method = Object.keys(_apiConfig)[0]
  let url = _apiConfig[method]
  //是否需要替换url参数
  if (method == 'get' || method == 'GET' || method == 'getFile') url = replaceUrlParams(url, requestParams)
  return httpTool[method]({
    url,
    data: requestParams,
  })

}

// 配置请求
function buildRequest({
  _apiConfig,
  _apiKey,
  params,
  urlParams,
  method,
  pid,
  isShowToast
}) {
  // 1.请求方法
  const axiosMethod = method || Object.keys(_apiConfig)[0]
  // 2.请求URL
  let axiosUrl = _apiConfig[axiosMethod]
  if (!axiosUrl) {
    return console.error('配置中没有找到该Method方法')
  }
  // 2.1判断是否需要替换URL中的变量
  if (urlParams) axiosUrl = replaceUrlParams(axiosUrl, urlParams)
  // 3.请求数据
  const data = params
  return httpTool[axiosMethod]({
    url: axiosUrl,
    pid,
    data,
    isShowToast
  })
}

// 替换URL参数方法
function replaceUrlParams(axiosUrl, urlParams) {
  
  const paramsType = typeof urlParams
  if(paramsType === 'string' || paramsType === 'number') {
    axiosUrl = axiosUrl.replace(/{[a-zA-Z]+}/g,urlParams)
  }else{
    for (const key in urlParams) {
      const urlKey = `{${key}}`
      const item = urlParams[key]
      axiosUrl = axiosUrl.replace(urlKey, item)
    }
  }
  
  return axiosUrl
}
