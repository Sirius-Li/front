import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog'
const util = require('../../../utils/util')
Page({

  data: {
    rate: 5,
    value: '1',
    hide: 1,
    str: '',
    list: [],
    photo: null,
    activity:
    {
      people: {
        name: "zdxx",
      },
      id: 'id',
      in: 'This is a d',
      name: "aaa",
      time: "xxx",
      where: "xue yuan road",
      d: "w"
    }
    ,
    comment: [],
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: ''
      //url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.nmgxhysp.com%2F__local%2FC%2F09%2F0E%2F5A9790D8C56AF559D01296479C0_CCB34C87_91461.png&refer=http%3A%2F%2Fwww.nmgxhysp.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622786836&t=3dc648d2a3145af18d89c3bb9ec99829'
    }, {
      id: 1,
      type: 'image',
      url: ''
      //url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.nmgxhysp.com%2F__local%2FC%2F09%2F0E%2F5A9790D8C56AF559D01296479C0_CCB34C87_91461.png&refer=http%3A%2F%2Fwww.nmgxhysp.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622786836&t=3dc648d2a3145af18d89c3bb9ec99829',
    }, {
      id: 2,
      type: 'image',
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.ltmuye.com%2Fuploads%2Fallimg%2F200209%2F1312261537_0.jpg&refer=http%3A%2F%2Fwww.ltmuye.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622786836&t=a4024f984adac2c3015a80ab3eb1ede8'
    }, {
      id: 3,
      type: 'image',
      url: ''
      //url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20171222%2F49f19646cf004ab2a025e5d058fc6f1b.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622786836&t=8a452f08edc2c7836aece52d04a77edd'
    }],

    //活动id
    id: null,
    //type
    type: null,
    //活动是否能选
    chooseable: null,
    //活动是否选过
    choosed: null,
    //活动是否可修改
    fixable: null,
    //评论窗口弹出
    commentShow: [],
    //用户认证状态
    user_status: null,
    //活动报名未开始
    toStart: null,
    //活动报名已结束
    ended: null,
    //活动已结束
    actEnded: null,

    myUserId: getApp().globalData.myUserId

  },
  onChange(event) {
    this.setData({
      rate: event.detail,
    });
  },
  onLoad(options) {
    this.towerSwiper('swiperList');
    // 初始化towerSwiper 传已有的数组名即可
    this.setData({
      id: options.id,
      type: options.type,
      myUserId: getApp().globalData.myUserId
    })


  },

  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
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
      url: getApp().globalData.baseUrl + '/api/condition/activities/', //接口名称   
      header: head,
      method: "POST",  //请求方式    
      //data: app.globalData.zdxx,  //用于存放post请求的参数  
      data: {
        'user_attend': true,
        'audit_status': [3]
      },
      success(res) {
        for (let i = 0; i < res.data.length; i++) {
          temp_list_attend.push(res.data[i].id)
        }
        wx.request({
          url: getApp().globalData.baseUrl + '/api/condition/activities/', //接口名称   
          header: head,
          method: "POST",  //请求方式    
          //data: app.globalData.zdxx,  //用于存放post请求的参数  
          data: {
            'user_create': true,
            'audit_status': [3]
          },
          success(res) {
            for (let i = 0; i < res.data.length; i++) {
              temp_list_create.push(res.data[i].id)
            }
            wx.request({
              url: getApp().globalData.baseUrl + `/api/activities/${self.data.id}/`, //接口名称   
              header: head,
              method: "GET",  //请求方式    
              //data: app.globalData.zdxx,  //用于存放post请求的参数   
              success(res) {
                if (res.statusCode == 200) {
                  console.log(res.data)
                  let inArr = 0
                  for (let i = 0; i < temp_list_attend.length; i++) {
                    if (temp_list_attend[i] == res.data.id) {
                      inArr = 1
                      break
                    }
                  }
                  if (inArr == 0) {
                    self.setData({
                      choosed: false
                    })
                  } else {
                    self.setData({
                      choosed: true
                    })
                  }
                  inArr = 0
                  for (let i = 0; i < temp_list_create.length; i++) {
                    if (temp_list_create[i] == res.data.id) {
                      inArr = 1
                      break
                    }
                  }
                  if (inArr == 1) {
                    self.setData({
                      type: 5
                    })
                  }
                  self.setData({
                    activity: res.data,
                    'swiperList[0].url': res.data.photo == '' ? '../../../static/img/nophoto.jpg' : getApp().globalData.baseUrl + res.data.photo,
                    rate: res.data.remark,
                    photo: res.data.photo == '' ? '../../../static/img/nophoto.jpg' : getApp().globalData.baseUrl + res.data.photo,
                  })
                  //评论弹窗控制 初始化commentShow
                  let tempList = []
                  for (let i = 0; i <= res.data.comment.length; i++) {
                    tempList.push(false)
                  }
                  self.setData({
                    commentShow: tempList
                  })
                  let now_time = new Date()
                  //console.log(self.data.activity)
                  let start_enrollment_time_para = self.data.activity.start_enrollment_at.replace(/\//g, ' ').replace(/:/g, ' ').split(' ')
                  start_enrollment_time_para.push('00')
                  //console.log(start_enrollment_time_para)
                  let end_enrollment_time_para = self.data.activity.end_enrollment_at.replace(/\//g, ' ').replace(/:/g, ' ').split(' ')
                  end_enrollment_time_para.push('00')
                  //console.log(end_enrollment_time_para)
                  let start_enrollment_time = new Date(
                    start_enrollment_time_para[0], start_enrollment_time_para[1] - 1,
                    start_enrollment_time_para[2], start_enrollment_time_para[3],
                    start_enrollment_time_para[4], start_enrollment_time_para[5])
                  let end_enrollment_time = new Date(
                    end_enrollment_time_para[0], end_enrollment_time_para[1] - 1,
                    end_enrollment_time_para[2], end_enrollment_time_para[3],
                    end_enrollment_time_para[4], end_enrollment_time_para[5])
                  //console.log(now_time.toString())
                  //console.log(start_enrollment_time.toString())
                  //console.log(end_enrollment_time.toString())
                  self.setData({
                    chooseable: (now_time >= start_enrollment_time && now_time <= end_enrollment_time),
                    toStart: (now_time < start_enrollment_time),
                    ended: (now_time > end_enrollment_time)
                  })
                  //console.log(self.data.chooseable)
                  let start_time_para = self.data.activity.normal_activity.start_at.replace(/\//g, ' ').replace(/:/g, ' ').split(' ')
                  start_time_para.push('00')
                  //console.log(start_time_para)
                  let end_time_para = self.data.activity.normal_activity.end_at.replace(/\//g, ' ').replace(/:/g, ' ').split(' ')
                  end_time_para.push('00')
                  //console.log(end_time_para)
                  let start_time = new Date(
                    start_time_para[0], start_time_para[1] - 1,
                    start_time_para[2], start_time_para[3],
                    start_time_para[4], start_time_para[5])
                  let end_time = new Date(
                    end_time_para[0], end_time_para[1] - 1,
                    end_time_para[2], end_time_para[3],
                    end_time_para[4], end_time_para[5])
                  if (now_time > end_time && self.data.choosed == true && self.data.type != 5) {
                    self.setData({
                      type: 4
                    })
                  }
                  if (now_time < start_time && self.data.type == 5) {
                    self.setData({
                      fixed: true
                    })
                  }
                  self.setData({
                    actEnded: (now_time > end_time)
                  })
                } else if (res.statusCode == 404) {
                  wx.showToast({
                    title: '该活动不存在',
                    icon: 'error'
                  })
                } else {
                  wx.showToast({
                    title: '活动获取异常',
                    icon: 'error'
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
      fail(res) {
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  gotoFix() {
    wx.navigateTo({
      //url: '../../activity/releasing/changeAct/changeAct?id='+this.data.id,
      url: '/pages/release/releaseAct/changeAct/changeAct?id=' + this.data.id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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


  // 隐藏回复部分
  cancelHide: function () {
    this.setData({
      hide: 0
    })
  },

  continueHide: function () {
    this.setData({
      hide: 1
    })
  },

  attActivity: function () {
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
      if (this.data.activity.activity_type.name === '博雅') {
        Toast.loading({
          message: '正在加入...',
          forbidClick: true,
          duration: 0
        });
      }
      //if () {
      wx.request({
        url: getApp().globalData.baseUrl + '/api/select_activity', //接口名称   
        header: head,
        method: "POST",  //请求方式    
        data: {
          activity_id: this.data.activity.id
        },
        success(res) {
          if (res.statusCode == 201) {
            self.data.list = res.data
            self.getDetail()
            Toast.clear()
            wx.showToast({
              title: '报名成功',
            })
            /*self.setData({
              choosed: true
            })
            let now_time = new Date()
            let start_enrollment_time = new Date(self.data.activity.start_enrollment_at.replace(/\//g, '-') + ':00')
            let end_enrollment_time = new Date(self.data.activity.end_enrollment_at.replace(/\//g, '-') + ':00')
            self.setData({
              chooseable: (now_time >= start_enrollment_time && now_time <= end_enrollment_time)?true:false
            })*/
          } else if (res.statusCode == 400) {
            Toast.clear()
            if (self.data.activity.activity_type.name === '博雅') {
              let gotoMe = (res.data.detail === '您没有开启博雅功能，请在设置页面开启' ? true : false)
              wx.showModal({
                content: res.data.detail,
                confirmText: gotoMe ? '现在前往' : '确认',
                success(res) {
                  if (res.confirm && gotoMe == true) {
                    wx.switchTab({
                      url: '../../aboutme/aboutme',
                    })
                  }
                }
              })
            } else {
              wx.showModal({
                content: '报名失败，可能是报名人数已满',
                showCancel: false,
              })
            }
          } else {
            Toast.clear()
            wx.showToast({
              icon: 'error',
              title: '报名失败',
            })
          }
        },
        fail(res) {
          Toast.clear()
          getApp().globalData.util.netErrorToast()
        }
      })
    }
    //}
  },
  outActivity: function () {
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
    //if () {
    let self = this
    if (this.data.activity.activity_type.name == '博雅') {
      Toast.loading({
        message: '正在退出...',
        forbidClick: true,
        duration: 0
      });
    }
    wx.request({
      url: getApp().globalData.baseUrl + '/api/cancel_activity', //接口名称   
      header: head,
      method: "POST",  //请求方式    
      data: {
        activity_id: this.data.activity.id
      },
      success(res) {
        if (res.statusCode == 204) {
          self.data.list = res.data
          self.getDetail()
          Toast.clear()
          wx.showToast({
            title: '退出活动成功',
          })
          /*self.setData({
            choosed: false
          })
          let now_time = new Date()
          let start_enrollment_time = new Date(self.data.activity.start_enrollment_at.replace(/\//g, '-') + ':00')
          let end_enrollment_time = new Date(self.data.activity.end_enrollment_at.replace(/\//g, '-') + ':00')
          self.setData({
            chooseable: (now_time >= start_enrollment_time && now_time <= end_enrollment_time)?true:false
          })*/
        } else {
          Toast.clear()
          if (self.data.activity.activity_type.name === '博雅') {
            let gotoMe = (res.data.detail === '您没有开启博雅功能，请在设置页面开启' ? true : false)
            wx.showModal({
              content: res.data.detail,
              showCancel: false,
              confirmText: gotoMe ? '现在前往' : '确认',
              success(res) {
                if (res.confirm && gotoMe == true) {
                  wx.switchTab({
                    url: '../../aboutme/aboutme',
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: '退出活动失败',
              icon: 'error'
            })
          }
        }
      },
      fail(res) {
        Toast.clear()
        getApp().globalData.util.netErrorToast()
      }
    })
    //}
  },

  // 储存评论
  setValue: function (e) {
    this.setData({
      str: e.detail.value
    })
  },

  // 提交评分
  submitStar: function () {
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
      if (this.data.rate) {
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
        self = this
        wx.request({
          url: getApp().globalData.baseUrl + '/api/remark_activity', //接口名称   
          header: head,
          method: "POST",  //请求方式    
          data: {
            activity_id: this.data.activity.id,
            remark: this.data.rate
          },
          success(res) {

            self.data.list = res.data
            wx.showToast({
              title: '评分成功',
            })
            self.getDetail()
            self.setData({
              hide: 1
            })
          },
          fail(res) {
            getApp().globalData.util.netErrorToast()
          }
        })
      } else {
        wx.showModal({
          content: '请选择评分后再提交',
          showCancel: false
        })
      }
    }
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
          url: getApp().globalData.baseUrl + '/api/comment/', //接口名称   
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
          url: getApp().globalData.baseUrl + '/api/comment/', //接口名称   
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
        url: '../../certification/certification',
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
  ChooseCheckbox(e) {
    let items = this.data.checkbox;
    let values = e.currentTarget.dataset.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData({
      checkbox: items
    })
  },

  gotoUserPage(event) {
    //跳转到个人主页
    let userid = event.currentTarget.dataset.userid

    wx.navigateTo({
      url: '../../profile/profile?id=' + userid,
    })
  },

  gotoAttended() {
    //console.log(this.data.type)
    if (this.data.type == 5 && getApp().globalData.user_status == 0) {

      getApp().globalData.attend_users = this.data.activity.attend_users

      wx.navigateTo({
        url: './attendList/attendList',
      })
    }
  },

  //删除未通过审核的活动
  deleteActivity() {
    Dialog.confirm({
      message: '确定要删除该活动吗？',
    })
      .then(() => {
        // on confirm
        wx.request({
          url: getApp().globalData.baseUrl + `/api/activities/${this.data.activity.id}/`, //接口名称   
          header: getApp().getHeaderWithToken(),
          method: "DELETE",  //请求方式    
          data: {
            id: this.data.activity.id
          },
          success(res) {
            if (res.statusCode == 204) {
              wx.navigateBack()
              wx.showToast({
                title: '删除成功',
              })
            } else if (res.statusCode == 400) {
              wx.showModal({
                content: res.data,
                showCancel: false
              })
            } else if (res.statusCode == 404) {
              wx.showToast({
                title: '用户不存在',
                icon: 'error'
              })
            } else {
              wx.showToast({
                title: '删除失败',
                icon: 'error'
              })
            }
          },
          fail(res) {
            getApp().globalData.util.netErrorToast()
          }
        })
      })
      .catch(() => {
        // on cancel
      });
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