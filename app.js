// app.js
import ZHHttp from "./api/api"
App({
  onLaunch() {
    // 注入请求工具
    wx.$ZHHttp = ZHHttp
  },
  globalData: {
    userInfo: null
  }
})
