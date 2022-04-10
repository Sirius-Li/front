const BASE_URL = 'https://se.alangy.net'

Page({
  data: {},
  onShow() {
    this.getFollower()
    this.getFollowee()
  },
  onTapUser(event) {
    const {userid} = event.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/profile/profile?id=${userid}`,
    })
  },
  onTapUserCancelFollow(event) {
    const {userid} = event.currentTarget.dataset
    this.unfollow(userid)
  },

  getInfo() {
    const that = this
    const header = this.getHeaderWithToken()
    wx.request({
      url: `${BASE_URL}/api/users/profile/`,
      method: 'GET',
      header: header,
      success(res) {
        if (res.statusCode === 200) {
          const data = res.data
          if (data.id === that.data.userId) {
            that.setData({
              isMe: true,
              myId: data.id,
              username: data.nickName,
              userAvatarUrl: data.avatarUrl,
              phone: data.phone,
              studentId: data.student_id,
              gender: data.gender,
              email: data.email
            })
            wx.setStorageSync('profile', data)
          } else {
            that.setData({
              isMe: false,
              myId: data.id,
            })
            that.getAnotherInfo()
          }
        } else {
          
        }
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      }
    })
  },
  getFollowee() {
    const that = this
    const header = this.getHeaderWithToken()
    wx.request({
      url: `${BASE_URL}/api/followees`,
      method: 'GET',
      header: header,
      success(res) {
        if (res.statusCode === 200) {
          const data = res.data
          
          const followees = []
          for (const item of data) {
            followees.push({
              id: item.id,
              username: item.nickName,
              avatarUrl: item.avatarUrl,
            })
          }
          
          that.setData({followees})
        } else {
          
        }
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      }
    })
  },
  getFollower() {
    const that = this
    const header = this.getHeaderWithToken()
    wx.request({
      url: `${BASE_URL}/api/followers`,
      method: 'GET',
      header: header,
      success(res) {
        if (res.statusCode === 200) {
          const data = res.data
          const followers = []
          for (const item of data) {
            
            followers.push({
              id: item.id,
              username: item.nickName,
              avatarUrl: item.avatarUrl,
            })
          }
          
          that.setData({followers})
        } else {
          
        }
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      }
    })
  },
  unfollow(follow_user) {
    const that = this
    
    wx.request({
      url: `${BASE_URL}/api/followees`,
      method: 'DELETE',
      header: this.getHeaderWithToken(),
      data: {follow_user},
      success(res) {
        if (res.statusCode === 204) {
          const data = res.data
          
          that.getFollowee()
        } else {
          
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