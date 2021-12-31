// pages/base/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageViewTarget: {},
  },
  
  // 滚动分页组件
  // 重写请求准备方法命名规则: id + 'ReadRequest' (默认:pageViewReadRequest)
  pageViewReadRequest(params){
    console.log("pageView请求参数", params)
    // 默认params.method = "POST"
    // params.data默认格式修改, 对应组件内部的initParams方法的wxRequestParams属性
    params.url = "https://mall.ggdzhj.com/api/business/product/queryForList"

    // 会根据返回的params,发起wx.request(params)请求
    // params参数根据wx.request文档
    return params
  }
})