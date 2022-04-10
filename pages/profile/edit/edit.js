const util = require('../../../utils/util')
const BASE_URL = 'https://se.alangy.net'
Page({
  data: {
    show: {
      genderPopup: false,
    },
    genders: ['未知', '男', '女']
  },

  onLoad() {
    this.getInfo()
  },
  onChangeGender(event) {
    this.data.selectGender = event.detail.index
  },
  onChangeUsername(event) {
    this.data.username = event.detail
  },
  onChangeStudentId(event) {
    this.data.studentId = event.detail
  },
  onGenderConfirm() {
    this.applyGenderChange()
    this.hideGenderPopup()
  },
  toggle(type, show) {
    this.setData({
      [`show.${type}`]: show
    });
  },
  showGenderPopup() {
    this.toggle('genderPopup', true)
  },
  hideGenderPopup() {
    this.data.selectGender = this.data.gender
    this.toggle('genderPopup', false)
  },
  applyGenderChange: function () {
    this.setData({
        gender: this.data.selectGender
    })
  },
  getInfo() {
    const that = this
    const header = this.getHeaderWithToken()
    wx.request({
      url: `${BASE_URL}/api/users/profile/`,
      method: 'GET',
      header,
      success(res) {
        if (res.statusCode === 200) {
          const data = res.data
          that.setData({
            username: data.nickName,
            userAvatarUrl: data.avatarUrl,
            phone: data.phone,
            studentId: data.student_id,
            gender: data.gender,
            email: data.email
          })
          wx.setStorageSync('profile', data)
        } else {
        }
      },
      fail(res) {
        getApp().globalData.util.netErrorToast()
      }
    })
  },
  onTapSyncAvatar() {
    const that = this
    wx.getUserProfile({
      desc: '用于更新头像',
      success(res) {
        that.setData({
          userAvatarUrl: res.userInfo.avatarUrl,
        })
      },
      fail(res) {
        wx.showModal({
          title: '错误',
          content: '更新头像失败'
        })
      }
    })
  },
  onTapSubmit() {
    this.submitChange()
  },
  checkInput() {
    if (util.strIsEmpty(this.data.username)) {
      throw '用户名不能为空'
    } else if (this.data.username && this.data.username.length > 30) {
      throw '用户名过长'
    } else if (util.strIsEmpty(this.data.studentId)) {
      throw '学号不能为空'
    } else if (this.data.studentId && this.data.studentId.length > 15) {
      throw '学号非法'
    }
  },
  submitChange() {
    const that = this
    try {
      this.checkInput()
    }
    catch (err) {
      wx.showModal({
        title: '错误',
        content: err
      })
      return
    }
    wx.request({
      url: 'https://se.alangy.net/api/users/post_partial_update/',
      method: 'POST',
      data: {
        nickName: that.data.username,
        gender: that.data.gender,
        student_id: that.data.studentId,
        avatarUrl: that.data.userAvatarUrl,
      },
      header: that.getHeaderWithToken(),
      success(res) {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '修改成功',
            success () {
              setTimeout(() => {
                wx.navigateBack()
              }, 700)
            }
          })
        } else {
          wx.showModal({
            title: '错误',
            content: '请求失败，请检查网络设置'
          })
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