Page({
  /**
   * 页面的初始数据
   */
  data: {
  },
  // 左滚动分页组件
  // 重写请求准备方法命名规则: 组件id + 'ReadRequest'
  // 注意: 重写initPageView初始化方法, 该方法不会被调用 (对应init的callReadRequest)
  leftPageViewReadRequest(params){
    console.log("leftPageView请求参数", params)
    params.url = "https://mall.ggdzhj.com/api/business/product/queryForList"
    params.method = "POST"
    params.data = {
      "pager": {
        "currentPage": params.data.curPage,
        "pageSize": params.data.maxLimit
      }
    }
    return params
  },

  // 右滚动分页组件
  // 重写初始化方法, 命名规则: 组件id + Target
  initRightPageView(pageView){
    // 存储方便使用
    this.rightPageView = pageView
    pageView.init({
      callReadRequest: (params) => {
        console.log("rightPageView请求参数", params)
        params.url = "https://mall.ggdzhj.com/api/business/product/queryForList"
        params.data = {
          "pager": {
            "currentPage": params.data.curPage,
            "pageSize": params.data.maxLimit
          }
        }
        return params
      },
      callSuccess: (data) => {
        console.log("rightPageView请求成功", data)
      },
      callSuccessList: (list) => {
        console.log("rightPageView组件数据列表",list)
      }
    })
    // 重写后,需手动发起第一次刷新请求
    pageView.refresh()
  }
})