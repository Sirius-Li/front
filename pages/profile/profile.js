const BASE_URL = getApp().globalData.baseUrl
Page({
  data: {
    userId: null,
    fromMsg: null,
    liked: null,
    isMe: null,
    isVisitor: null,
    myId: null,
    username: null,
    userAvatarUrl: null,
    phone: null,
    studentId: null,
    gender: null,
    email: null,
    score_avg: null,
    commission_score_avg: null,
    releasedActivities: null,
    releasedCommissions: null,
    releasedTopics: null
  },

  onLoad(options) {
    console.log(options)
    let fromMsg = options.fromMsg
    if (fromMsg === undefined) {
      fromMsg = false
    }
    this.setData({
      userId: parseInt(options.id),
      fromMsg: fromMsg
    })
  },
  onShow() {
    this.getInfo()
  },
  onTapLikeButton() {
    if (getApp().globalData.user_status === 2) {
      wx.redirectTo({
        url: '../certification/certification',
      })
    } else if (getApp().globalData.user_status === 1) {
      wx.showModal({
        title: '拒绝访问',
        content: '您的账号还在认证中，无权进行此操作'
      })
    } else {
      this.toggleLike()
    }
  },
  onTapMsgButton() {
    if (getApp().globalData.user_status === 2) {
      wx.redirectTo({
        url: '../certification/certification',
      })
    } else if (getApp().globalData.user_status === 1) {
      wx.showModal({
        title: '拒绝访问',
        content: '您的账号还在认证中，无权进行此操作'
      })
    } else {
      const that = this
      if (this.data.fromMsg) {
        wx.redirectTo({
          url: './fakeMsg/fakeMsg?id=' + that.data.userId + '&name=' + that.data.username + '&avatarUrl=' + that.data.userAvatarUrl,
        })
      } else {
        wx.navigateTo({
          url: './fakeMsg/fakeMsg?id=' + that.data.userId + '&name=' + that.data.username + '&avatarUrl=' + that.data.userAvatarUrl,
        })
      }
    }
  },
  onTapEditButton() {
    wx.navigateTo({
      url: './edit/edit',
    })
  },
  onTapActivity(e) {
    const id = e.currentTarget.dataset.activityid
    wx.navigateTo({
      url: `/pages/actList/activity/activity?id=${id}`,
    })
  },
  onTapTopic(e){
    const id = e.currentTarget.dataset.topicid
    wx.navigateTo({
      url: `/pages/htdetail/htdetail?id=${id}`,
    })
  },

  toggleLike() {
    const that = this

    wx.request({
      url: `${BASE_URL}/api/followees`,
      method: this.data.liked ? 'DELETE' : 'POST',
      header: this.getHeaderWithToken(),
      data: {
        follow_user: that.data.userId
      },
      success(res) {
        if (!that.data.liked && res.statusCode === 201
          || that.data.liked && res.statusCode === 204) {
          that.setData({
            liked: !that.data.liked
          })

        } else {

        }
      },
      fail(res) {
        getApp().globalData.util.netErrorToast()
      }
    })
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
          //console.log(data)
          if (data.id === that.data.userId) {
            that.setData({
              isMe: true,
              isVisitor: false,
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
              isVisitor: false,
              myId: data.id,
            })
            that.getAnotherInfo()
          }
        } else {
          that.setData({
            isMe: false,
            isVisitor: true,
          })
          that.getAnotherInfo()
        }
      },
      fail(res) {
        getApp().globalData.util.netErrorToast()
      }
    })
  },
  getAnotherInfo() {
    const that = this
    const header = this.getHeaderWithToken()
    wx.request({
      url: `${BASE_URL}/api/users/${that.data.userId}/info/`,
      method: 'GET',
      header,
      success(res) {
        if (res.statusCode === 200) {
          const data = res.data
          console.log(data)
          that.setData({
            username: data.nickName,
            userAvatarUrl: data.avatarUrl,
            gender: data.gender,
            liked: data.is_followed,
            score_avg: data.average_rate.remark__avg || '暂无评分',
          })
          that.getReleasedActivities()
          that.getReleasedCommissions()
          that.getReleasedTopics()
        } else {
        }
      },
      fail(res) {
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  getReleasedActivities() {
    const that = this
    const header = this.getHeaderWithToken()
    wx.request({
      url: `${BASE_URL}/api/user_create_activities/${that.data.userId}/`,
      method: 'GET',
      header,
      success(res) {
        if (res.statusCode === 200) {
          const data = res.data
          that.setData({
            releasedActivities: that.parseReceivedReleasedActivities(data)
          })
        } else {

        }
      },
      fail(res) {
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  getReleasedCommissions(){
    const that = this
    const header = this.getHeaderWithToken()
    wx.request({
      url: `${BASE_URL}/api/user_create_commissions/${that.data.userId}/`, //todo
      method: 'GET',
      header,
      success(res) {
        if (res.statusCode === 200) {
          const data = res.data
          console.log(data)
          that.setData({
            
          })
        } else {
        }
      },
      fail(res) {
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  getReleasedTopics(){
    const that = this
    const header = this.getHeaderWithToken()
    wx.request({
      url: `${BASE_URL}/api/user_create_topic/${that.data.userId}/`,
      method: 'GET',
      header,
      success(res) {
        if (res.statusCode === 200) {
          const data = res.data
          //console.log(data)
          that.setData({
            releasedTopics: that.parseReceivedReleasedTopics(data)
          })
        } else {
        }
      },
      fail(res) {
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  parseReceivedReleasedActivities(data) {
    let activities = []
    for (const item of data) {
      activities.push({
        id: item.id,
        name: item.name,
        detail: item.normal_activity.description || '暂无详情',
        imageUrl: item.photo ? `${BASE_URL}${item.photo}` : '/static/img/nophoto.jpg',
      })
    }

    return activities
  },

  parseReceivedReleasedCommissions(data){

  },

  parseReceivedReleasedTopics(data){
    let topics = []
    console.log(data)
    for(const item of data){
      topics.push({
        id:item.id,
        name:item.name,
        description:item.description,
        imageUrl:item.photo ? `${BASE_URL}${item.photo}` : '/static/img/nophoto.jpg'
      })
    }
    return topics
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