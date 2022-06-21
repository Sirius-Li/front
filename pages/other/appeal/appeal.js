const BASE_URL = getApp().globalData.baseUrl
Page({
  data: {
    content: '',
    radio: null,
    appealOptions: [
      '发布话题权限',
      '发表评论权限',
      '发布委托权限',
      '接取委托权限'
    ],
    userAuthority: null,
    userId: null
  },

  onLoad: function (options) {
    const that = this
    if (getApp().globalData.user_status === 2) {
      wx.redirectTo({
        url: '../certification/certification',
      })
    } else if (getApp().globalData.user_status === 1) {
      wx.switchTab({
        url: '../activity/home/home',
      })
      wx.showToast({
        title: '用户还在认证中',
        icon: 'error'
      })
    } else {
      // wx.request({
      //   url: `${BASE_URL}/api/users/profile/`,
      //   method: 'GET',
      //   header: this.getHeaderWithToken(),
      //   success(res) {
      //     console.log(res.data)
      //     that.setData({
      //       userAuthority: res.data.authority,
      //       userId: res.data.id,
      //       content: '',
      //       radio: null
      //     })
      //   },
      //   fail(res) {
      //     getApp().globalData.util.netErrorToast()
      //   }
      // })
      wx.request({
        url: `${BASE_URL}/api/user_authority_self/`,
        method: "GET",
        header: this.getHeaderWithToken(),
        success(res) {
          console.log(res.data)
          that.setData({
            userAuthority: res.data.authority,
            userId: res.data.id,
            content: '',
            radio: null
          })
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
    }
  },

  onChange(event) {
    this.setData({
      radio: event.detail,
    })
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset
    this.setData({
      radio: name,
    })
  },

  onTapSubmit(event) {
    const that = this
    const content = event.detail.value.content
    const radio = event.detail.value.radio
    console.log(radio)
    if (content.replace(/(^\s*)|(\s*$)/g, "").length === 0) {
      wx.showModal({
        title: '提示',
        content: '申诉理由不能为空',
        showCancel: false
      })
      return
    } else if (radio == null) {
      wx.showModal({
        title: '提示',
        content: '请选择具体申诉权限',
        showCancel: false
      })
      return
    } else if (this.data.userAuthority[radio] == '1') {
      wx.showModal({
        title: '提示',
        content: '该权限未被取消，无需申诉',
        showCancel: false
      })
      return
    }


    wx.request({
      url: `${BASE_URL}/api/appeal/`,
      method: 'POST',
      header: this.getHeaderWithToken(),
      data: {
        id: parseInt(that.data.userId),
        authority: parseInt(radio),
        reason: content
      },
      success(res) {
        if (res.statusCode === 201) {
          const data = res.data

          that.setData({
            content: '',
            radio: null
          })
          wx.showToast({
            title: '申诉已成功提交',
            success() {
              setTimeout(() => {
                wx.navigateBack()
              }, 700)
            }
          })
        } else {
          wx.showToast({ title: '请重试！' })
        }
      },
      fail(res) {
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
  }
})