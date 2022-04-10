const BASE_URL = 'https://se.alangy.net'
const util = require('../../utils/util.js')
Page({
  data: {
    InputBottom: 0,
    scrollTop: 0,
    scrollHeight: 0,
    textHeight: 40,
    myAvatarUrl: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg',
    newMsgTxt: '',
    messages: [],
  },

  computeScrollViewHeight() {
    wx.createSelectorQuery().select('#input-bar').boundingClientRect(rect => {
      const inputHeight = rect.height
      const windowHeight = wx.getSystemInfoSync().windowHeight
      const scrollHeight = windowHeight - getApp().globalData.CustomBar - inputHeight
      this.setData({
        scrollHeight
      })
    }).exec()
  },

  onLoad: function (options) {
    const profile = wx.getStorageSync('profile')
    this.setData({
      myAvatarUrl: profile.avatarUrl || '',
      CustomBar: getApp().globalData.CustomBar
    })
    this.computeScrollViewHeight()
  },

  onShow: function () {
    getApp().globalWatch('chatBotReceive', this.receiveMsg)
  },

  onHide: function () {
    getApp().globalUnWatch('chatBotReceive')
  },

  onUnload: function () {
    getApp().globalUnWatch('chatBotReceive')
  },

  setNewMsgTxt: function (e) {
    this.data.newMsgTxt = e.detail.value;
  },

  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
      // InputBottom: 200
    }, this.pageScrollToBottom)
  },

  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },

  onInputLineChange(e) {
    this.setData({
      textHeight: Math.min(parseInt(e.detail.lineCount), 5) * 40 + 5
    })
    this.computeScrollViewHeight()
    this.pageScrollToBottom()
  },

  pageScrollToBottom: function (callback) {
    // this.setData({scrollTop: 0})
    const that = this
    wx.createSelectorQuery().select('#chat-window').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      that.setData({
        scrollTop: rect.top - rect.height
      })
    }).exec(callback || (() => {}))
  },

  onTapSendBtn: function (e) {
    let that = this

    let msg = that.data.newMsgTxt
    this.sendMsg(msg)
    that.setData({
      newMsgTxt: ''
    }, this.pageScrollToBottom)
    this.setNewMsgTxt({
      detail: {
        value: ''
      }
    })
  },

  sendMsg: function (msg) {
    if (msg.replace(/(^\s*)|(\s*$)/g, "").length === 0) {
      wx.showToast({
        title: '消息不能为空',
        icon: 'error'
      })
      return
    }
    let that = this
    const data = {
      "type": "chat_robot",
      "message": msg
    }
    wx.sendSocketMessage({
      data: JSON.stringify(data),
      success: function (res) {
        let messages = that.data.messages
        messages.unshift({
          self: true,
          text: msg,
        })
        that.setData({
          messages: messages,
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常，无法发送',
          icon: 'none'
        })
      }
    })
  },

  receiveMsg: function (msg) {
    let messages = this.data.messages
    messages.unshift({
      self: false,
      text: msg === '' ? '我听不懂您在说什么' : msg,
    })
    this.setData({
      messages: messages,
    })
  },
})