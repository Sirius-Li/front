// pages/commission/commission.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //用户id
    myUserId: '',
    // 委托id
    id: '',
    // 委托类型
    commission_type: '',
    //委托名称
    name: '',
    start_time: '',
    end_time: '',
    create_time: '',
    updated_at: '',
    //实时性
    real_time: '',
    // 用户id
    user_id: '',
    //位置
    location: '1',
    //发布用户
    user: {},
    //申请用户
    accepted_user: {},
    //状态
    status: 0,
    //详细描述
    description: "",
    //审核状态
    audit: '',
    //费用
    fee: null,
    //评分
    score: 5,
    //评论
    comment: [],

    //一些控制变量
    commentWtShow: false,
    evaluateShow: false,
    myCommentShow: false,
    commentUser: {
      id: null,
      nickName: null,
    },
    comment_id: null,
    commentStr: null,
  },

  CatchCommmission() {
    //TODO
    //接取委托
    let head
    if (getApp().globalData.token == null) {
      head = {
        'content-type': 'application/json'
      }
    } else {
      head = {
        'content-type': 'application/json',
        'Authorization': 'Token ' + getApp().globalData.token
      }
    }
    wx.showModal({
      title: '确认',
      content: '确认接取委托',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.baseUrl + '/api/commission/apply/',
            header: head,
            method: "POST",  //请求方式    
            data: {
              commission_id: this.data.id,
            },
            success: (res) => {
              console.log(res)
              if (res.statusCode === 200) {
                wx.showToast({
                  title: '接取成功',
                })
                this.onShow()
              } else if (res.statusCode === 403) {
                wx.showModal({
                  title: res.data + '。是否跳转至权限申诉界面？',
                  success(res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '/pages/other/appeal/appeal',
                      })
                    }
                  }
                })
              } else if (res.statusCode === 400) {
                if (res.data === '') {
                  wx.showToast({
                    title: '接取失败',
                    icon: 'error'
                  })
                } else {
                  wx.showModal({
                    content: res.data,
                    showCancel: false
                  })
                }
              } else {
                wx.showToast({
                  title: '接取失败',
                  icon: 'error'
                })
              }
            },
            fail(res) {
              getApp().globalData.util.netErrorToast()
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  JumpTpAcceptedUser() {
    let userId = this.data.accepted_user.id
    wx.navigateTo({
      url: '../profile/profile?id=' + userId,
    })
  },

  TerminateCommission() {
    //TODO
    //删除委托
    let commission_id = this.data.id
    let head
    if (getApp().globalData.token == null) {
      head = {
        'content-type': 'application/json'
      }
    } else {
      head = {
        'content-type': 'application/json',
        'Authorization': 'Token ' + getApp().globalData.token
      }
    }
    wx.showModal({
      title: '警告',
      content: '确认终止委托',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.baseUrl + '/api/commission/terminate/',
            header: head,
            method: "POST",  //请求方式    
            data: {
              'commission_id': commission_id,
            },
            success: (res) => {
              wx.showToast({
                title: '终止成功',
              })
              this.onShow()
            },
            fail(res) {
              getApp().globalData.util.netErrorToast()
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  DelCommissiion() {
    //TODO
    //删除委托
    let commission_id = this.data.id
    let head
    if (getApp().globalData.token == null) {
      head = {
        'content-type': 'application/json'
      }
    } else {
      head = {
        'content-type': 'application/json',
        'Authorization': 'Token ' + getApp().globalData.token
      }
    }
    wx.showModal({
      title: '警告',
      content: '确认删除委托',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            // url: getApp().globalData.baseUrl + '/api/commission/check/'+this.data.id+'/',
            url: getApp().globalData.baseUrl + '/api/commission/check/',
            header: head,
            method: "DELETE",  //请求方式    
            data: {
              'commission_id': this.data.id,
            },
            success: (res) => {
              wx.showToast({
                title: '删除成功',
              })
              // this.onShow()
              wx.navigateBack()
              // wx.navigateTo({
              //   url: '../wtList/wtList?type=5',
              // })
              // wx.reLaunch({
              //   url: '../activity/home/home',
              // })
            },
            fail(res) {
              getApp().globalData.util.netErrorToast()
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  ChangeCommission() {
    //TODO
    //修改委托
    // 跳转到发布的子组件？？
    wx.navigateTo({
      url: 'changeCommission/changeCommission?id=' + this.data.id,
    })
  },

  FinishCommission() {
    let commission_id = this.data.id
    let head
    if (getApp().globalData.token == null) {
      head = {
        'content-type': 'application/json'
      }
    } else {
      head = {
        'content-type': 'application/json',
        'Authorization': 'Token ' + getApp().globalData.token
      }
    }
    wx.showModal({
      title: '确认',
      content: '委托已完成',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.baseUrl + '/api/commission/finish/',
            header: head,
            method: "POST",  //请求方式    
            data: {
              'commission_id': commission_id,
            },
            success: (res) => {
              this.setData({
                'status': 3
              })
              wx.showToast({
                title: '提交成功',
              })
              this.onShow()
            },
            fail(res) {
              getApp().globalData.util.netErrorToast()
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  GiveUpCommission() {
    let commission_id = this.data.id
    let head
    if (getApp().globalData.token == null) {
      head = {
        'content-type': 'application/json'
      }
    } else {
      head = {
        'content-type': 'application/json',
        'Authorization': 'Token ' + getApp().globalData.token
      }
    }
    wx.showModal({
      title: '警告',
      content: '确认放弃委托',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.baseUrl + '/api/commission/drop/',
            header: head,
            method: "POST",  //请求方式    
            data: {
              'commission_id': commission_id,
            },
            success: (res) => {
              wx.showToast({
                title: '放弃成功',
              })
              this.onShow()
            },
            fail(res) {
              getApp().globalData.util.netErrorToast()
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  UndoFinish() {
    let head = null
    let app = getApp()
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
    wx.showModal({
      title: '警告',
      content: '确认撤销完成',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            //TODO
            url: getApp().globalData.baseUrl + '/api/commission/score/', //接口名称   
            header: head,
            method: "DELETE",  //请求方式    
            //data: app.globalData.zdxx,  //用于存放post请求的参数  
            data: {
              //TODO
              'commission_id': this.data.id,
              'score': this.data.score
            },
            success: (res) => {
              wx.showToast({
                title: '撤销成功',
              })
              this.hideEvaluate()
              this.onShow()
            },
            fail(res) {
              getApp().globalData.util.netErrorToast()
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  Evaluate() {
    this.setData({
      evaluateShow: true
    })
    // wx.showModal({
    //   title: "评价",
    //   placeholderText: "请输入您的评价",
    //   showCancel: true,
    //   editable: true,
    //   success: (res) => {
    //     var evaluate = res.content;
    //     if (res.confirm) {
    //       //TODO
    //       //提交到后端
    //       console.log(evaluate);
    //     }
    //   },
    // });
  },

  hideEvaluate() {
    this.setData({
      'evaluateShow': false
    })
  },

  ScoreChange(event) {
    this.setData({
      'score': event.detail.value
    })
  },

  subEvaluate() {
    let commission_id = this.data.id
    let score = this.data.score
    let head
    if (getApp().globalData.token == null) {
      head = {
        'content-type': 'application/json'
      }
    } else {
      head = {
        'content-type': 'application/json',
        'Authorization': 'Token ' + getApp().globalData.token
      }
    }
    wx.request({
      url: getApp().globalData.baseUrl + '/api/commission/score/',
      header: head,
      method: "POST",  //请求方式    
      data: {
        'commission_id': commission_id,
        'score': score
      },
      success: (res) => {
        wx.showToast({
          title: '评分成功',
        })
        this.onShow()
      },
      fail(res) {
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  showModal(event) {
    console.log("in showModel", event, event.currentTarget.dataset.delcommentid)
    let userid = event.currentTarget.dataset.userid
    let username = event.currentTarget.dataset.username
    let commentid = event.currentTarget.dataset.commentid
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
      this.setData({
        myCommentShow: commentid == null ? false : true,
        commentWtShow: commentid == null ? true : false,
        commentUser: {
          id: userid,
          nickName: username,
        },
        comment_id: commentid,
      })
    }
    console.log(this.data.myCommentShow, this.data.commentUser, this.data.comment_id)
  },

  hideModal(event) {
    this.setData({
      myCommentShow: false,
      commentWtShow: false,
      commentStr: null,
      commentUser: {
        id: null,
        nickName: null,
      },
      comment_id: null,
    })
  },

  setValue(event) {
    this.setData({
      commentStr: event.detail.value
    });
  },

  submitCom() {
    //TODO
    let data
    if (this.data.comment_id == null) {
      data = {
        commission_id: this.data.id,
        comment: this.data.commentStr
      }
    } else {
      data = {
        commission_id: this.data.id,
        to_user_id: this.data.commentUser.id,
        comment: this.data.commentStr,
        to_comment_id: this.data.comment_id,
      }
    }
    console.log("submitCom", data)
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
      if (this.data.commentStr == null || this.data.commentStr.length == 0) {
        wx.showModal({
          title: '提示',
          content: '评论不能为空',
          showCancel: false
        })
      } else {
        self = this
        wx.request({
          url: getApp().globalData.baseUrl + '/api/commission/comment/', //接口名称   
          header: head,
          method: "POST",  //请求方式    
          data: data,
          success: (res) => {
            if (res.statusCode == 201) {
              self.data.list = res.data
              wx.showToast({
                title: '评论成功',
              })
              this.onShow()
              this.setData({
                myCommentShow: false,
                commentWtShow: false,
              })
            } else if (res.statusCode == 403) {
              wx.showModal({
                title: res.data + '。是否跳转至权限申诉界面？',
                success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/other/appeal/appeal',
                    })
                  }
                }
              })
              this.onShow()
              this.setData({
                myCommentShow: false,
                commentWtShow: false,
              })
            } else {
              getApp().globalData.util.netErrorToast()
            }
          },
          fail(res) {
            getApp().globalData.util.netErrorToast()
          }
        })
      }
    }
    this.hideModal()
  },

  deleteComment(event) {
    console.log("deleteComment", event, event.currentTarget.dataset.delcommentid)
    let comment_id = event.currentTarget.dataset.delcommentid
    let head
    if (getApp().globalData.token == null) {
      head = {
        'content-type': 'application/json'
      }
    } else {
      head = {
        'content-type': 'application/json',
        'Authorization': 'Token ' + getApp().globalData.token
      }
    }
    wx.showModal({
      title: '警告',
      content: '确认删除评论',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.baseUrl + '/api/commission/comment/' + comment_id + '/',
            header: head,
            method: 'delete',  //请求方式    
            data: {
              'id': comment_id,
            },
            success: (res) => {
              wx.showToast({
                title: '删除成功',
              })
              this.onShow()
            },
            fail(res) {
              getApp().globalData.util.netErrorToast()
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  SubEvaluate() {
    let head = null
    let app = getApp()
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
      url: getApp().globalData.baseUrl + '/api/commission/score/', //接口名称   
      header: head,
      method: "POST",  //请求方式    
      //data: app.globalData.zdxx,  //用于存放post请求的参数  
      data: {
        //TODO
        'commission_id': this.data.id,
        'score': this.data.score
      },
      success: (res) => {
        wx.showToast({
          title: '评价成功',
        })
        this.hideEvaluate()
        this.onShow()
      },
      fail(res) {
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  onTapUserName() {
    let userId = this.data.user.id
    wx.navigateTo({
      url: '../profile/profile?id=' + userId,
    })
  },

  getDetail: function () {
    let app = getApp()
    let head = {}
    this.setData({
      'myUserId': app.globalData.myUserId,
    })

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
      url: getApp().globalData.baseUrl + '/api/commission/detail/', //接口名称   
      header: head,
      method: "POST",  //请求方式    
      //data: app.globalData.zdxx,  //用于存放post请求的参数  
      data: {
        //TODO
        'commission_id': self.data.id,
      },
      success: (res) => {
        console.log("this is wt detail")
        console.log(res.data)
        this.setData({
          "id": res.data.id,
          "commission_type": res.data.commission_type,
          "name": res.data.name,
          "start_time": res.data.start_time,
          "end_time": res.data.end_time,
          "create_time": res.data.create_time,
          "real_time": (res.data.real_time === 1) ? true : false,
          "user": res.data.user,
          "accepted_user": res.data.accepted_user,
          "location": res.data.location,
          "status": res.data.status,
          "description": res.data.description,
          "fee": res.data.fee,
          "comment": res.data.comment,
          // "score": res.data.score
          "score": 5
        });
      },
      fail(res) {
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  gotoUserPage(event) {
    //跳转到个人主页
    let userid = event.currentTarget.dataset.userid

    wx.navigateTo({
      url: '../profile/profile?id=' + userid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getDetail()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})