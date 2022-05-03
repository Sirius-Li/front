// pages/test/test.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    list:[
//       {
//         "type": "wt",
//         "id": 101,
//         "commission_type":{
//             "id": 101,
//             "name": "commission_101"
//         },
//         "name": "跑腿",
//         "start_time": "str",
//         "end_time": "str",
//         "create_at": "str",
//         "updated_at": "str",
//         "real_time": 1,
//         "user": {
//             "id": 1,
//             "nickName": "小明",
//             "avatarUrl": "",
//             "email": "str",
//             "age": "int",
//             "gender": "int",
//             "audit_status": "int",
//             "is_staff": "int",
//         },
//         "location": 1,
//         "status": 1,
//         "description": "代取外卖",
//         "audit": 1,
//         "fee": 5,
//     },
//     {
//       "type": "wt",
//       "id": 102,
//       "commission_type":{
//           "id": 101,
//           "name": "commission_101"
//       },
//       "name": "跑腿",
//       "start_time": "str",
//       "end_time": "str",
//       "create_at": "str",
//       "updated_at": "str",
//       "real_time": 1,
//       "user": {
//           "id": 1,
//           "nickName": "小黑",
//           "avatarUrl": "",
//           "email": "str",
//           "age": "int",
//           "gender": "int",
//           "audit_status": "int",
//           "is_staff": "int",
//       },
//       "location": 1,
//       "status": 1,
//       "description": "代取外卖",
//       "audit": 1,
//       "fee": 5,
//   },
//   {
//     "type": "wt",
//     "id": 103,
//     "commission_type":{
//         "id": 101,
//         "name": "commission_101"
//     },
//     "name": "跑腿",
//     "start_time": "str",
//     "end_time": "str",
//     "create_at": "str",
//     "updated_at": "str",
//     "real_time": 2,
//     "user": {
//         "id": 1,
//         "nickName": "小红",
//         "avatarUrl": "",
//         "email": "str",
//         "age": "int",
//         "gender": "int",
//         "audit_status": "int",
//         "is_staff": "int",
//     },
//     "location": 1,
//     "status": 1,
//     "description": "代取快递",
//     "audit": 1,
//     "fee": 5,
// }
    ],

    releasedWtList: [
      {
        "type": "wt",
        "id": 101,
        "commission_type":{
            "id": 101,
            "name": "commission_101"
        },
        "name": "text",
        "start_time": "str",
        "end_time": "str",
        "create_at": "str",
        "updated_at": "str",
        "real_time": 1,
        "user": {
            "id": 1,
            "nickName": "str",
            "avatarUrl": "",
            "email": "str",
            "age": "int",
            "gender": "int",
            "audit_status": "int",
            "is_staff": "int",
        },
        "location": 1,
        "status": 1,
        "description": "这是一条你发布的委托",
        "audit": 1,
        "fee": 1,
    }
    ],

    appliedWtList: [
      {
        "type": "wt",
        "id": 101,
        "commission_type":{
            "id": 101,
            "name": "commission_101"
        },
        "name": "text",
        "start_time": "str",
        "end_time": "str",
        "create_at": "str",
        "updated_at": "str",
        "real_time": 1,
        "user": {
            "id": 1,
            "nickName": "str",
            "avatarUrl": "",
            "email": "str",
            "age": "int",
            "gender": "int",
            "audit_status": "int",
            "is_staff": "int",
        },
        "location": 1,
        "status": 1,
        "description": "这是一条你申请的委托",
        "audit": 1,
        "fee": 1,
    }
    ],

    finishedWtList: [
      {
        "type": "wt",
        "id": 1011,
        "commission_type":{
            "id": 101,
            "name": "commission_101"
        },
        "name": "text",
        "start_time": "str",
        "end_time": "str",
        "create_at": "str",
        "updated_at": "str",
        "real_time": 1,
        "user": {
            "id": 1,
            "nickName": "str",
            "avatarUrl": "",
            "email": "str",
            "age": "int",
            "gender": "int",
            "audit_status": "int",
            "is_staff": "int",
        },
        "location": 1,
        "status": 1,
        "description": "这是一条你完成的委托",
        "audit": 1,
        "fee": 1,
    }
    ],

    //包括关键字 搜索栏输入关键字
    keywords: '',
    //id 当前用户id
    id: '',
    //type 不同界面进入标识符
    type: 2,
    //
    sort: '',
    status: '',
  },

  /*
  * 获取list数据
  */
  getDetail: function() {
    let app = getApp()
    let head
    let self = this
    if (app.globalData.token == null) {
      head = {      
        'content-type': 'application/json'
       }
    } else {
      head = {      
        'content-type': 'application/json',
        'Authorization': 'Token ' + app.globalData.token
       }
    }
    console.log(this.data.type)
    if(this.data.type == 1){ // 所有类别所有委托
      wx.request({
        url: getApp().globalData.baseUrl + '/api/commission/search/all/', //接口名称   
        header: head,
        method:"GET",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
        }, 
        success(res) {   
          console.log(res.data)
          self.setData({
            list: res.data
          })
        },
        fail(res){
          console.log(res)
          getApp().globalData.util.netErrorToast()
        }
      })
    }
    else if(this.data.type == 2){ // 所有类别指定info委托
      wx.request({
        url: getApp().globalData.baseUrl + '/api/commission/search/all/', //接口名称   
        header: head,
        method:"POST",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
          "info": this.data.keywords
        }, 
        success(res) { 
          console.log("in wtList type = 2")
          console.log(res)
          self.setData({
            list: res.data
          })
          console.log(self.data.list)
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        }
      })
    }
    else if (this.data.type == 3) { // 指定类别所有委托
      wx.request({
        url: getApp().globalData.baseUrl + '/api/commission/search/specific/' + this.data.sort, //接口名称   
        header: head,
        method:"GET",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
          // 'keyword': this.data.keywords
        }, 
        success(res) {   
          self.setData({
            list: res.data
          })
          console.log(res)
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        }
      })
    }
    else if (this.data.type == 4) { // 指定类别指定“info”委托
      wx.request({
        url: getApp().globalData.baseUrl + '/api/commission/search/specific/' + this.data.sort + '/', //接口名称   
        header: head,
        method:"POST",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
          "info": this.data.keywords
        }, 
        success(res) {   
          self.setData({
            list: res.data
          })
          console.log(self.data.list)
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        }
      })
    }
    else {
       // 查看已申请的委托
      wx.request({
        url: getApp().globalData.baseUrl + '/api/commission/applied/2/', //接口名称   
        header: head,
        method:"GET",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
          //'keyword': this.data.keywords
        }, 
        success(res) {   
          self.setData({ 
            appliedWtList: res.data
          })
          console.log(res)
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        }
      })
       // 查看已完成的委托
       wx.request({
        url: getApp().globalData.baseUrl + '/api/commission/applied/3/', //接口名称   
        header: head,
        method:"GET",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
          //'keyword': this.data.keywords
        }, 
        success(res) {   
          self.setData({ 
            finishedWtList: res.data
          })
          console.log(res)
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        }
      })
      // 查看已发布的委托
      wx.request({
        url: getApp().globalData.baseUrl + '/api/commission/check/1/', //接口名称   
        header: head, 
        method:"GET",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
          //'keyword': this.data.keywords
        }, 
        success(res) { 
          self.setData({
            releasedWtList: res.data 
          })
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        }
      })
    }
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      keywords: options.keywords,
        type: options.type
    })
    if(this.data.keywords == undefined){
      this.setData({
        type: options.type,
        id: options.id, // 当前用户id
        sort: options.sort
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDetail();
    //this.tabBar();
  },

  /*tabBar(){
    if(typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setData({
        selected:0
      })
    }
  },*/

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  jumppages : function() {
    wx.switchTab({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
         url:"../publish/publish"
    })
  },

  jumpToSonPages : function(event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../commission/commission?id=' + id,
    })
  },

  gotoUserPage(event){
    //跳转到个人主页
    let userId = event.currentTarget.dataset.userid
    wx.navigateTo({
      url: '../profile/profile?id=' + userId,
    })
  }
})

