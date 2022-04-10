const BASE_URL = 'https://se.alangy.net'
const util = require('../../../utils/util.js')
const defaultAvatarUrl = 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'
Page({
  data: {
    InputBottom: 0,
    scrollTop: 0,
    scrollHeight: 0,
    textHeight: 40,
    thatUserId: 0,
    hideMsgs: true,
    thatUser: '',
    myId: '',
    myAvatarUrl: defaultAvatarUrl,
    thatAvatarUrl: defaultAvatarUrl,
    newMsgTxt: '',
    messages: [],
    showMessages: [],
    showCount: 20,
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
    getApp().globalWatch('ackSendMessage', this.setMessages)
    const profile = wx.getStorageSync('profile')
    this.setData({
      thatUserId: options.id,
      thatUser: options.name,
      thatAvatarUrl: options.avatarUrl,
      myAvatarUrl: profile.avatarUrl,
      myId: profile.id,
      CustomBar: getApp().globalData.CustomBar
    })
    this.computeScrollViewHeight()
  },

  watchBack: function (value) {
    if (value) {
      this.getMessages(false)
    }
  },

  onShow: function () {
    getApp().globalWatch('ackSendMessage', this.setMessages)
    getApp().watch('new_message_func', 'fakeMsg', this.watchBack)
    this.getMessages(true)
    this.getInfo()
    this.getAnotherInfo()
  },

  onHide: function () {
    getApp().globalUnWatch('ackSendMessage')
    getApp().unWatch('new_message_func', 'fakeMsg')
  },

  onUnload: function () {
    getApp().globalUnWatch('ackSendMessage')
    getApp().unWatch('new_message_func', 'fakeMsg')
  },

  routeToProfile: function (event) {
    const id = event.currentTarget.dataset.id
    wx.redirectTo({
      url: `/pages/profile/profile?id=${id}&fromMsg=${true}`,
    })
  },

  getMessages: function (onshow) {
    const that = this
    getApp().globalData.new_message = false
    const messages = wx.getStorageSync('messages')
    let from_user_messages = messages[this.data.thatUserId]
    if (from_user_messages !== undefined) {
      const newMessageCount = from_user_messages.unread_count
      if (newMessageCount !== 0) {
        getApp().globalData.messageCount -= newMessageCount
        messages.unread_count -= newMessageCount
        from_user_messages.unread_count = 0
      }
      if (onshow) {
        from_user_messages.message_data.sort((x, y) => {
          return new Date(x.time).getTime() - new Date(y.time).getTime()
        })
      }
      this.data.showCount += newMessageCount
      const end = from_user_messages.message_data.length
      const start = end - this.data.showCount >= 0 ? end - this.data.showCount : 0
      this.setData({
        messages: from_user_messages.message_data,
        showMessages: from_user_messages.message_data.slice(start, end).reverse()
      }, () => {
        this.pageScrollToBottom(() => {
          this.setData({
            hideMsgs: false
          })
        })
      })
      messages[this.data.thatUserId] = from_user_messages
      wx.setStorageSync('messages', messages)
    } else {
      this.setData({
        hideMsgs: false
      })
    }
  },

  getInfo: function () {
    const that = this
    const header = this.getHeaderWithToken()
    wx.request({
      url: `${BASE_URL}/api/users/profile/`,
      method: 'GET',
      header: header,
      success(res) {
        if (res.statusCode === 200) {
          const data = res.data
          if (that.data.myAvatarUrl !== data.avatarUrl) {
            that.setData({
              myAvatarUrl: data.avatarUrl
            })
            wx.setStorageSync('profile', data)
          }
        } else {

        }
      },
      fail(res) {
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  getAnotherInfo: function () {
    const that = this
    const header = this.getHeaderWithToken()
    wx.request({
      url: `${BASE_URL}/api/users/${that.data.thatUserId}/info/`,
      method: 'GET',
      header,
      success(res) {
        if (res.statusCode === 200) {
          const data = res.data
          if (that.data.thatAvatarUrl !== data.avatarUrl) {
            that.setData({
              thatAvatarUrl: data.avatarUrl,
            })
            let messages = wx.getStorageSync('messages')
            if (messages[that.data.thatUserId] !== undefined) {
              messages[that.data.thatUserId].avatarUrl = data.avatarUrl
              wx.setStorageSync('messages', messages)
            }
          }
          if (that.data.thatUser !== data.nickName) {
            that.setData({
              thatUser: data.nickName,
            })
            let messages = wx.getStorageSync('messages')
            if (messages[that.data.thatUserId] !== undefined) {
              messages[that.data.thatUserId].nickName = data.nickName
              wx.setStorageSync('messages', messages)
            }
          }
        }
      },
      fail(res) {
        getApp().globalData.util.netErrorToast()
      }
    })
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

  onScrollToUpper(e) {
    const that = this
    const messages = this.data.messages
    const end = messages.length
    const nowMessage = messages[end - this.data.showCount]
    let newShowCount = this.data.showCount + 20
    if (newShowCount > end) {
      newShowCount = end
    }
    const topIndex = newShowCount - this.data.showCount
    const start = end - newShowCount
    this.setData({
      showMessages: messages.slice(start, end).reverse(),
      showCount: newShowCount,
    })
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
      wx.showModal({
        title: '错误',
        content: '消息不能为空',
      })
      return
    }
    let that = this
    const ack_number = util.uuidv4()
    const data = {
      "type": "send_message",
      "to_user": parseInt(that.data.thatUserId),
      "message": msg,
      "ack_number": ack_number
    }
    const now = new Date()
    const newMsgContentItem = {
      id: ack_number,
      self: true,
      text: msg,
      time: util.formatTime2(`${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`),
      loading: true,
      fail: false,
    }
    getApp().globalData.sendMessages[ack_number] = {
      message: newMsgContentItem,
      thatUserInfo: {
        id: that.data.thatUserId,
        nickName: that.data.thatUser,
        avatarUrl: that.data.thatAvatarUrl,
      },
      timeoutFunc: () => {
        newMsgContentItem.loading = false
        newMsgContentItem.fail = true
        that.setMessages()
        wx.showModal({
          title: '错误',
          content: '网络异常，无法发送',
        })
      }
    }
    wx.sendSocketMessage({
      data: JSON.stringify(data),
      success: function (res) {
        let messages = that.data.messages
        let showMessages = that.data.showMessages
        messages.push(newMsgContentItem)
        showMessages.unshift(newMsgContentItem)
        that.setData({
          messages: messages,
          showMessages: showMessages,
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '错误',
          content: '网络异常，无法发送',
        })
      }
    })
  },

  setMessages: function () {
    const messages = this.data.messages
    const showMessages = this.data.showMessages
    this.setData({
      messages: messages,
      showMessages: showMessages,
    })
  },

  getHeaderWithToken: function () {
    let header = {
      'content-type': 'application/json',
    }
    if (getApp().globalData.token != null) {
      header.Authorization = `Token` + ' ' + `${getApp().globalData.token}`
    }
    return header
  },
})