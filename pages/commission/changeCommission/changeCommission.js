// pages/commission/changeCommission/changeCommission.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //后端返回信息
    list: {},
    //用户姓名
    username: '',
    //用户图片
    userAvatarUrl: '',
    // 委托id
    id: '',
    // 委托类型
    commission_type_id: 0,
    //委托类别
    type_list: [],
    commission_type_name_list: [],
    //委托名称
    name: '',
    start_time: '',
    end_time: '',
    create_at: '',
    updated_at: '',
    //实时性
    real_time: false,
    //位置
    location: 1,
    //详细描述
    description: "",
    //费用
    fee: 0,
    // 标签
    tags: [],
    tag_list: [],
    tagStr: '',
    
    //页面变量
    date: '',
    location_list: [
      "学院路",
      "沙河",
      "其他",
    ],
    head: null,
  },

  NameChange(event) {
    this.setData({
      'name': event.detail.value,
      'list.name': event.detail.value,
    });
  },

  FeeChange(event) { 
    this.setData({
      'fee': event.detail.value,
      'list.fee': event.detail.value,
    });
  },

  RealTimeChange(event) {
    console.log(this.data.list)
    this.setData({
      'real_time': event.detail.value,
    })
  },

  TypeChange(event) {
    this.setData({
      'commission_type_id': event.detail.value,
    });
  },

  LocationChange(event) {
    this.setData({
      'location': event.detail.value,
      'list.location': Number(event.detail.value)+1,
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
      'list.description': event.datail.value,
    });
  },

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
    }
    //  else if (now < this.data.start_time) {
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
    let s_time = this.data.date.toString().replace(/-/g, '/') + ' ' + this.data.start_time
    let e_time = this.data.date.toString().replace(/-/g, '/') + ' ' + this.data.end_time
    this.setData({
      'list.start_time' : s_time,
      'list.end_time' : e_time,
      'list.commission_type': Number(this.data.commission_type_id) + 1,
      'list.real_time': Number(this.data.real_time?1:2)
    })

    wx.request({
      header: this.data.head,
      // url: getApp().globalData.baseUrl + '/api/commission/check/'+this.data.id+'/', //接口名称
      url: getApp().globalData.baseUrl + '/api/commission/check/', //接口名称
      method: 'POST',
      // filePath: self.data.imgList[0],
      // name:'photo',   
      // header: self.data.head,
      data: this.data.list, 
      success:(res) => {     
        if(res.statusCode == 201){
          wx.navigateTo({
            url: '../commission?id=' + this.data.id,
          })
          wx.showToast({
            title: '委托修改成功',
          })
          self.onShow()  
        }else if(res.statusCode == 400){
          if(res.data === ''){
            wx.showToast({
              title: '委托修改失败',
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
              title: '委托修改失败',
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
      
      location_list: [
        "学院路",
        "沙河",
        "其他",
      ],
      head: null,
    })
  },

  getDetail() {
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

    wx.request({
      //获取委托类型列表
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
      fail(res) {
          getApp().globalData.util.netErrorToast()
      }
    })

    wx.request({    
      url: getApp().globalData.baseUrl + '/api/commission/detail/', //接口名称   
      header: head,
      method:"POST",  //请求方式    
      //data: app.globalData.zdxx,  //用于存放post请求的参数  
      data: {
        //TODO
        'commission_id': this.data.id,
      }, 
      success: (res) => { 
        console.log("this is wtChange detail")
        console.log(res.data)
        
        this.setData({
          "list": res.data,
          "id": res.data.id,
          "commission_type_id": Number(res.data.commission_type.id) - 1,
          "name": res.data.name,
          "date": res.data.start_time.split(' ')[0],
          "start_time": res.data.start_time.split(' ')[1],
          "end_time": res.data.end_time.split(' ')[1],
          "real_time": (res.data.real_time==1)?true:false,
          "location": res.data.location - 1,
          "description": res.data.description,
          "fee": res.data.fee,
          "tags": res.data.tag_list==null?'':res.data.tag_list.join(''),
        });
        console.log(this.data.list)
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //TODO
    this.setData({
      'id': options.id
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
    console.log("发起请求获取数据")
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