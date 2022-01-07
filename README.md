# 微信分页组件
根据本人的项目经验总结, 用最简的代码实现最智能分页组件

#### 最简使用效果: 

1. 组件全自动管理: 请求页数自增,判断最后一页,请求去抖
2. js 实现列表请求只需2行代码
3. wxml 引用组件无需配置参数
4. 返回结果中无当前页数和总页数, 也能支持分页

#### 高级使用效果:

1. 多列表独立: 同时实现多列表显示, 多列表请求
2. 参数自动化注入: 列表参数引入全自动,不影响当前页面已有参数 
3. 请求模式多: 支持使用自定义请求工具
4. 组件接口可重写: 接口更灵活
5. 支持多种方式创建:
    // 方式一: 自动注入: 注入父界面方法, 对应 "组件ID+ReadRequest/RequestSuccess/RequestsuccessList" 
    // 方式二: 自定义初始化: 父界面重写初始化方法"init+组件ID", 默认:initPageView
## 示例

<img src="https://i.niupic.com/images/2022/01/06/9STZ.png" width="600px">

## 最简示例:
<img src="https://i.niupic.com/images/2022/01/06/9SU0.png" width="600px">

### - wxml:

<img src="https://i.niupic.com/images/2022/01/06/9SU1.png" width="600px">
### - js:
<img src="https://i.niupic.com/images/2022/01/06/9SU2.png" width="600px">

