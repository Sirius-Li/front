const BASE_URL = 'https://se.alangy.net'
Page({
  data: {
    content: ''
  },
  onLoad: function (options) {
    if(getApp().globalData.user_status === 2){
      wx.redirectTo({
        url: '../certification/certification',
      })
    }else if(getApp().globalData.user_status === 1){
      wx.switchTab({
        url: '../activity/home/home',
      })
      wx.showToast({
        title: '用户还在认证中',
        icon: 'error'
      })
    }
  },

  onTapSubmit(event) {
    const that = this
    const {content} = event.detail.value
    if (content.replace(/(^\s*)|(\s*$)/g, "").length === 0) {
      wx.showToast({
        title: '反馈不能为空',
        icon: 'error'
      })
      return
    }
    
    
    wx.request({
      url: `${BASE_URL}/api/feedbacks/user_create_feedback/`,
      method: 'POST',
      header: this.getHeaderWithToken(),
      data: {content},
      success(res) {
        if (res.statusCode === 201) {
          const data = res.data
          
          that.setData({
            content: ''
          })
          wx.showToast({
            title: '反馈已成功提交', 
            success () {
              setTimeout(() => {
                wx.navigateBack()
              }, 700)
            }
          })
        } else {
          
          wx.showToast({title: '请重试！'})
        }
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      }
    })
  },
  getHeaderWithToken() {
    let header = {
      'content-type': 'application/json',
    }
    if (getApp().globalData.token != null) {
      header.Authorization = `Token` + ' ' + `${getApp().globalData.token}`
    }
    return header
  },
})