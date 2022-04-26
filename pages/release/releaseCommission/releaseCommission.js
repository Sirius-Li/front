

// pages/release/releaseCommission/releaseConnission.js
Component({
  /**

   * 组件的初始数据
   */
  data: {
    list: {},
    //用户姓名
    username: 'username',
    //用户图片
    userAvatarUrl: '',
    // 委托id
    id: '',
    // 委托类型
    commission_type_id: 0,
    //委托名称
    name: 'commissionname',
    start_time: '05:20',
    end_time: '05:21',
    create_at: '2022-4-12',
    updated_at: '2022-4-12',
    //实时性
    real_time: 1,
    // 用户id
    user_id: '',
    //位置
    location: 1,
    //状态
    status: '1',
    //详细描述
    description: "正值青春脑子灵，\n 哪有时间儿女情。\n 献身航空与航天，\n 单身十年笑盈盈。",
    //审核状态
    audit: '',
    //费用
    fee: 110,
    
    //页面变量
    // 自动获取今天的日期
    date: '2022-10-13',
    imgList: [],
    type_list: [
      "取件",
      "带饭",
      "二手",
      "离谱",
    ],
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
  
    DelImg(event) {
      console.log("del this img")
      wx.showModal({
        title: '亲爱的用户',
        content: '确定要删除这张介绍图吗？',
        cancelText: '取消',
        confirmText: '确定',
        success: res => {
          if (res.confirm) {
            this.data.imgList.splice(event.currentTarget.dataset.index, 1);
            this.setData({
              imgList: this.data.imgList,
            });
          }
        }
      })
    },
  
    ChooseImage() {
      // wx.chooseImage({
      //   count: 1, //默认9
      //   sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      //   sourceType: ['album'], //从相册选择
      //   success: (res) => {
      //     console.log(res.tempFilePaths);
      //     if (this.data.imgList.length != 0) {
      //       this.setData({
      //         imgList: this.data.imgList.concat(res.tempFilePaths),
      //         'list.photo': res.tempFilePaths
      //       })
      //     } else {
      //       this.setData({
      //         imgList: res.tempFilePaths,
      //         haveimg: 1
      //       })
      //     }
      //   }
      // });
      wx.chooseMedia({
        count: 1, //默认9
        mediaType: ['image'], //默认['image', 'video']
        sourceType: ['camera'], //默认二者皆有
        camera: ['front'], //摄像头选择front | back
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        // success(res) {
        success: (res) => {
          // console.log(res.tempFiles[0].tempFilePath)
          // console.log(this.data.imgList.length)
          if (this.data.imgList.length != 0) {
            this.setData({
              imgList: this.data.imgList.concat(res.tempFiles[0].tempFilePath),
              // 'list.photo': res.tempFiles[0].tempFilePath
            })
          } else {
            this.setData({
              imgList: this.data.imgList.concat(res.tempFiles[0].tempFilePath),
            });
            // console.log(this.data.imgList)
          }
        },
        fail: (res) => {
            wx.showModal({
              title: "警告",
              content: "打开相册失败",
              showCancel: false,
              cancelColor: 'cancelColor',
            })
        },
      })
    },
  
    ViewImg(event) {
      // wx.previewImage({
      //   urls: this.data.imgList,
      //   current: e.currentTarget.dataset.url
      // });
      console.log(event.currentTarget.dataset.url)
      wx.previewMedia({
        sources: this.data.imgList,
        current: event.currentTarget.dataset.url,
        fail: (res) => {
          wx.showModal({
            title: "警告",
            content: "打开图片失败",
            showCancel: false,
            cancelColor: 'cancelColor',
          })
        },
      });
    },
  
    // 提交信息
    submit: function() {
      let app = getApp()
      let nowTime = new Date()
      let Mydate = this.data.date.replace(/-/g, '/')
      let today = nowTime.getFullYear() + '/' + (nowTime.getMonth()+1<10?'0' + (nowTime.getMonth()+1):(nowTime.getMonth()+1)) 
           + '/' + (nowTime.getDate()<10?'0' + nowTime.getDate():nowTime.getDate())
      let now = ((nowTime.getHours)<10 ? '0'+(nowTime.getHours) : (nowTime.getHours)) + ((nowTime.getMinutes)<10? '0'+(nowTime.getMinutes) : (nowTime.getMinutes))
        
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
        self.release(self)
        // wx.getSetting({
        //   withSubscriptions: true,
        //   success(res) {
        //     if(res.subscriptionsSetting.mainSwitch){
        //       wx.requestSubscribeMessage({
        //         tmplIds: [
        //           'mEFV6psbMGpP9i8CU8NXTJ27dOoppg8FZsYQmN9lHcs',
        //           'C4V9ycGzS0BGvjVsmcondcBwFMOvLFQ3sE8j0KKTF0g',
        //           'N0g3qePR6hz8Fn79lM_5sIT9jhUTKEYQW5Y_VObffZ0'],
        //         success (res) {
        //           self.release(self)
        //         }
        //       })
        //     }else{
        //       self.release(self)
        //     }
        //   },
        // })
      }
    },
    
    
    release(self){
    // wx.uploadFile({    
    wx.request({
      header: this.data.head,
      url: getApp().globalData.baseUrl + '/api/commission/publish/', //接口名称
      method: 'post',
      // filePath: self.data.imgList[0],
      // name:'photo',   
      // header: self.data.head,
      data: {
        "commission_type_id": this.data.commission_type_id,
        "name": this.data.name,
        "start_time": this.data.date + '/' + this.data.start_time,
        "end_time": this.data.date + '/' + this.data.end_time,
        "real_time": this.data.real_time,
        "location": this.data.location,
        "description": this.data.description,
        "fee": this.data.fee,
        "tags": ['新主楼'],
      }, 
       success(res) {     
         if(res.statusCode == 201){
           wx.navigateTo({
             url: '../../wtList/wtList?type=5',
           })
            wx.showToast({
              title: '活动发布成功',
            })
           self.reset()  
         }else if(res.statusCode == 400){
           if(res.data === ''){
            wx.showToast({
              title: '活动发布失败',
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
              title: '活动发布失败',
              icon: 'error'
            })
         }
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      }
    })
  },
  },

  

  options: {
    addGlobalClass: true
  }
})




