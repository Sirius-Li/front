// custom-tab-bar/index.js
Component({
  /**
   * 组件的样式隔离
   */
  options: {
    styleIsolation: "shared"
  },

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    // 选中的 tab 
    messageCount: 0,
    notificationCount: 0,
    // 菜单列表
    list: [{
        "url": "/pages/activity/home/home", //地址
        "icon": "wap-home-o", //图标
        "info": '', //小红点
        "text": "首页"
      },
      {
        "url": "/pages/activity/category/category",
        "icon": "apps-o",
        "info": '',
        "text": "分类"
      },
      {
        "url": "/pages/release/releasing/releasing",
        "icon": "add-o",
        "info": '',
        "text": "发布"
      },
      {
        "url": "/pages/aboutme/message/message",
        "icon": "envelop-o",
        "info": '',
        "text": "消息"
      },
      {
        "url": "/pages/aboutme/aboutme",
        "icon": "user-o",
        "info": '',
        "text": "我的"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

    onChange(e) {
      console.log(e)
      this.setData({
        active: e.detail
      });
      
      wx.switchTab({
        url: this.data.list[e.detail].url
      });
    },

    
    init() {
      const that = this
      const page = getCurrentPages().pop();
      this.setData({
        active: this.data.list.findIndex(item => item.url === `/${page.route}`)
      });
      this.setNotificationCount(this)
      this.setMessageCount(this)

      getApp().watch('notificationCountFunc', 'tabbar', (value) => {
        if (value != that.data.notificationCount) {
          that.setNotificationCount(that)
        }
      })

      getApp().watch('messageCountFunc', 'tabbar', (value) => {
        if (value != that.data.messageCount) {
          that.setMessageCount(that)
        }
      })
    },

    setMessageCount: function (that) {
      that.setData({
        messageCount: getApp().globalData.messageCount
      })
    },

    setNotificationCount: function (that) {
      that.setData({
        notificationCount: getApp().globalData.notificationCount
      })
    }
  }

})
