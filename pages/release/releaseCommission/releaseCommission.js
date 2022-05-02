

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
    commission_type_name_list: [],
    //委托名称
    name: '',
    start_time: '',
    end_time: '',
    real_time: 0,
    create_at: '',
    updated_at: '',
    //实时性
    real_time: 0,
    // 用户id
    user_id: '',
    //位置
    location: 0,
    //状态
    status: '1',
    //详细描述
    description: "正值青春脑子灵，\n 哪有时间儿女情。\n 献身航空与航天，\n 单身十年笑盈盈。",
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
  
    real_time(event) {
      this.setData({
        'real_time': (event.datail.value)?1:0,
      })
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
  
    DiscriptionChange(event) {
      this.setData({
        'description': event.detail.value,
      });
    },

    tagChange(event) {
      this.setData({
        'tagStr': event.detail.value,
      })
    },
  
    // DelImg(event) {
    //   console.log("del this img")
    //   wx.showModal({
    //     title: '亲爱的用户',
    //     content: '确定要删除这张介绍图吗？',
    //     cancelText: '取消',
    //     confirmText: '确定',
    //     success: res => {
    //       if (res.confirm) {
    //         this.data.imgList.splice(event.currentTarget.dataset.index, 1);
    //         this.setData({
    //           imgList: this.data.imgList,
    //         });
    //       }
    //     }
    //   })
    // },
  
    // ChooseImage() {
    //   wx.chooseMedia({
    //     count: 1, //默认9
    //     mediaType: ['image'], //默认['image', 'video']
    //     sourceType: ['camera'], //默认二者皆有
    //     camera: ['front'], //摄像头选择front | back
    //     sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
    //     // success(res) {
    //     success: (res) => {
    //       // console.log(res.tempFiles[0].tempFilePath)
    //       // console.log(this.data.imgList.length)
    //       if (this.data.imgList.length != 0) {
    //         this.setData({
    //           imgList: this.data.imgList.concat(res.tempFiles[0].tempFilePath),
    //           // 'list.photo': res.tempFiles[0].tempFilePath
    //         })
    //       } else {
    //         this.setData({
    //           imgList: this.data.imgList.concat(res.tempFiles[0].tempFilePath),
    //         });
    //         // console.log(this.data.imgList)
    //       }
    //     },
    //     fail: (res) => {
    //         wx.showModal({
    //           title: "警告",
    //           content: "打开相册失败",
    //           showCancel: false,
    //           cancelColor: 'cancelColor',
    //         })
    //     },
    //   })
    // },
  
    // ViewImg(event) {
    //   // wx.previewImage({
    //   //   urls: this.data.imgList,
    //   //   current: e.currentTarget.dataset.url
    //   // });
    //   console.log(event.currentTarget.dataset.url)
    //   wx.previewMedia({
    //     sources: this.data.imgList,
    //     current: event.currentTarget.dataset.url,
    //     fail: (res) => {
    //       wx.showModal({
    //         title: "警告",
    //         content: "打开图片失败",
    //         showCancel: false,
    //         cancelColor: 'cancelColor',
    //       })
    //     },
    //   });
    // },
  
    // 提交信息
    submit: function() {
      let app = getApp()
      let nowTime = new Date()
      let Mydate = this.data.date.replace(/-/g, '/')
      let today = nowTime.getFullYear() + '/' + (nowTime.getMonth()+1<10?'0' + (nowTime.getMonth()+1):(nowTime.getMonth()+1)) 
           + '/' + (nowTime.getDate()<10?'0' + nowTime.getDate():nowTime.getDate())
      let now = ((nowTime.getHours())<10 ? '0'+(nowTime.getHours()) : (nowTime.getHours())) + ':' + ((nowTime.getMinutes())<10? '0'+(nowTime.getMinutes()) : (nowTime.getMinutes()))
        
      if (this.start_time > this.end_time) {
        wx.showModal({
          title: '提示',
          content: '委托开始时间不能晚于委托结束时间',
          showCancel: false
        })
      } else if (now < this.data.start_time) {
        wx.showModal({
          title: '提示',
          content: '委托开始时间必须晚于现在',
          showCancel: false
        })
      } else if (Mydate < today) {
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
      }  else if (this.data.location == null) {
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
      }else if (this.data.commission_type_id < 0) {
        wx.showModal({
          title: '提示',
          content: '请选择委托类型',
          showCancel: false
        })
      } else if (this.data.length == 0) {
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
        wx.getSetting({
          withSubscriptions: true,
          success(res) {
            if(res.subscriptionsSetting.mainSwitch){
              wx.requestSubscribeMessage({
                tmplIds: [
                  'mEFV6psbMGpP9i8CU8NXTJ27dOoppg8FZsYQmN9lHcs',
                  'C4V9ycGzS0BGvjVsmcondcBwFMOvLFQ3sE8j0KKTF0g',
                  'N0g3qePR6hz8Fn79lM_5sIT9jhUTKEYQW5Y_VObffZ0'],
                success (res) {
                  self.release(self)
                }
              })
            }else{
              self.release(self)
            }
          },
        })
      }
    },
    
    
    release(self){
      let s_time = this.data.date.toString().replace(/-/g, '/') + ' ' + this.data.start_time
      let e_time = this.data.date.toString().replace(/-/g, '/') + ' ' + this.data.end_time
      // let r_time = this.data.real_time.toString().replace(/-/g, '/')
      let tag_temp = this.data.tagStr.split(' ')
      for (const key in tag_temp) {
        if (tag_temp.hasOwnProperty.call(tag_temp, key)) {
          this.data.tag_list.push({"name": tag_temp[key]});
        }
      }

    // wx.uploadFile({    
      wx.request({
        header: this.data.head,
        url: getApp().globalData.baseUrl + '/api/commission/publish/', //接口名称
        method: 'post',
        // filePath: self.data.imgList[0],
        // name:'photo',   
        // header: self.data.head,
        data: {
          "commission_type": this.data.commission_type_id + 1,
          "name": this.data.name,
          "start_time": s_time,
          "end_time": e_time,
          "real_time": this.data.real_time + 1,
          "location": this.data.location,
          "description": this.data.description,
          "fee": this.data.fee,
          "tags": this.data.tag_list,
        }, 
        success(res) {     
          if(res.statusCode == 201){
            wx.navigateTo({
              url: '../wtList/wtList?type=5',
            })
              wx.showToast({
                title: '委托发布成功',
              })
            self.reset()  
          }else if(res.statusCode == 400){
            if(res.data === ''){
              wx.showToast({
                title: '委托发布失败',
                icon: 'error'
              })
            }else{
              wx.showModal({
                content: res.data,
                showCancel: false
              })
            }
          }else{
              wx.showToast({
                title: '委托发布失败',
                icon: 'error'
              })
          }
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        }
      })
    },

    reset() {
      let nowTime = new Date()
      let today = nowTime.getFullYear() + '/' + (nowTime.getMonth()+1<10?'0' + (nowTime.getMonth()+1):(nowTime.getMonth()+1)) 
            + '/' + (nowTime.getDate()<10?'0' + nowTime.getDate():nowTime.getDate())
      let now = ((nowTime.getHours())<10 ? '0'+(nowTime.getHours()) : (nowTime.getHours())) + ':' + ((nowTime.getMinutes())<10? '0'+(nowTime.getMinutes()) : (nowTime.getMinutes()))
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
        // commission_type_name_list: [],
        //委托名称
        name: '',
        start_time: now.toString(),
        end_time: now.toString(),
        create_at: '',
        updated_at: '',
        //实时性
        real_time: 0,
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
        date: now.toString(),
        
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
    if(getApp().globalData.user_status == 2){
      wx.redirectTo({
        url: '../../certification/certification',
      })
    }else if(getApp().globalData.user_status == 1){
      wx.switchTab({
        url: '../home/home',
        success(res){
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
    let today = nowTime.getFullYear() + '/' + (nowTime.getMonth()+1<10?'0' + (nowTime.getMonth()+1):(nowTime.getMonth()+1)) 
           + '/' + (nowTime.getDate()<10?'0' + nowTime.getDate():nowTime.getDate())
    let now = ((nowTime.getHours())<10 ? '0'+(nowTime.getHours()) : (nowTime.getHours())) + ':' + ((nowTime.getMinutes())<10? '0'+(nowTime.getMinutes()) : (nowTime.getMinutes()))
    this.setData({
      'date': today,
      'start_time': now.toString(),
      'end_time': now.toString(),
    })
    console.log(this.data.start_time)

    wx.request({
      url: getApp().globalData.baseUrl + '/api/commission/sort/',
      header: head,
      method:"GET", 
      // data: {
      //     'keyword': this.data.keywords
      // },
      success: (res) => {
        this.setData({
            'type_list': res.data
        })
        let temp_list = []
        for (const key in this.data.type_list) {
          if (this.data.type_list.hasOwnProperty.call(this.data.type_list, key)) {
            temp_list.push(this.data.type_list[key].name);       
          }
        }
        this.setData({
          commission_type_name_list: temp_list
        })
      },
      fail:(res) => {
          getApp().globalData.util.netErrorToast()
      }
    })
  },



  options: {
    addGlobalClass: true
  }
})




