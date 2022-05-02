import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
const util = require('../../utils/util')
Page({

  data: {
    id: null,
    list:[],
    str: '',
    is_like: null,
    is_follow: null,
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
    let temp_list_attend = []
    let temp_list_create = []
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
        console.log(res.data)
        self.setData({
          ht: res.data
        })
        let tempList = []
        for(let i = 0; i<= res.data.comment.length; i++){
          tempList.push(false)
        }
        self.setData({
          commentShow: tempList
        })
        wx.request({
          url: app.globalData.baseUrl + "/api/topic_like_users_self/",
          header: head,
          method: "GET",
          data: {
          },
          success(res) {
            let llike = false
            for (let i = 0; i < res.data.length; i++) {
              if (this.data.id == res.data[i].id) {
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
              if (this.data.id == res.data[i].id) {
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
        url: '../../certification/certification',
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
          url: 'https://se.alangy.net/api/comment/', //接口名称   
          header: head,
          method: "POST",  //请求方式    
          data: {
            activity_id: this.data.activity.id,
            at_user_id: 1,
            comment: self.data.str
          },
          success(res) {
            self.data.list = res.data
            wx.showToast({
              title: '评论成功',
            })
            self.reset()
            self.getDetail()
            self.setData({
              hide: 1
            })
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
        url: '../../certification/certification',
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
        wx.request({
          url: 'https://se.alangy.net/api/comment/', //接口名称   
          header: head,
          method: "POST",  //请求方式    
          data: {
            activity_id: this.data.activity.id,
            at_user_id: userid,
            comment: this.data.str
          },
          success(res) {
            self.data.list = res.data
            wx.showToast({
              title: '回复成功',
            })
            self.reset()
            self.getDetail()
            self.setData({
              hide: 1
            })
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
      console.log(this.data.commentShow)
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
      url: '../../profile/profile?id=' + userid,
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
          url: getApp().globalData.baseUrl + `/api/comment/${commentId}/`,
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