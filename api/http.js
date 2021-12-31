// http get工具函数 获取数据

function get(params) {
  params.method = "GET"
  return request(params)
}

function post(params) {
  params.method = "POST"
  return request(params)
}


// ===============  功能方法  ===============
function request({
  url,
  baseUrl,
  method,
  data,
  header = {
    'content-type': 'application/json',
  },
  isShowToast = true,
}) {

  //封装请求逻辑,方便循环请求
  let wxRequest = function(resolve, reject, {
    typeList
  } = {}) {
    let requestPath = "https://mall.ggdzhj.com"

    wx.request({
      data,
      method,
      header,
      url: baseUrl ? baseUrl : (requestPath + url),
      success: (res) => {
        // 请求成功回调
        wx.hideLoading()
        let status = res.data.code || res.statusCode
        let message = res.data.msg
        switch (+status) {
          case 200: //成功
            resolve(res)
            break
          default:
            console.log("请求失败信息:", message)
            isShowToast && message && wx.showToast({
              title: message,
              icon: "none"
            })
            reject && reject(res)
            break
        }
      },
      fail: (err) => {
        console.log(err)
        let errMsg = '请求失败'
        //判断 请求失败类型
        switch (err.errMsg){
          case "request:fail timeout":
            errMsg = '请求超时'
          break
          case "request:fail ":
          case "request:fail":
            errMsg = '请求失败'
          break
          default: 
            if (err.errMsg) errMsg = err.errMsg;
          break
        }
        isShowToast && wx.showToast({
          title: errMsg,
          icon: "none",
        })
        wx.hideLoading()
        reject && reject(err)
      }
    })
  }
  return new Promise(wxRequest)
}


const http = {
  get,
  post
}

export default http