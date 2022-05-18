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
    releasedTopics: null,
    showDialog: null,
    tipChosenOption: null,
    tipAllOptions: null,
    tipReason: null
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
    this.setData({
      showDialog: false,
      tipChosenOption: null,
      tipAllOptions: [
        "发布不合适的话题",
        "发表恶意评论",
        "对接取委托的用户恶意评分",
        "恶意接取委托"
      ],
      tipReason: ''
    })
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
  onCheckboxChange(event) {
    this.setData({
      tipChosenOption: event.detail
    })
  },
  toggle(event) {
    const { name } = event.currentTarget.dataset
    this.setData({
      tipChosenOption: name
    })
  },
  onTapTipButton() {
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
      this.setData({
        showDialog: true
      })
    }
  },
  closeDialog() {
    this.setData({
      showDialog: false,
      tipChosenOption: null,
      tipReason: ''
    })
  },
  informUser() {
    let app = getApp()
    const that = this
    if (this.data.tipChosenOption == null) {
      wx.showModal({
        title: '提示',
        content: '请选择举报类别',
        showCancel: false
      })
    } else if (this.data.tipReason == null || this.data.tipReason.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请填写详细信息',
        showCancel: false
      })
    } else {
      wx.request({
        url: `${BASE_URL}/api/inform/`,
        method: 'POST',
        header: this.getHeaderWithToken(),
        data: {
          id: that.data.myId,
          to_user_id: that.data.userId,
          authority: parseInt(that.data.tipChosenOption),
          reason: that.data.tipReason
        },
        success(res) {
          console.log(res)
          if (res.statusCode == 201) {
            wx.showToast({
              title: '举报成功',
            })
          }
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
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
  onTapTopic(e) {
    const id = e.currentTarget.dataset.topicid
    wx.navigateTo({
      url: `/pages/htdetail/htdetail?id=${id}`,
    })
  },
  onTapCommission(e) {
    const id = e.currentTarget.dataset.commissionid
    //console.log(id)
    wx.navigateTo({
      url: `/pages/commission/commission?id=${id}`,
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
          console.log(data)
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
            commission_score_avg: data.average_rate.score__avg || '暂无评分'
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

  getReleasedCommissions() {
    const that = this
    const header = this.getHeaderWithToken()
    wx.request({
      url: `${BASE_URL}/api/user_create_commissions/${that.data.userId}/`,
      method: 'GET',
      header,
      success(res) {
        if (res.statusCode === 200) {
          const data = res.data
          console.log(data)
          that.setData({
            releasedCommissions: that.parseReceivedReleasedCommissions(data)
          })
        } else {
        }
      },
      fail(res) {
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  getReleasedTopics() {
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

  parseReceivedReleasedCommissions(data) {
    let commissions = []
    for (const item of data) {
      commissions.push({
        id: item.id,
        name: item.name,
        realTime: item.real_time,
        description: item.description
      })
    }
    return commissions
  },

  parseReceivedReleasedTopics(data) {
    let topics = []
    //console.log(data)
    for (const item of data) {
      topics.push({
        id: item.id,
        name: item.name,
        description: item.description,
        imageUrl: item.photo ? `${BASE_URL}${item.photo}` : '/static/img/nophoto.jpg'
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