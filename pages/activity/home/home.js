// pages/activity/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList:['热门话题', '委托推荐', '热门活动'],
    //获取到的订阅类别
    categories:[],

    locList:['','学院路', '沙河', '校外'],

    swiperList: [{
      id: 0,
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.91goodschool.com%2Fupfiles%2Fag%2F1338%2F2022%2F201502%2F03%2F171333486531.jpg&refer=http%3A%2F%2Fimg.91goodschool.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622821169&t=612eba11a6f8bd59dafbf2cc37d641ae',
    }, {
      id: 1,
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20191027%2Fa7f52f2d93484a18a4d61548e87e7dc8.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622821211&t=9d3eef5ea8c82980e6e9b1f97800be21'
    }, {
      id: 2,
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20171222%2F49f19646cf004ab2a025e5d058fc6f1b.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622821224&t=b7e34ed56d36f5b8e9b52b89a017f373'
    }, {
      id: 3,
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimage.thepaper.cn%2Fwww%2Fimage%2F27%2F59%2F446.jpg&refer=http%3A%2F%2Fimage.thepaper.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622821211&t=444129e28cdf760a2d719a8839ad11b4'
    }, {
      id: 4,
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fphotos.tuchong.com%2F69068%2Ff%2F4784941.jpg&refer=http%3A%2F%2Fphotos.tuchong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622821224&t=e4f9f60c6e5b4d8d6a76989adffa5973'
    }, {
      id: 5,
      url: 'https://gss0.baidu.com/70cFfyinKgQFm2e88IuM_a/baike/pic/item/b3f6cea2fb2b54e9caefd001.jpg'
    }, {
      id: 6,
      url: '../../../img/bg.jpg'
    }],

    activityList:[
      {
      id: 0,
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg',
      name:'活动1',
      location:'学院路',
      type:'运动',
      signUpTime:'2021/4/18 6:00-2021/4/18 9:00',
      startTime:'2021/4/19 6:00',
      endTime:'2021/4/19 8:00',
      amount:'100',
      total:'200',
      brief:'啦啦啦啦啦',
      tags:['标签1', '标签2']
    }, {
      id: 1,
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg',
      name:'活动2',
      location:'沙河',
      type:'博雅',
      signUpTime:'2021/4/18 6:00-2021/4/18 9:00',
      startTime:'2021/4/19 6:00',
      endTime:'2021/4/19 9:00',
      amount:'100',
      total:'200',
      brief:'哈哈哈哈哈',
      tags:['标签1', '标签2','标签3']
    }, {
      id: 2,
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg',
      name:'活动3',
      location:'沙河',
      type:'运动',
      signUpTime:'2021/4/18 6:00-2021/4/18 9:00',
      startTime:'2021/4/19 6:00',
      endTime:'2021/4/19 9:00',
      amount:'100',
      total:'200',
      brief:'啦啦啦啦啦啦啦啦啦',
      tags:['标签1', '标签2','标签3']
    }
    ],

    shortcutList:[
      // {
      //   bgColor: "#16C2C2",
      //   //图标/图片地址
      //   imgUrl: "img/robot.png",
      //   //图片高度 rpx
      //   imgHeight: 64,
      //   //图片宽度 rpx
      //   imgWidth: 64,
      //   //名称
      //   text: "小助手",
      //   //字体大小
      //   fontSize: 34,
      //   //字体颜色
      //   color: "#fff"
      // }
    ],

    height: null,
    //当前轮播位置
    current: 0,
    //当前滚动条滚动距离
    scrollTop: 0,
    //当前标签页名称
    type: null,
    //是否正在加载
    loading: true
  },

  //轮播位置
  change: function (e) {
    this.setData({
      current: e.detail.current
    })
  },

  //获取滚动条滚动距离
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },

  //响应悬浮按钮的操作
  onClick(e) {
    let index = e.detail.index
    
    switch (index) {
      case -1:
        if(getApp().globalData.user_status === 0) {
          wx.navigateTo({
            url: '../../chatBot/chatBot',
          })
        } else {
          wx.showModal({
            content: '认证后解锁该功能',
            showCancel: false
          })
        }
        break;
      default:
        break;
    }
  },

  //聚焦到搜索时，跳转到搜索页面
  focus: function(){
    wx.navigateTo({
      url: './search/search'
    })
  },

  //点击标签栏时，从后端获取活动信息
  getActivityList:function(event){
    //type为活动类型
    let type = event.detail.title
    // console.log(type)
    let self = this
    this.setData({
      type: type,
      activityList: [],
      loading: true
    })
    let app = getApp()
    if (app.globalData.token == null) {
      this.data.head = {      
        'content-type': 'application/json'
       }
    } else {
      this.data.head = {      
        'content-type': 'application/json',
        'Authorization': 'Token ' + app.globalData.token
       }
    }
    if(type == '热门话题'){
      let self = this
      wx.request({
        url: getApp().globalData.baseUrl + '/api/topic_search_trend/',
        method: 'POST',
        data: {
  
        },
        header: this.data.head,
        success (res) {
          self.setData({
            activityList: self.unique(res.data),
            loading: false
          })
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        }
      })
    } else if (type == '委托推荐') {
      let self = this
      wx.request({
        url: getApp().globalData.baseUrl + '/api/commission/search/all/',
        method: 'GET',
        data: {
  
        },
        header: this.data.head,
        success (res) {
          self.setData({
            activityList: self.unique(res.data),
            loading: false
          })
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        }
      })
    } else{
      wx.request({    
        url: getApp().globalData.baseUrl + '/api/recommend/activities/', //接口名称   
        header: this.data.head,
        method:"POST",  //请求方式 
        data: {
          // "types": {
          //   "method": "name",
          //   "value": [type],
          // },
          // 'audit_status': [3]
        }, 
        success(res) { 
          if(res.statusCode == 200){
            self.setData({
              activityList: res.data,
              loading: false
            })
            
          }else{
            
          }
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        }
      })
    }
  },

  //加载页面时获取综合推荐的活动信息
  getCompoActivityList:function(){
    this.setData({
      type: '热门话题'
    })
    let app = getApp()
    if (app.globalData.token == null) {
      this.data.head = {      
        'content-type': 'application/json'
       }
    } else {
      this.data.head = {      
        'content-type': 'application/json',
        'Authorization': 'Token ' + app.globalData.token
       }
    }
    let self = this
    wx.request({
      url: getApp().globalData.baseUrl + '/api/topic/',
      method: 'GET',
      data: {

      },
      header: this.data.head,
      success (res) {
        console.log(res)
        self.setData({
          activityList: self.unique(res.data),
          loading: false
        })
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      }
    })

  },

  //去除重复活动，这里后端回传会重复的活动，需要进行沟通一下，目前前端先解决
  unique(actList) {
    let res = new Map();
    return actList.filter((a) => !res.has(a.id) && res.set(a.id, 1))
  },

  //根据订阅内容更新标签页
  getTabs: function () {
    var that = this
    var headers = {}
    if (getApp().globalData.token != null) {
      headers = {
        Authorization: 'Token ' + getApp().globalData.token
      }
    }
    wx.request({
      url: getApp().globalData.baseUrl + '/api/activity_types_user_list/',
      method: 'GET',
      header: headers,
      success (res) {
        if(res.statusCode == 200){
          that.setData({
            categories: res.data
          })
          let tempTypeList = ['热门话题', '委托推荐', '热门活动']
          for(let i = 0; i < that.data.categories.length; i++){
            if(that.data.categories[i].id != 1 && that.data.categories[i].id != 5 && that.data.categories[i].id != 9
              && that.data.categories[i].is_subscribe == true){
              tempTypeList.push(that.data.categories[i].name)
            }
          }
          that.setData({
            typeList: tempTypeList
          })
        }else{
          
        }
      },

      fail(res){
        getApp().globalData.util.netErrorToast()
      }
    })
  },


  jumpToSonPages : function(event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../actList/activity/activity?id='+id,
    })
  },

  jumpToWt : function(event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../commission/commission?id='+id,
    })
  },

  jumpToHt : function(event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../htdetail/htdetail/?id='+id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let screenHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      height: screenHeight * 0.6
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  //与后台通信，获得轮播图片地址,修改swiperList
  getSwiperUrl: function(){

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().init();
    getApp().getNotificationCount()
    this.getSwiperUrl()
    let app = getApp()
    if (app.globalData.logined == false) {
      //callback
      app.loginedCallback = (logined) => {
        if (logined == true) {
          this.getTabs()
          this.getCompoActivityList()
        }
      }
    } else {
      this.getTabs()
      this.getCompoActivityList()
    }
  },

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
})