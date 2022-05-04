import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
const util = require('../../utils/util')
Page({

  data: {
    id: null,
    list: [],
    str: '',
    is_like: null,
    is_follow: null,
    is_like_comment: [],
    user_status: null,
    commentShow: [],
    ht: null,
    myUserId: null
  },

  onLoad(options) {
    this.setData({
      id: options.id,
      myUserId: getApp().globalData.myUserId
    })
  },

  getDetail: function () {
    let app = getApp()
    let head = {}
    if (app.globalData.token == null) {
      head = {
        'content-type': 'application/json'
      }
    } else {
      head = {
        'content-type': 'application/json',
        'Authorization': 'Token ' + app.globalData.token
      }
    }
    let self = this
    wx.request({
      url: app.globalData.baseUrl + "/api/topic/" + self.data.id + "/",
      header: head,
      method: "GET",  //请求方式    
      data: {
      },
      success(res) {
        //console.log(res.data)
        self.setData({
          ht: res.data
        })
        let tempList = []
        for (let i = 0; i <= res.data.comment.length; i++) {
          tempList.push(false)
        }
        self.setData({
          commentShow: tempList
        })
        let templst = []
        let tmplst = []
        wx.request({
          url: app.globalData.baseUrl + "/api/topic_comment_like_users_self/",
          header: head,
          method: "GET",
          data: {
          },
          success(res) {
            //console.log(res.data[0].topic_comment.id)
            for (let i = 0; i < res.data.length; i++) {
              templst.push(res.data[i].topic_comment.id)
            }
            //console.log(templst)
            for (let i = 0; i < self.data.ht.comment.length; i++) {
              //console.log(self.data.ht.comment[i].id)
              if (templst.includes(self.data.ht.comment[i].id)) {
                tmplst.push(true)
              } else {
                tmplst.push(false)
              }
            }
            //console.log(tmplst)
            self.setData({
              is_like_comment: tmplst
            })
          },
          fail(res) {
            getApp().globalData.util.netErrorToast()
          }
        })
        //console.log(self.data.is_like_comment)
        wx.request({
          url: app.globalData.baseUrl + "/api/topic_like_users_self/",
          header: head,
          method: "GET",
          data: {
          },
          success(res) {
            let llike = false
            for (let i = 0; i < res.data.length; i++) {
              if (self.data.id == res.data[i].topic.id) {
                llike = true
              }
            }
            if (llike) {
              self.setData({
                is_like: true
              })
            } else {
              self.setData({
                is_like: false
              })
            }
          },
          fail(res) {
            getApp().globalData.util.netErrorToast()
          }
        })
        wx.request({
          url: app.globalData.baseUrl + "/api/topic_follow_users_self/",
          header: head,
          method: "GET",
          data: {
          },
          success(res) {
            let ffollow = false
            for (let i = 0; i < res.data.length; i++) {
              //console.log(res.data[i].id)
              if (self.data.id == res.data[i].topic.id) {
                ffollow = true
              }
            }
            if (ffollow) {
              self.setData({
                is_follow: true
              })
            } else {
              self.setData({
                is_follow: false
              })
            }
            //console.log("isfollow:"+self.data.is_follow)
          },
          fail(res) {
            getApp().globalData.util.netErrorToast()
          }
        })
      },
      fail(res) {
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  followTopic: function () {
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
      let app = getApp()
      let head = {}
      let self = this
      if (app.globalData.token == null) {
        head = {
          'content-type': 'application/json'
        }
      } else {
        head = {
          'content-type': 'application/json',
          'Authorization': 'Token ' + app.globalData.token
        }
      }
      wx.request({
        url: app.globalData.baseUrl + "/api/topic_follow/",
        header: head,
        method: "POST",
        data: {
          topic_id: self.data.id
        },
        success(res) {
          self.setData({
            is_follow: true
          })
          wx.showToast({
            title: '关注成功'
          })
          self.getDetail()
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
    }
  },
  unfollowTopic: function () {
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
      let app = getApp()
      let head = {}
      let self = this
      if (app.globalData.token == null) {
        head = {
          'content-type': 'application/json'
        }
      } else {
        head = {
          'content-type': 'application/json',
          'Authorization': 'Token ' + app.globalData.token
        }
      }
      console.log(head)
      wx.request({
        url: app.globalData.baseUrl + "/api/topic_follows/" + self.data.id + "/",
        header: head,
        method: "DELETE",
        data: {
        },
        success(res) {
          self.setData({
            is_follow: false
          })
          wx.showToast({
            title: '取消关注成功'
          })
          self.getDetail()
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
    }
  },
  likeTopic: function () {
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
      let app = getApp()
      let head = {}
      let self = this
      if (app.globalData.token == null) {
        head = {
          'content-type': 'application/json'
        }
      } else {
        head = {
          'content-type': 'application/json',
          'Authorization': 'Token ' + app.globalData.token
        }
      }
      wx.request({
        url: app.globalData.baseUrl + "/api/topic_like/",
        header: head,
        method: "POST",
        data: {
          topic_id: self.data.id
        },
        success(res) {
          self.setData({
            is_like: true
          })
          wx.showToast({
            title: '点赞成功'
          })
          self.getDetail()
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
    }
  },
  unlikeTopic: function () {
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
      let app = getApp()
      let head = {}
      let self = this
      if (app.globalData.token == null) {
        head = {
          'content-type': 'application/json'
        }
      } else {
        head = {
          'content-type': 'application/json',
          'Authorization': 'Token ' + app.globalData.token
        }
      }
      wx.request({
        url: app.globalData.baseUrl + "/api/topic_like/" + self.data.id + "/",
        header: head,
        method: "DELETE",
        success(res) {
          self.setData({
            is_like: false
          })
          self.getDetail()
          wx.showToast({
            title: '取消点赞成功'
          })
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
    }
  },
  likeComment(event) {
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
      let commentId = event.currentTarget.dataset.commentid
      let app = getApp()
      let head = {}
      let self = this
      if (app.globalData.token == null) {
        head = {
          'content-type': 'application/json'
        }
      } else {
        head = {
          'content-type': 'application/json',
          'Authorization': 'Token ' + app.globalData.token
        }
      }
      wx.request({
        url: app.globalData.baseUrl + "/api/topic_comment_like/",
        header: head,
        method: "POST",
        data: {
          topic_comment_id: commentId
        },
        success(res) {
          wx.showToast({
            title: '点赞评论成功'
          })
          self.getDetail()
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
    }
  },

  unlikeComment: function (event) {
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
      let commentId = event.currentTarget.dataset.commentid
      let app = getApp()
      let head = {}
      let self = this
      if (app.globalData.token == null) {
        head = {
          'content-type': 'application/json'
        }
      } else {
        head = {
          'content-type': 'application/json',
          'Authorization': 'Token ' + app.globalData.token
        }
      }
      wx.request({
        url: app.globalData.baseUrl + "/api/topic_comment_like/" + commentId + "/",
        header: head,
        method: "DELETE",
        data: {
        },
        success(res) {
          self.getDetail()
          wx.showToast({
            title: '取消点赞成功'
          })
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      user_status: getApp().globalData.user_status
    })
    this.getDetail()
  },

  // 储存评论
  setValue: function (e) {
    this.setData({
      str: e.detail.value
    })
  },

  reset: function () {
    this.setData({
      str: null
    })
  },

  submitCom: function () {
    if (getApp().globalData.user_status == 2) {
      wx.navigateTo({
        url: '../certification/certification',
      })
    } else if (getApp().globalData.user_status == 1) {
      wx.showToast({
        title: '用户还在认证中',
        icon: 'error'
      })
    } else {
      let app = getApp()
      let head = {}

      if (app.globalData.token == null) {
        head = {
          'content-type': 'application/json'
        }
      } else {
        head = {
          'content-type': 'application/json',
          'Authorization': 'Token ' + app.globalData.token
        }
      }
      if (this.data.str.length == 0 || util.strIsEmpty(this.data.str)) {
        wx.showModal({
          title: '提示',
          content: '评论不能为空',
          showCancel: false
        })
      } else {
        self = this
        wx.request({
          url: app.globalData.baseUrl + "/api/topic_comment/", //接口名称   
          header: head,
          method: "POST",  //请求方式    
          data: {
            //to_user_id:null,
            topic_id: this.data.id,
            comment_content: self.data.str
          },
          success(res) {
            wx.showToast({
              title: '评论成功'
            })
            self.reset()
            self.getDetail()
          },
          fail(res) {
            getApp().globalData.util.netErrorToast()
          }
        })
      }
    }
  },
  resubmitCom: function (event) {
    let userid = event.currentTarget.dataset.userid
    if (getApp().globalData.user_status == 2) {
      wx.navigateTo({
        url: '../certification/certification',
      })
    } else if (getApp().globalData.user_status == 1) {
      wx.showToast({
        title: '用户还在认证中',
        icon: 'error'
      })
    } else {
      let app = getApp()
      let head = {}
      if (app.globalData.token == null) {
        head = {
          'content-type': 'application/json'
        }
      } else {
        head = {
          'content-type': 'application/json',
          'Authorization': 'Token ' + app.globalData.token
        }
      }
      let self = this
      if (this.data.str.length == 0 || util.strIsEmpty(this.data.str)) {
        this.reset()
        wx.showModal({
          title: '提示',
          content: '评论不能为空',
          showCancel: false
        })
      } else {
        console.log(userid)
        console.log(self.data.id)
        wx.request({
          url: getApp().globalData.baseUrl + "/api/topic_comment/", //接口名称   
          header: head,
          method: "POST",  //请求方式    
          data: {
            to_user_id: userid,
            topic_id: self.data.id,
            comment_content: self.data.str
          },
          success(res) {
            wx.showToast({
              title: '回复成功',
            })
            self.reset()
            self.getDetail()
          },
          fail(res) {
            getApp().globalData.util.netErrorToast()
          }
        })
      }
    }
  },



  showModal(e) {
    if (getApp().globalData.user_status == 2) {
      wx.navigateTo({
        url: '../certification/certification',
      })
    } else if (getApp().globalData.user_status == 1) {
      wx.showToast({
        title: '用户还在认证中',
        icon: 'error'
      })
    } else {
      let index = e.currentTarget.dataset.index
      let tempList = []
      for (let i = 0; i <= this.data.commentShow.length; i++) {
        tempList.push(false)
      }
      tempList[index + 1] = true
      this.setData({
        commentShow: tempList
      })
    }
  },
  hideModal(e) {
    let index = e.currentTarget.dataset.index
    let tempList = this.data.commentShow
    tempList[index + 1] = false
    this.setData({
      commentShow: tempList
    })
    this.reset()
  },


  gotoUserPage(event) {
    //跳转到个人主页
    let userid = event.currentTarget.dataset.userid

    wx.navigateTo({
      url: '../profile/profile?id=' + userid,
    })
  },


  view(event) {
    let url = event.currentTarget.dataset.url
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  },

  deleteComment(event) {
    const that = this
    let commentId = event.currentTarget.dataset.commentid
    let userId = event.currentTarget.dataset.userid
    if (userId === this.data.myUserId) {
      Dialog.confirm({
        message: '您是否要删除这条评论？'
      }).then(() => {
        wx.request({
          url: getApp().globalData.baseUrl + `/api/topic_comment/${commentId}/`,
          method: 'DELETE',
          header: getApp().getHeaderWithToken(),
          success(res) {
            that.getDetail()
            wx.showToast({
              title: '删除成功',
            })
          },
          fail(res) {
            getApp().globalData.util.netErrorToast()
          }
        })
      }).catch(() => { })
    } else {
      wx.showModal({
        title: '错误',
        content: '您没有删除该评论的权限',
        showCancel: false
      })
    }
  }
})