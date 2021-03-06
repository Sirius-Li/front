

// pages/release/releaseCommission/releaseConnission.js
Component({
  /**
   * 组件的初始数据
   */
  data: {
    list: {},
    //用户姓名
    username: '',
    //用户图片
    userAvatarUrl: '',
    // 委托id
    id: '',
    // 委托类型
    commission_type_id: -1,
    //委托类别
    type_list: [],
    commission_type_list: [],
    commission_type_name_list: [],
    //委托名称
    name: '',
    start_time: '',
    end_time: '',
    create_at: '',
    updated_at: '',
    //实时性
    real_time: false,
    // 用户id
    user_id: '',
    //位置
    location: 0,
    //状态
    status: '1',
    //详细描述
    description: "",
    //审核状态
    audit: '',
    //费用
    fee: null,
    // 标签
    tag_list: [],
    tagStr: '',

    //页面变量
    // 自动获取今天的日期
    date: '',
    imgList: [],
    // type_list: [
    //   "取件",
    //   "带饭",
    //   "二手",
    //   "离谱",
    // ],
    location_list: [
      "学院路",
      "沙河",
      "其他",
    ],
    head: null,
  },



  /**
   * 组件的方法列表
   */
  methods: {
    NameChange(event) {
      this.setData({
        'name': event.detail.value,
      });
    },

    FeeChange(event) {
      this.setData({
        'fee': event.detail.value,
      });
    },

    RealTimeChange(event) {
      this.setData({
        'real_time': event.detail.value,
      })
      console.log(this.data.real_time)
    },

    TypeChange(event) {
      this.setData({
        'commission_type_id': event.detail.value,
      });
    },

    LocationChange(event) {
      this.setData({
        'location': event.detail.value
      });
    },

    DateChange(event) {
      this.setData({
        'date': event.detail.value,
      });
    },

    StartTimeChange(event) {
      this.setData({
        'start_time': event.detail.value,
      });
    },

    EndTimeChange(event) {
      this.setData({
        'end_time': event.detail.value,
      });
    },

    DescriptionChange(event) {
      this.setData({
        'description': event.detail.value,
      });
    },

    tagChange(event) {
      this.setData({
        'tagStr': event.detail.value,
      })
    },

    // 提交信息
    submit: function () {
      let app = getApp()
      let nowTime = new Date()
      let Mydate = this.data.date.replace(/-/g, '/')
      let today = nowTime.getFullYear() + '/' + (nowTime.getMonth() + 1 < 10 ? '0' + (nowTime.getMonth() + 1) : (nowTime.getMonth() + 1))
        + '/' + (nowTime.getDate() < 10 ? '0' + nowTime.getDate() : nowTime.getDate())
      let now = ((nowTime.getHours()) < 10 ? '0' + (nowTime.getHours()) : (nowTime.getHours())) + ':' + ((nowTime.getMinutes()) < 10 ? '0' + (nowTime.getMinutes()) : (nowTime.getMinutes()))

      if (this.start_time > this.end_time) {
        wx.showModal({
          title: '提示',
          content: '委托开始时间不能晚于委托结束时间',
          showCancel: false
        })
      }
      // else if (now > this.data.start_time) {
      //   wx.showModal({
      //     title: '提示',
      //     content: '委托开始时间必须晚于现在',
      //     showCancel: false
      //   })
      // } 
      else if (Mydate < today) {
        wx.showModal({
          title: '提示',
          content: '委托开始日期必须晚于今日',
          showCancel: false
        })
      } else if (this.data.name == null || this.data.name.length == 0) {
        wx.showModal({
          title: '提示',
          content: '没有设置委托名称',
          showCancel: false
        })
      } else if (this.data.location == null) {
        wx.showModal({
          title: '提示',
          content: '没有选择校区',
          showCancel: false
        })
      } else if (this.data.fee == null || this.data.fee.length == 0) {
        wx.showModal({
          title: '提示',
          content: '请设置委托报酬',
          showCancel: false
        })
      } else if (this.data.commission_type_id < 0) {
        wx.showModal({
          title: '提示',
          content: '请选择委托类型',
          showCancel: false
        })
      } else if (this.data.description.length == 0) {
        wx.showModal({
          title: '提示',
          content: '请输入委托简介',
          showCancel: false
        })
      } else if (this.data.name.length >= 51) {
        wx.showModal({
          title: '提示',
          content: '委托名称不能超过50个字符',
          showCancel: false
        })
      } else {
        if (app.globalData.token == null) {
          this.data.head = {
            'content-type': 'application/json'
          }
        } else {
          this.data.head = {
            'content-type': 'application/json',
            'Authorization': 'Token ' + app.globalData.token
          }
        }
        let self = this
        this.release(self)

        //TODO
        // wx.getSetting({
        //   withSubscriptions: true,
        //   success(res) {
        //     if (res.subscriptionsSetting.mainSwitch) {
        //       wx.requestSubscribeMessage({
        //         tmplIds: [
        //           'mEFV6psbMGpP9i8CU8NXTJ27dOoppg8FZsYQmN9lHcs',
        //           'C4V9ycGzS0BGvjVsmcondcBwFMOvLFQ3sE8j0KKTF0g',
        //           'N0g3qePR6hz8Fn79lM_5sIT9jhUTKEYQW5Y_VObffZ0'],
        //         success(res) {
        //           self.release(self)
        //         }
        //       })
        //     } else {
        //       self.release(self)
        //     }
        //   },
        // })
      }
    },


    release(self) {
      let s_time = this.data.date.toString().replace(/-/g, '/') + ' ' + this.data.start_time
      let e_time = this.data.date.toString().replace(/-/g, '/') + ' ' + this.data.end_time
      // let r_time = this.data.real_time.toString().replace(/-/g, '/')
      let tag_temp = this.data.tagStr.split(' ')
      this.data.tag_list = []
      for (const key in tag_temp) {
        if (tag_temp.hasOwnProperty.call(tag_temp, key)) {
          this.data.tag_list.push({ "name": tag_temp[key] });
        }
      }
      wx.request({
        header: this.data.head,
        url: getApp().globalData.baseUrl + '/api/commission/publish/', //接口名称
        method: 'post',
        data: {
          "commission_type": this.data.commission_type_list[Number(this.data.commission_type_id)].id,
          "name": this.data.name,
          "start_time": s_time,
          "end_time": e_time,
          "real_time": (this.data.real_time) ? 1 : 2,
          "location": Number(this.data.location) + 1,
          "description": this.data.description,
          "fee": this.data.fee,
          "tags": this.data.tag_list,
        },
        success: (res) => {
          if (res.statusCode == 201) {
            wx.navigateTo({
              url: '../wtList/wtList?type=5',
            })
            wx.showToast({
              title: '委托发布成功',
            })
            this.reset()
          } else if (res.statusCode == 403) {
            self.reset()
            wx.showModal({
              title: '当前用户无发布委托权限，请及时进行申诉。是否跳转至权限申诉界面？',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/other/appeal/appeal',
                  })
                }
              }
            })
          } else if (res.statusCode == 400) {
            if (res.data === '') {
              wx.showToast({
                title: '委托发布失败',
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
              title: '委托发布失败',
              icon: 'error'
            })
          }
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
    },

    reset() {
      let nowTime = new Date()
      let today = nowTime.getFullYear() + '/' + (nowTime.getMonth() + 1 < 10 ? '0' + (nowTime.getMonth() + 1) : (nowTime.getMonth() + 1))
        + '/' + (nowTime.getDate() < 10 ? '0' + nowTime.getDate() : nowTime.getDate())
      let now = ((nowTime.getHours()) < 10 ? '0' + (nowTime.getHours()) : (nowTime.getHours())) + ':' + ((nowTime.getMinutes()) < 10 ? '0' + (nowTime.getMinutes()) : (nowTime.getMinutes()))
      this.setData({
        list: {},
        //用户姓名
        username: '',
        // //用户图片
        // userAvatarUrl: '',
        // imgList: [],
        // 委托id
        id: '',
        // 委托类型
        commission_type_id: -1,
        //委托类别
        type_list: [],
        // commission_type_list: [],
        //委托名称
        name: '',
        start_time: now.toString(),
        end_time: now.toString(),
        create_at: '',
        updated_at: '',
        //实时性
        real_time: false,
        // 用户id
        user_id: '',
        //位置
        location: 0,
        //状态
        status: '1',
        //详细描述
        description: "",
        //审核状态
        audit: '',
        //费用
        fee: null,
        // 标签
        tag_list: [],
        tagStr: '',

        //页面变量
        // 自动获取今天的日期
        date: today.toString(),

        location_list: [
          "学院路",
          "沙河",
          "其他",
        ],
        head: null,
      })
    },

  },

  attached() {
    console.log("发起请求获取数据")
    let head;
    let app = getApp()
    if (getApp().globalData.user_status == 2) {
      wx.redirectTo({
        url: '../../certification/certification',
      })
    } else if (getApp().globalData.user_status == 1) {
      wx.switchTab({
        url: '../home/home',
        success(res) {
          wx.showToast({
            title: '用户还在认证中',
            icon: 'error'
          })
        }
      })
    }
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

    let nowTime = new Date()
    let today = nowTime.getFullYear() + '/' + (nowTime.getMonth() + 1 < 10 ? '0' + (nowTime.getMonth() + 1) : (nowTime.getMonth() + 1))
      + '/' + (nowTime.getDate() < 10 ? '0' + nowTime.getDate() : nowTime.getDate())
    let now = ((nowTime.getHours()) < 10 ? '0' + (nowTime.getHours()) : (nowTime.getHours())) + ':' + ((nowTime.getMinutes()) < 10 ? '0' + (nowTime.getMinutes()) : (nowTime.getMinutes()))
    this.setData({
      'date': today,
      'start_time': now.toString(),
      'end_time': now.toString(),
    })
    // console.log(this.data.start_time)

    wx.request({
      url: getApp().globalData.baseUrl + '/api/commission/sort/',
      header: head,
      method: "GET",
      // data: {
      //     'keyword': this.data.keywords
      // },
      success: (res) => {
        this.setData({
          'type_list': res.data
        })
        let temp_list = []
        let name_list = []
        for (const key in this.data.type_list) {
          if (this.data.type_list.hasOwnProperty.call(this.data.type_list, key)) {
            // console.log(this.data.type_list[key])
            temp_list.push(this.data.type_list[key]);
            name_list.push(this.data.type_list[key].name)
          }
        }
        // console.log(res.data)
        this.setData({
          commission_type_list: temp_list,
          commission_type_name_list: name_list
        })
        // console.log(this.data.commission_type_list[3])
      },
      fail: (res) => {
        getApp().globalData.util.netErrorToast()
      }
    })
  },



  options: {
    addGlobalClass: true
  }
})




