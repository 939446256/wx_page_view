// components/pageView/pageView.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否需要加载更多
    isShowMoreText: {
      type: Boolean,
      value: true
    },
    /**
     *  请求方法一: 在父界面上定义pageViewId + 'ReadRequest'方法,通过方法回调的params参数,重构请求地址
     *  组件内部请求工具: wx.request
     *  
     *  例子: 
     *  //父界面定义pageVieReadRequest方法(对应组件ID,默认pageVieReadRequest)
     *  pageVieReadRequest(params) {
     *    params.url = "https://mall.ggdzhj.com/api/business/product/queryForList"
     *    return params
     *  }
     */

    /** 
     * 请求方法二: 请求地址 
     * 组件内部请求工具: wx.request
     * 
     * 例子: 
     * <pageView requestUrl="https://mall.ggdzhj.com/api/business/product/queryForList" requestUrlMethod="POST"></pageView>
     */
    requestUrl: {
      type: String,
      value: ""
    },
    requestUrlMethod: {
      type: String,
      value: "POST" // 请求方法对应wx.request
    },
    /** 
     * 请求方法三: 请求方法名称(结合ZHHttp使用)
     * 组件内部请求工具: ZHHttp
     * 
     * 例子:
     * <pageView requestMethodName="queryForList"></pageView>
     */
    requestMethodName: {
      type: String,
      value: ""
    },
    // 每页数据量
    pageLimit: {
      type: Number,
      value: 10
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    //是否加载中
    isLoading: false,
    //是否没有更多内容
    isNoMore: false,
    //是否刷新中
    isRefreshing: false
  },

  /**
   * 组件的方法列表
   */
  ready() {
    // 初始化数据
    this.curPage = 1
    this.listCount = 0
    this.list = []
    const pageViewId = this.id || 'pageView'
    this.id = pageViewId
    // 获取当前页面对象
    const parentPageTarget = getCurrentPages()[getCurrentPages().length - 1]
    // 更新父组件的注入pageView对象
    this.resetInjectionTarget()

    // 方式一: 自动注入: 注入父界面方法, 对应 "组件Id + ReadRequest/RequestSuccess/RequestsuccessList" 
    // 方式二: 自定义初始化: 父界面定义"init+组件ID", 默认:initPageView
    // 检查父界面是否存在自定义初始化方法, 默认 initPageView



    const initFunctionName = 'init' + pageViewId.split("")[0].toUpperCase() + pageViewId.substr(1)
    if (parentPageTarget[initFunctionName]) {
      parentPageTarget[initFunctionName](this)
    } else {
      //初始化-注入父控件
      this.initInjection(parentPageTarget)
    }
  },


  methods: {
    //初始化-注入父控件
    initInjection(parentPageTarget) {
      const pageViewId = this.id || 'pageView'
      this.id = pageViewId
      // 注入参数
      const injectionParam = {}
      injectionParam[pageViewId + 'Target'] = this
      parentPageTarget.setData(injectionParam)
      // 注入方法提示
      // if(!parentPageTarget[pageViewId + 'ReadRequest']) console.log("组件pageView的父组件页面,可定义方法" + pageViewId + 'ReadRequest')
      // if(!parentPageTarget[pageViewId + 'RequestSuccess']) console.log("组件pageView的父组件页面,可定义方法" + pageViewId + 'RequestSuccess')

      // 请求方法
      let httpTool = wx.request
      // 存在ZHHttp封装请求名称
      if (this.data.requestMethodName) {
        // #可替换为对应自己的请求封装
        httpTool = wx.$ZHHttp[this.data.requestMethodName]
      }

      this.init({
        http: httpTool,
        callReadRequest: parentPageTarget[pageViewId + 'ReadRequest'],
        callSuccess: parentPageTarget[pageViewId + 'RequestSuccess'],
      })

      // 发起首次请求
      this.refresh()
    },

    // 组成分页基础参数
    initParams(pageLimit, curPage) {
      const wxRequestParams = {
        method: this.data.requestUrlMethod || "POST",
        url: this.data.requestUrl, //仅为示例，并非真实的接口地址
        data: {
          "pager": {
            "currentPage": curPage,
            "pageSize": pageLimit
          }
        },
        success: res => {
          this.requestSuccess(res)
        },
        fail: err => {
          this.requestFail(err)
        }
      }
      const zhHttpRequestParams = {
        "pager": {
          "currentPage": curPage,
          "pageSize": pageLimit
        }
      }
      // 判断是否自定义请求工具
      return this.httpTool == wx.request ? wxRequestParams : zhHttpRequestParams
    },

    // 初始化组件属性
    init({
      http,
      callReadRequest,
      callSuccess,
      callFail
    }) {
      // 判断是否存在http,否则用wx.request
      this.httpTool = http || wx.request
      //判断是否函数或者undefined
      if (this.isFuntionOrUndefined(callReadRequest)) {
        this.callReadRequest = callReadRequest ? callReadRequest : (params) => params
      }
      //判断是否函数或者undefined
      if (this.isFuntionOrUndefined(callSuccess)) {
        this.callSuccess = callSuccess ? callSuccess : () => {}
      }
      //判断是否函数或者undefined
      if (this.isFuntionOrUndefined(callFail)) {
        this.callFail = callFail ? callFail : () => {}
      }
    },

    // 功能方法:判断是否函数或者undefined
    isFuntionOrUndefined(fun) {
      return (typeof fun) == 'function' || fun == undefined
    },

    //发出请求
    requestList() {
      const httpTool = this.httpTool
      if (!httpTool) return
      // 初始化基础请求参数
      let baseParams = this.initParams(this.data.pageLimit, this.curPage)
      // 调用父组件方法, 可修改请求前参数
      let params = this.callReadRequest(baseParams) || {}

      if (httpTool == wx.request) {
        httpTool(params)
      } else {
        httpTool(params).then(res => {
          this.requestSuccess(res)
        }, err => {
          this.requestFail(err)
        })
      }
    },

    initSuccessResponse(res) {
      const list = res.data.data.list || []
      return list
    },

    requestSuccess(res) {
      // 请求成功回调
      this.callSuccess(res)
      const list = this.initSuccessResponse(res)
      // 更新组件数据
      this.updateDate(list)
      // 更新父组件的注入pageView对象
      this.resetInjectionTarget()
    },

    requestFail(err) {
      console.log("请求失败", err)
    },

    updateDate(list) {
      //当前页面
      const curPage = this.curPage
      //数据列表数量
      this.listCount = curPage == 1 ? list.length : this.listCount + list.length
      // 拼接
      this.list = curPage == 1 ? list : [...this.list, ...list]
      this.setData({
        //是否加载中
        isLoading: false,
        isNoMore: list.length < this.data.pageLimit
      })
    },

    // 更新父组件的注入pageView对象
    resetInjectionTarget() {
      const pageViewId = this.id || ""
      const injectionParam = {}
      injectionParam[pageViewId + 'Target'] = this
      const parentPageTarget = getCurrentPages()[getCurrentPages().length - 1]
      parentPageTarget.setData(injectionParam)
    },

    //刷新
    refresh() {
      if (this.data.isRefreshing) {
        return
      }
      console.log('下拉刷新')
      this.curPage = 1
      this.setData({
        isNoMore: false
      })

      setTimeout(() => {
        this.setData({
          isRefreshing: false
        })
      }, 300)

      this.requestList()
    },

    //上拉加载更多
    scrolltolower() {
      //防抖
      this.isStopBindScroll = true
      setTimeout(() => {
        this.isStopBindScroll = false
      }, 500)

      const {
        isLoading,
        isNoMore
      } = this.data
      if (isLoading || isNoMore) {
        return
      }
      console.log('上拉加载更多')
      this.curPage = this.curPage + 1

      this.setData({
        //是否加载中
        isLoading: true,
      })
      this.requestList()
    },

    // 点击加载更多
    clickMore() {
      this.scrolltolower()
    },

    // 滚动监听
    bindscroll(e) {
      if (this.isStopBindScroll) return
      const {
        scrollTop,
        scrollHeight,
      } = e.detail
      this.triggerEvent("scrollTop", {
        top: scrollTop,
        height: scrollHeight
      })
    }
  }
})