// pages/aboutme/aboutme.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    userAvatarUrl: '',
    activityClasses: [{
        text: '日程',
        icon: 'todo-list-o',
      },
      {
        text: '活动',
        icon: 'clock-o',
      },
      {
        text: '委托',
        icon: 'medal-o',
      },
      {
        text: '话题',
        icon: 'chat-o',
      },
    ],
    activityStat: [
      {
        name: '已参加活动数',
        value: '0',
      },
      {
        name: '已发布且通过审核的活动数',
        value: '0',
      },
    ],
    menuItems: [
      /*{
        text: '我的消息',
        icon: 'icon iconfont icon-message',
        url: '/pages/aboutme/message/message',
      },*/
      {
        text: '关注列表',
        icon: 'icon iconfont icon-guanzhu',
        url: '/pages/profile/follow/follow',
      },
      {
        text: '运动',
        icon: 'icon iconfont icon-sport-o',
        url: '/pages/activity/sports/sports',
      },
      {
        text: 'FAQ',
        icon: 'icon iconfont icon-faq',
        url: '/pages/other/faq/faq',
      },
      {
        text: '权限申诉',
        icon: 'warning-o',
        url: '/pages/other/appeal/appeal'
      },
      {
        text: '意见反馈',
        icon: 'service-o',
        url: '/pages/feedback/feedback',
      },
      {
        text: '关于',
        icon: 'info-o',
        url: '/pages/other/about/about',
      },
    ],

    notificationCount: 0,
    messageCount: 0,

    //消息开关
    messageChecked: false,

    // 消息提醒
    messageReminder: '',
    messageHasSetting: '',

    //博雅选择开关的值
    boyaChecked: null,
    //开启博雅功能弹出框展示字段
    openShow: false,
    //关闭博雅功能弹出框展示字段
    closeShow: false,
    //弹出输入框的值
    password: '',
    //弹出的输入框为空检查
    errMsg: '',
    
    //是否订阅推送
    subscribeMsgChecked: null,
    //是否有订阅设置
    hasSetting: null
  },

  messageSwitch({detail}){
    console.log(detail)
    if(detail === true){
      this.rcvMsg()
    }else{
      this.undoRcvMsg()
    }
    this.getMessageStatus()
  },

  // 接收消息提醒
  rcvMsg() {
    console.log("in rcvMsg")
    if(this.data.messageHasSetting == false){
      let self = this
      wx.requestSubscribeMessage({
        tmplIds: ['tnmAvtNzq1q0BHU-eou3pUurmiaRGGpFQxHW9VO5GB4'],
        success (res) { 
          console.log("wx.requestSubscribeMessage success")
          // self.getMessageStatus()
        },
        fail (res) {
          console.log("fail")
          console.log(res)
        }
      })
    }else{
      wx.showModal({
        title: '开启消息提醒',
        content: '请前往微信小程序的设置界面开启（受腾讯推送规范限制，暂只能使用放假通知类别进行订阅推送）',
        confirmText: '现在前往',
        success (res) {
          if (res.confirm) {
            wx.openSetting({
              withSubscriptions: true,
              success (res) {
                console.log("success in 接收消息提醒 openSetting", res)
              },
              fail (res) {
                console.log("fail in 接收消息提醒 openSetting", res)
              }
            })
          }
        }
      })
    }
  },

  // 取消消息提醒
  undoRcvMsg(){
    console.log("in undoRcvMsg")
    wx.showModal({
      title: '取消消息提醒',
      content: '请前往微信小程序的设置界面取消',
      confirmText: '现在前往',
      success (res) {
        console.log(res)
        if (res.confirm) {
          console.log("hhh")
          wx.openSetting({
            withSubscriptions: true,
            success (res) {
              console.log("undoRcvMsg openSetting success", res)
            },
            fail (res) {
              console.log("undoRcvMsg openSetting fail", res)
            }
          })
        }
      }
    })
  },

  getMessageStatus(){
    let self = this
    wx.getSetting({
      // 同时获取用户订阅消息的订阅状态
      withSubscriptions: true,
      success(res) {
        console.log("in getMessageStatus")
        console.log(res)
        console.log(res.subscriptionsSetting)
        if(res.subscriptionsSetting == undefined){
          self.setData({
            messageChecked: false,
            messageHasSetting: false
          })
          //console.log(self.data.subscribeMsgChecked)
        }else{
          self.setData({
            messageChecked: res.subscriptionsSetting.mainSwitch,
            //  &&
            //  res.subscriptionsSetting == 'accept', // 貌似有bug
            messageHasSetting: true
          })
        }
        //console.log(self.data.subscribeMsgChecked)
      },
    })
  },

  //博雅开关选择和取消
  boyaSwitch({detail}){
    if(detail === true){
      this.setData({
        openShow: true
      })
    }else{
      this.setData({
        closeShow: true
      })
    }
  },

  //统一认证账号密码提交
  passwordSubmit(){
    if(this.data.password === ''){
      this.setData({
        errMsg: '密码不能为空'
      })
    } else{
      var header = {}
      if (getApp().globalData.token != null) {
        header = {
          'content-type': 'application/json',
          'Authorization': `Token` + ' ' + `${getApp().globalData.token}`
        }
      }else{
        header = {
          'content-type': 'application/json'
        }
      }
      let self = this

      //开启加载提示
      Toast.loading({
        message: '提交中...',
        forbidClick: true,
        duration: 0
      });
      wx.request({
        url: getApp().globalData.baseUrl + '/api/update_user_bykc',
        method: 'POST',
        header: header,
        data: {
          is_active: true,
          sso_password: this.data.password
        },
        success(res) {
          Toast.clear();
          if (res.statusCode === 201) {
            self.setData({
              boyaChecked: true,
              openShow: false,
              password: '',
              errMsg: ''
            })
            wx.showToast({
              title: '开启成功'
            })
            wx.request({
              url: getApp().globalData.baseUrl + '/api/update_bykc',
              method: 'POST',
              header: header,
              data: {

              },
              success(res) {
                if(res.statusCode === 201){

                }else{

                }
              },
              fail(res){

              }
            })
          } else {

            /*wx.showToast({
              title: res.data.detail,
              icon: 'none'
            })*/
            wx.showModal({
              content: res.data.detail,
              showCancel: false
            })
          }
        },
        fail(res){
          Toast.clear()
          getApp().globalData.util.netErrorToast()
        }
      })

    }
  },

  //关闭弹窗
  dialogClose(){
    this.setData({
      password: '',
      errMsg: ''
    })
  },

  //取消博雅功能
  undoBoya(){
    var header = {}
    if (getApp().globalData.token != null) {
      header = {
        'content-type': 'application/json',
        'Authorization': `Token` + ' ' + `${getApp().globalData.token}`
      }
    }else{
      header = {
        'content-type': 'application/json'
      }
    }
    let self = this
    wx.request({
      url: getApp().globalData.baseUrl + '/api/update_user_bykc',
      method: 'POST',
      header: header,
      data: {
        is_active: false,
        sso_password: ''
      },
      success(res) {
        if (res.statusCode === 201) {
          self.setData({
            boyaChecked: false
          })
          wx.showToast({
            title: '取消成功'
          })
        } else {
          /*wx.showToast({
            title: res.data.detail,
            icon: 'none'
          })*/
          wx.showModal({
            content: res.data.detail,
            showCancel: false
          })
        }
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  //取消空输入报错
  hasPassword(event){
    this.setData({
      errMsg: ''
    })
  },

  //订阅推送的允许和取消
  subscribeMsgSwitch({detail}){
    console.log("in subscribeMsgSwitch")
    console.log(detail)
    if(detail === true){
      this.subscribe()
    }else{
      this.undosubscribe()
    }
    this.getSubscribeStatus()
  },

  //请求订阅推送
  subscribe(){
    console.log("in subscribe")
    console.log(this.data.hasSetting)
    if(this.data.hasSetting == false){
      let self = this
      wx.requestSubscribeMessage({
        tmplIds: [
          'rDBOdvuEP9THubpDddJL3CQNvvrnLGmTiV1KN9jtPUA'],
        success (res) { 
          console.log("wx.requestSubscribeMessage success")
          self.getSubscribeStatus()
        },
        fail (res) {
          console.log("fail")
          console.log(res)
        }
      })
    }else{
      wx.showModal({
        title: '开启订阅推送',
        content: '请前往微信小程序的设置界面开启（受腾讯推送规范限制，暂只能使用放假通知类别进行订阅推送）',
        confirmText: '现在前往',
        success (res) {
          if (res.confirm) {
            console.log("confirm")
            wx.openSetting({
              withSubscriptions: true,
              success (res) {
                console.log("success in 开启订阅openSetting", res)
              },
              fail (res) {
                console.log("fail in 开启订阅openSetting", res)
              }
            })
          }
        }
      })
    }
  },

  //取消订阅推送
  undosubscribe(){
    console.log("in undosubscribe")
    wx.showModal({
      title: '取消订阅推送',
      content: '请前往微信小程序的设置界面取消',
      confirmText: '现在前往',
      success (res) {
        console.log(res)
        if (res.confirm) {
          console.log("hhh")
          wx.openSetting({
            withSubscriptions: true,
            success (res) {
              console.log("success")
              console.log(res)
            },
            fail (res) {
              console.log("fail")
              console.log(res)
            }
          })
        }
      }
    })
  },

  //获取推送订阅状态
  getSubscribeStatus(){
    let self = this
    wx.getSetting({
      // 同时获取用户订阅消息的订阅状态
      withSubscriptions: true,
      success(res) {
        console.log("in getSubscribeStatus")
        console.log(res)
        console.log(res.subscriptionsSetting)
        if(res.subscriptionsSetting == undefined){
          self.setData({
            subscribeMsgChecked: false,
            hasSetting: false
          })
          //console.log(self.data.subscribeMsgChecked)
        }else{
          self.setData({
            subscribeMsgChecked: res.subscriptionsSetting.mainSwitch,
            //  &&
            //  res.subscriptionsSetting == 'accept', // 貌似有bug
             hasSetting: true
          })
        }
        //console.log(self.data.subscribeMsgChecked)
      },
    })
  },

  onTapUserName: function () {
    const userId = this.data.userId
    const url = `../profile/profile?id=${userId}`
    wx.navigateTo({url})
  },

  navigateToActivities(event){
    const type = event.currentTarget.dataset.type
    if (type === 0) {
      const url = `../activity/calendar/calendar`
      wx.navigateTo({url})
    } else if (type === 1) {
      const url = `../actList/actList?type=2`
      wx.navigateTo({url})
    } else if (type === 2) {
      const url = `../wtList/wtList?type=5`
      wx.navigateTo({url})
    } else if (type === 3) {
      const url = `../htList/htList?type=5`
      wx.navigateTo({url})
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //this.getInfo()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().init();
    getApp().getNotificationCount()
    if(getApp().globalData.user_status === 2){
      wx.redirectTo({
        url: '../certification/certification',
      })
    }else if(getApp().globalData.user_status === 1){
      wx.switchTab({
        url: '../activity/home/home',
        success(res){
          wx.showToast({
            title: '用户还在认证中',
            icon: 'error'
          })
        }
      })
    }else{
      this.getInfo()
      this.setMessageCount()
      getApp().watch('notificationCountFunc', 'aboutme', (value) => {
        if (value !== this.data.notificationCount) {
          this.setNotificationCount()
        }
      })
      getApp().watch('messageCountFunc', 'aboutme', (value) => {
        if (value !== this.data.messageCount) {
          this.setMessageCount()
        }
      })

      //获取推送订阅的状态
      this.getSubscribeStatus()
      //获取消息提醒状态
      this.getMessageStatus()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    getApp().unWatch('notificationCountFunc', 'aboutme')
    getApp().unWatch('messageCountFunc', 'aboutme')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    getApp().unWatch('notificationCountFunc', 'aboutme')
    getApp().unWatch('messageCountFunc', 'aboutme')
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

  onTapMenuItem: function (e) {
    const {url} = e.currentTarget.dataset
    wx.navigateTo({url})
  },

  getInfo: function () {
    var that = this
    var header = {}
    if (getApp().globalData.token != null) {
      header = {
        'content-type': 'application/json',
        'Authorization': `Token` + ' ' + `${getApp().globalData.token}`
      }
    }
    wx.request({
      url: getApp().globalData.baseUrl + '/api/users/profile/',
      method: 'GET',
      header: header,
      success(res) {
        if (res.statusCode === 200) {
          const data = res.data
          var stat = that.data.activityStat
          stat[0].value = data.attend_activities_count
          stat[1].value = data.create_activities_count
          that.setData({
            userId: data.id,
            username: data.nickName,
            userAvatarUrl: data.avatarUrl,
            phone: data.phone,
            studentId: data.student_id,
            gender: data.gender,
            email: data.email,
            activityStat: stat,
            notificationCount: data.unread_message_count,
            boyaChecked: data.bykc_isactive
          })
          wx.setStorageSync('profile', data)
        } else {
        }
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  setMessageCount: function () {
    this.setData({
      messageCount: getApp().globalData.messageCount
    })
  },

  setNotificationCount: function () {
    this.setData({
      notificationCount: getApp().globalData.notificationCount
    })
  }
})
