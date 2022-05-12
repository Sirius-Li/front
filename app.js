// app.js
const util = require('./utils/util.js')

App({
  
  onLaunch() {
    let that = this
    this.myDefineProperty('messageCount', '_messageCount', 'messageCountFunc')
    this.myDefineProperty('notificationCount', '_notificationCount', 'notificationCountFunc')
    this.myDefineProperty('new_message', '_new_message', 'new_message_func')
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    const messages = wx.getStorageSync('messages') || {
      unread_count: 0
    }
    this.globalData._messageCount = messages['unread_count']
    wx.setStorageSync('messages', messages)

    const messagesId = wx.getStorageSync('messagesId') || []
    wx.setStorageSync('messagesId', messagesId)

    this.myLogin()
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },

  myLogin: function () {
    let self = this
    let that = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            url: getApp().globalData.baseUrl + '/api/auth/',
            method: 'POST',
            data: {
              code: res.code
            },
            success (res) {
              self.reLogin.reset()
              if (res.statusCode == 200) {
                getApp().globalData.token = res.data.token
                getApp().globalData.authenticate = true
                getApp().globalData.logined = true
                getApp().globalData.user_status = res.data.errcode
                //getApp().globalData.user_status = 1
                that.linkSocket()
                that.getNotificationCount()
                if (self.loginedCallback){
                  self.loginedCallback(getApp().globalData.logined);
                }
                wx.request({
                  url: getApp().globalData.baseUrl + '/api/users/profile/',
                  method: 'GET',
                  header: that.getHeaderWithToken(),
                  success(res) {
                    if (res.statusCode === 200) {
                      const data = res.data
                      wx.setStorageSync('profile', data)
                      getApp().globalData.myUserId = data.id
                    } else {}
                  },
                  fail(res){
                    getApp().globalData.util.netErrorToast()
                  }
                })
              } else {
                getApp().globalData.logined = true
                getApp().globalData.user_status = 2
                if (self.loginedCallback){
                  self.loginedCallback(getApp().globalData.logined);
                }
              }
              //getApp().globalData.user_status = 2
            },
            fail (res) {
              console.log(res)
              self.reLogin.reset().start()
            }
          })
        }
      },
      fail: res => {
        self.reLogin.reset().start()
      }
    })
  },

  heartCheck: {
    timeout: 5000, 
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function () {
      clearTimeout(this.timeoutObj);
      clearTimeout(this.serverTimeoutObj);
      return this;
    },
    start: function () {
      this.timeoutObj = setTimeout(()=> {
        wx.sendSocketMessage({
          data: JSON.stringify({
            "type": 'ping'
          }),
          success() {
          },
          fail(res) {
          }
        });
        this.serverTimeoutObj = setTimeout(() =>{
          // console.log('心跳机制关闭连接')
          wx.closeSocket(); 
        }, this.timeout);
      }, this.timeout);
    }
  },

  reconnect: {
    timeout: 5000,
    timeoutObj: null,
    reset: function () {
      clearTimeout(this.timeoutObj)
      return this
    },
    start: function () {
      
      this.timeoutObj = setTimeout(() => {
        // console.log('试图重连')
        getApp().linkSocket()
      }, this.timeout)
    }
  },

  reLogin: {
    timeout: 5000,
    timeoutObj: null,
    reset: function() {
      clearTimeout(this.timeoutObj)
      return this
    },
    start: function () {
      
      this.timeoutObj = setTimeout(() => {
        getApp().myLogin()
      }, this.timeout)
    }
  },

  myDefineProperty(name, valueName, funcName) {
    var obj = this.globalData
    Object.defineProperty(obj, name, {//“data”对应上面globalData中的data
      configurable: true,
      enumerable: true,
      set: function (value) {//动态赋值，value为上面globalData中的data
        this[valueName] = value
        let func = this[funcName]
        for (let k in func) {
          func[k](value)
        }
      },
      get: function () {//获取全局变量，直接返回全部
        return this[valueName]
      }
    })
  },

  linkSocket() {
    const that = this
    // console.log('试图打开连接')
    if (that.globalData.authenticate == true) {
      const token = that.globalData.token
      that.globalData['socketTask'] = wx.connectSocket({
        url: 'ws://114.116.215.100:443/talk_message/' + token + '/',
        header:{
          'content-type': 'application/json'
        },
        success: function() {
          that.initEventHandle()
          that.reconnect.reset()
        },
        fail: function() {
          
        }
      })
    }
  },

  initEventHandle() {
    const that = this
    wx.onSocketOpen((result) => {
      // console.log('打开连接')
      this.receiveMessage()
      this.heartCheck.reset().start()
    })

    wx.onSocketClose((result) => {
      // console.log('关闭连接')
      for (let k in that.globalData.sendMessages) {
        let v = that.globalData.sendMessages[k]
        delete that.globalData.sendMessages[k]
        v.timeoutFunc()
      }
      
      that.reconnect.reset().start()
    })

    wx.onSocketError((result) => {
      
      // that.reconnect.reset().start()
    })

    wx.onSocketMessage((result) => {
      // console.log(result)
      if (result.data === "newdata") {
        this.receiveMessage()
      } else if (result.data === "pong") {
        this.heartCheck.reset().start()
      } else {
        if (result.data[1] == '"') {
          let data = JSON.parse(result.data)
          this.globalData.watchBackFunc['chatBotReceive'](data.robot)
        } else {
          let ack_number = result.data.slice(1, -1).split(':')[1]
          let sendMessageInfo = this.globalData.sendMessages[ack_number]
          delete this.globalData.sendMessages[ack_number]
          
          sendMessageInfo.timeoutFunc = () => {}
          sendMessageInfo.message.loading = false
          sendMessageInfo.message.fail = false
          this.globalData.watchBackFunc['ackSendMessage']()
  
          if (this.addMessageId(ack_number)) {
            const messages = wx.getStorageSync('messages')
            let from_user_messages = messages[sendMessageInfo.thatUserInfo.id] || {
              ...(sendMessageInfo.thatUserInfo),
              unread_count: 0,
              message_data: []
            }
            from_user_messages.message_data.push({
              id: ack_number,
              self: sendMessageInfo.message.self,
              text: sendMessageInfo.message.text,
              time: sendMessageInfo.message.time,
            })
            messages[sendMessageInfo.thatUserInfo.id] = from_user_messages
            wx.setStorageSync('messages', messages)
          }
        }
      }
    })
  },

  receiveMessage() {
    const header = this.getHeaderWithToken()
    const that = this
    wx.request({
      url: getApp().globalData.baseUrl + '/api/mymessage/',
      method: 'GET',
      header: header,
      success: function(res) {
        
        const data = res.data
        let messages = wx.getStorageSync('messages')
        for (let i = 0; i < data.length; i++) {
          if (that.addMessageId(data[i].id)) {
            const sendData = {
              "type": "ack_receive",
              "message_id": data[i].id
            }
            wx.sendSocketMessage({
              data: JSON.stringify(sendData),
              success: function() {
                let from_user_messages = messages[data[i].from_user.id] || {
                  id: data[i].from_user.id,
                  nickName: data[i].from_user.nickName,
                  avatarUrl: data[i].from_user.avatarUrl,
                  unread_count: 0,
                  message_data: []
                }
                from_user_messages.message_data.push({
                  id: data[i].id,
                  text: data[i].content,
                  time: data[i].created_time,
                  self: false
                })
                from_user_messages.unread_count += 1
                messages[data[i].from_user.id] = from_user_messages
                wx.setStorageSync('messages', messages)
              }
            })
          }
        }
        messages.unread_count += data.length
        wx.setStorageSync('messages', messages)
        if (data.length > 0) {
          that.globalData.new_message = true
          that.globalData.messageCount += data.length
        }
      },
      fail: function(res) {
        
        that.globalData.new_message = false
        that.globalData.messageCount = 0
      }
    })
  },

  //判断消息的id是否已存在，如果不存在就push
  addMessageId(id) {
    const messagesId = wx.getStorageSync('messagesId')
    if (messagesId.indexOf(id) < 0) {
      messagesId.push(id)
      wx.setStorageSync('messagesId', messagesId)
      return true
    } else {
      return false
    }
  },

  onShow() {
    this.linkSocket()
  },

  onHide() {
    // console.log('onHide')
    this.heartCheck.reset()
    this.reconnect.reset()
    wx.onSocketClose((result) => {
      // console.log('新的关闭')
    })
    wx.closeSocket()
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

  watch: function (listName, methodName, method) {
    getApp().globalData[listName][methodName] = method
  },

  unWatch: function (listName, methodName) {
    getApp().globalData[listName][methodName] = () => {}
  },

  globalWatch: function (methodName, method) {
    getApp().globalData.watchBackFunc[methodName] = method
  },

  globalUnWatch: function (methodName) {
    getApp().globalData.watchBackFunc[methodName] = () => {}
  },

  getNotificationCount: function () {
    const that = this
    if (getApp().globalData.token != null) {
      const header = {
        'content-type': 'application/json',
        'Authorization': `Token` + ' ' + `${getApp().globalData.token}`
      }
      wx.request({
        url: getApp().globalData.baseUrl + '/api/users/profile/',
        method: 'GET',
        header: header,
        success(res) {
          if (res.statusCode === 200) {
            that.globalData.notificationCount = res.data.unread_message_count
          } else {
            
          }
        },
        fail(res) {
          
        }
      })
    }
  },

  globalData: {
    baseUrl: 'http://114.116.215.100:443',
    userInfo: null,
    token: null,
    authenticate: false,
    logined: false,
    user_status: null,

    _notificationCount: 0,
    notificationCountFunc: {},
    _messageCount: 0,
    messageCountFunc: {},
    _new_message: false,
    new_message_func: {},

    sendMessages: {},
    watchBackFunc: {},
    
    attend_users:[],
    util: require('./utils/util.js')
  }
})
