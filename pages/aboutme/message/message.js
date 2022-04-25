// pages/message/message.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    messageTitles: {
      "1": "日程提醒",
      "3": "活动推荐",
      "4": "订阅提醒",
      "2": "系统通知",
      "5": "评论回复"
    },

    secretMsg: [],

    newSecretMsgCount: 0,
    newNotificationCount: 0
  },

  routeSecretMsg: function (event) {
    const id = event.currentTarget.dataset.fromuserid
    const name = event.currentTarget.dataset.fromusername
    const avatarUrl = event.currentTarget.dataset.fromuseravatar
    wx.navigateTo({
      url: '../../profile/fakeMsg/fakeMsg?id=' + id + '&name=' + name + '&avatarUrl=' + avatarUrl,
    })
  },

  watchBack: function (value) {
    if (value) {
      
      this.getSecretMsg()
    }
  },

  getSecretMsg: function () {
    const that = this
    let secretMsg = []
    let messages = wx.getStorageSync('messages')
    for (let k in messages) {
      if (k !== 'unread_count') {
        let now = new Date()
        let from_user_messages = messages[k]
        let last_message = from_user_messages.message_data[from_user_messages.message_data.length - 1] || {
          self: false,
          text: '',
          time: util.formatTime2(`${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`),
        }
        secretMsg.push({
          fromUserId: from_user_messages.id,
          name: from_user_messages.nickName,
          avatarUrl: from_user_messages.avatarUrl,
          lastMsg: last_message.text.trim().split('\n')[0],
          lastTime: that.getMessageTime(last_message.time),
          unreadCount: from_user_messages.unread_count,
          trueLastTime: last_message.time
        })
      }
    }
    secretMsg.sort((x, y) => {
      return new Date(y.trueLastTime).getTime() - new Date(x.trueLastTime).getTime()
    })
    this.setData({
      secretMsg: secretMsg,
      newSecretMsgCount: messages.unread_count
    })
  },

  onChange: function(event) {
    this.setData({
      active: event.detail.index
    })
  },

  getMessage: function() {
    var systemMessages = []
    var replyMessages = []
    var headers = {}
    var app = getApp()
    var that = this
    if (app.globalData.token != null) {
      // headers = {
      //   Authorization: 'Token ' + app.globalData.token
      // }
      headers['Authorization'] = 'Token ' + app.globalData.token
    }
    //  else {
    //   headers = {}
    // }
    
    wx.request({
      url: getApp().globalData.baseUrl + '/api/notifications/my/',
      method: 'GET',
      header: headers,
      success (res) {
        
        for (var i = 0; i < res.data.length; i++) {
          var m = res.data[i]
          var dis = {
            'title': that.data.messageTitles[m.type],
            'content': m.content,
            'time': that.getMessageTime(m.created_time)
          }
          m.display = dis
          systemMessages.push(m)
        }
        that.setData({
          systemMessages: systemMessages,
          replyMessages: replyMessages,
          newNotificationCount: res.data.filter(d => !d.isread).length
        })
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  getMessageContent: function(type, content) {
    switch (type) {
      case 'schedule_remind':
        return '活动"' + content.activity_name + '"即将开始，请注意时间'
      case 'recommend_activity':
        return '系统为您推荐了活动: ' + content.activity_name + '，可点击跳转到活动页面查看详情'
      case 'subscription_remind':
        return '您订阅的活动"' + content.activity_name + '"发布了，可点击跳转到活动页面查看详情'
      default:
        return content
    }
  },

  getMessageTime: function(time) {
    var myDate = new Date()
    var times = time.split(' ')
    var nowData = myDate.toLocaleDateString()
    var date1 = new Date(nowData)
    var date2 = new Date(times[0])
    if (date1.getTime() === date2.getTime()) {
      return times[1]
    } else {
      var dd = parseInt((myDate.getTime()-Date.parse(new Date(times[0])))/ (1000 * 60 * 60 * 24))
      if (dd >= 7) {
        var datas = times[0].split('/')
        var nowDatas = nowData.split('/')
        if (datas[0] == nowDatas[0]) {
          return datas[1] + '/' + datas[2]
        } else {
          return times[0]
        }
      } else {
        return dd + '天前'
      }
    }
  },

  dateEqual: function (date1, date2) {
    
    
    var d1 = date1.split('/')
    var d2 = date2.split('/')
    for (var i = 0; i < 3; i++) {
      if (parseInt(d1[i]) != parseInt(d2[i])) {
        return false
      }
    }
    return true
  },

  routeActivityDescription: function (event) {
    let activityId = event.currentTarget.dataset.activityid
    let messageId = event.currentTarget.dataset.messageid
    var headers = {}
    if (getApp().globalData.token != null) {
      headers = {
        Authorization: 'Token ' + getApp().globalData.token
      }
    }
    wx.request({
      url: getApp().globalData.baseUrl + `/api/notifications/${messageId}/read_notification/`,
      header: headers,
      method: 'GET'
    })
    if (activityId) {
      wx.navigateTo({
        url: '../../actList/activity/activity?id=' + activityId,
      })
    }
  },

  deleteMessage: function (event) {
    var deleteId = event.currentTarget.dataset.messageid
    var that = this
    var headers = {}
    if (getApp().globalData.token != null) {
      headers = {
        Authorization: 'Token ' + getApp().globalData.token
      }
    }
    Dialog.confirm({
      message: '是否要删除这条系统消息',
    }).then(() => {
      wx.request({
        url: getApp().globalData.baseUrl + '/api/notifications/' + deleteId + '/user_delete/',
        method: 'POST',
        header: headers,
        success (res) {
          
          that.getMessage()
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        }
      })
    }).catch(() => {
      
    });
  },

  deleteAll: function (event) {
    var message = '是否要删除所有系统消息?'
    var that = this
    var headers = {}
    if (getApp().globalData.token != null) {
      headers = {
        Authorization: 'Token ' + getApp().globalData.token
      }
    }
    Dialog.confirm({
      message: message
    }).then(() => {
      wx.request({
        url: getApp().globalData.baseUrl + '/api/notifications/user_deleteall/',
        method: 'GET',
        header: headers,
        success (res) {
          
          that.getMessage()
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        }
      })
    }).catch(() => {

    })
  },

  setAllRead: function (event) {
    var message = '是否要将所有系统消息设为已读？'
    var that = this
    var headers = {}
    if (getApp().globalData.token != null) {
      headers = {
        Authorization: 'Token ' + getApp().globalData.token
      }
    }
    Dialog.confirm({
      message: message
    }).then(() => {
      wx.request({
        url: getApp().globalData.baseUrl + '/api/notifications/read/',
        method: 'GET',
        header: headers,
        success (res) {
          
          that.getMessage()
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        }
      })
    }).catch(() => {

    })
  },

  setAllSecretMsgRead: function () {
    const that = this
    
    Dialog.confirm({
      message: '是否要将所有未读私信消息标记为已读？'
    }).then(() => {
      let messages = wx.getStorageSync('messages')
      for (let k in messages) {
        if (k !== 'unread_count') {
          messages[k].unread_count = 0
        }
      }
      messages.unread_count = 0
      wx.setStorageSync('messages', messages)
      that.getSecretMsg()
      getApp().globalData.messageCount = 0
    }).catch(() => {

    })
  },

  deleteAllSecretMsg: function () {
    
    const that = this
    Dialog.confirm({
      message: '是否要清空本地私信聊天记录？'
    }).then(() => {
      let messages = {
        unread_count: 0
      }
      wx.setStorageSync('messages', messages)
      const messagesId = []
      wx.setStorageSync('messagesId', messagesId)
      that.getSecretMsg()
      getApp().globalData.messageCount = 0
    }).catch(() => {
      
    })
  },

  deleteSecretMsg: function (event) {
    const fromUserId = event.currentTarget.dataset.fromuserid
    const that = this
    Dialog.confirm({
      message: '是否要删除与该用户的本地私信聊天记录？'
    }).then(() => {
      let messages = wx.getStorageSync('messages')
      let unread_count = messages[fromUserId].unread_count
      delete messages[fromUserId]
      wx.setStorageSync('messages', messages)
      that.getSecretMsg()
      getApp().globalData.messageCount -= unread_count
    }).catch(() => {
      
    })
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().init();
    getApp().watch('new_message_func', 'message', this.watchBack)
    this.getMessage()
    this.getSecretMsg()
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    getApp().unWatch('new_message_func', 'message')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    getApp().unWatch('new_message_func', 'message')
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

  }
})