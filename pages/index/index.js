Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonList: [{
      label: "基础使用",
      toNav: "/pages/base/index"
    },{
      label: "多列表使用",
      toNav: "/pages/morePageView/index"
    },{
      label: "多种请求用法",
      toNav: "/pages/advancedPageView/index"
    }]
  },

  click(e){
    const item = e.currentTarget.dataset.item
    console.log(item)
    wx.navigateTo({
      url: item.toNav,
    })
  }
})