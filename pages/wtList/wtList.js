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
            "avatarUrl": "str",
            "email": "str",
            "age": "int",
            "gender": "int",
            "audit_status": "int",
            "is_staff": "int",
        },
        "location": 1,
        "status": 1,
        "description": "text",
        "audit": 1,
        "fee": 1,
    }
    ],
    //包括关键字
    keywords: '',
    //id
    id: '',
    //type
    type: 0,
    //
    locList:['','学院路', '沙河', '校外']
  },

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
    if(this.data.type == 1){
      wx.request({    
        url: getApp().globalData.baseUrl + '/api/commission/search/all/', //接口名称   
        header: head,
        method:"GET",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
          // 'keyword': this.data.keywords
        }, 
        success(res) {   
          console.log(res.data)
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
    else if(this.data.type == 6){
      var value = []
      value.push(this.data.id)
      wx.request({    
        url: getApp().globalData.baseUrl + '/api/condition/activities/', //接口名称   
        header: head,
        method:"POST",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
          "types": {
            "method": "id",
            "value": value,
          },
          'audit_status': [3]
        }, 
        success(res) { 
          self.setData({
            list: res.data
          })
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        } 
      })
    }
    else if(this.data.type >= 2 && this.data.type <= 4){
      wx.request({    
        url: getApp().globalData.baseUrl + '/api/condition/activities/', //接口名称   
        header: head,
        method:"POST",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
          'user_attend':true,
          'audit_status': [3],
          "activity_status": this.data.type - 1
        }, 
        success(res) { 
          self.setData({
            list: res.data
          })
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        } 
      })
    }
    else if(this.data.type == 5){
      wx.request({    
        url: getApp().globalData.baseUrl + '/api/condition/activities/', //接口名称   
        header: head,
        method:"POST",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
          'user_create':true,
        }, 
        success(res) { 
          // console.log(res)
          self.setData({
            list: res.data
          })
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        } 
      })
    }
    //type == 7 热门活动
    else if(this.data.type == 7){
      let self = this
      //后端默认取前十天，这里暂不处理
      /*let nowTime = new Date()
      let preTime = new Date()
      preTime.setDate(nowTime.getDate() - 10)
      console.log(nowTime.toLocaleDateString())
      console.log(preTime.toLocaleDateString())*/
      wx.request({
        url: getApp().globalData.baseUrl + '/api/activities_trend/',
        method: 'POST',
        data: {
  
        },
        header: head,/*{
          'name-type': 'application/json' // 默认值
        },*/
        success (res) {
          self.setData({
            list: res.data
          })
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        }
      })
    }else{
      //let nowDate = new Date()
      //let nowDateStr = nowDate.toLocaleDateString() + ' ' + nowDate.getHours() + ':' + nowDate.getMinutes() 
      //console.log(nowDateStr)
      wx.request({
        url: getApp().globalData.baseUrl + '/api/condition/activities/',
        method: 'POST',
        data: {
          'types': {
            'method':'name',
            'value': ['博雅']
          },
          'audit_status': [3],
          'activity_status': 4
        },
        header: head,
        success (res) {
          if(res.statusCode == 200){
            self.setData({
              list: res.data
            })
          }else{
            //console.log('用户不存在')
          }
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
    this.setData({
      keywords: options.keywords
    })
    if(this.data.keywords == undefined){
      this.setData({
        type: options.type,
        id: options.id
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
      url: '../commission/commission',
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




