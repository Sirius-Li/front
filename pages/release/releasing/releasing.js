const app = getApp();
const chooseLocation = requirePlugin('chooseLocation');
const wojujue= new Date();
Page({
  data: {
    head : {},
    stime: null,
    rtime: null,
    act_name: null,
    act_number: null,
    location:'选择运动类活动地点',
    longitude:null,
    latitude:null,
    acttags:'',
    choosePlace: false,
    list :{
      'longitude':null,
      'latitude':null,
      "start_at": '', //1
      "end_at": '', //1 
      "description": '', //1
      "allow_total": 0, // 1
      "photo": '', //1
      "name":'?', //1
      "activity_type": 'name', //1
      "start_enrollment_at":'', //1
      "end_enrollment_at":'', //1
      "location":1,
      "position":'',
      "tags":'' 
    },
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    position:null,
    index: null,
    typeStr: null,
    picker: ['学院路', '沙河', '校外'],
    type: [],
    start_time: '12:00',
    end_time: '12:00',
    signUp_stime: null,
    signDown_rtime: null,
    date: wojujue.getFullYear() + '-' + (wojujue.getMonth()+1<10?'0' + (wojujue.getMonth()+1):(wojujue.getMonth()+1)) 
    + '-' + (wojujue.getDate()<10?'0' + wojujue.getDate():wojujue.getDate()),
    signDate: wojujue.getFullYear() + '-' + (wojujue.getMonth()+1<10?'0' + (wojujue.getMonth()+1):(wojujue.getMonth()+1)) 
    + '-' + (wojujue.getDate()<10?'0' + wojujue.getDate():wojujue.getDate()),
    stopDate: wojujue.getFullYear() + '-' + (wojujue.getMonth()+1<10?'0' + (wojujue.getMonth()+1):(wojujue.getMonth()+1)) 
    + '-' + (wojujue.getDate()<10?'0' + wojujue.getDate():wojujue.getDate()),
    imgList: [],
    haveimg: null,
    modalName: null,
    textareaValue: '',
    mapDisabled: true
  },
  PickerChange(e) {
    this.setData({
      index: e.detail.value,
      'list.location': parseInt(e.detail.value) + 1
    })
  },
  acttagsChange(e) {
    this.setData({
      acttags: e.detail.value
    })
  },
  actPositionChange(e) {
    this.setData({
      position: e.detail.value
    })
  },
  actrTimeChange(e) {
    this.setData({
      signDown_rtime: e.detail.value
    })
  },
  actsTimeChange(e) {
    this.setData({
      signUp_stime: e.detail.value
    })
  },
  NameChange(e) {
    this.setData({
      act_name: e.detail.value,
    })
  },
  NumberChange(e) {
    this.setData({
      act_number: e.detail.value,
      'list.allow_total': e.detail.value
    })
  },
  TypeChange(e) {
    this.setData({
      typeStr: e.detail.value
    })
    if(this.data.type[this.data.typeStr] == '体育'){
      this.setData({
        mapDisabled: false
      })
    }else{
      this.setData({
        mapDisabled: true
      })
    }
  },
  StartTimeChange(e) {
    this.setData({
      start_time: e.detail.value
    })
  },
  EndTimeChange(e) {
    this.setData({
      end_time: e.detail.value
    })
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  signDateChange(e) {
    this.setData({
      signDate: e.detail.value
    })
  },
  stopDateChange(e) {
    this.setData({
      stopDate: e.detail.value
    })
  },
  getAlltype(){
    let self = this
    let app = getApp()
    let temp = []
    let t = []
    if (app.globalData.token == null) {
      self.data.head = {      
        'content-type': 'application/json'
      }
    } else {
      self.data.head = {      
        'content-type': 'application/json',
        'Authorization': 'Token ' + app.globalData.token
      }
    }
    wx.request({
      url: getApp().globalData.baseUrl + '/api/activity_types/',
      method: 'GET',
      data: {

      },
      header: this.data.head,
      success (res) {
        temp= res.data.filter(x=> x.name!='博雅')
        for(let i=0;i<temp.length;i++){
          t.push(temp[i].name)
        }
        self.setData({
          type: t
        })
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      }
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths),
            'list.photo': res.tempFilePaths
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths,
            haveimg: 1
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '亲爱的用户',
      content: '确定要删除这张介绍图吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList,
            haveimg: null
          })
        }
      }
    })
  },
  
  // 提交信息
  submit: function() {
    let app = getApp()
    let Mydate = this.data.date.replace(/-/g, '/')
    let Sdate = this.data.signDate.replace(/-/g, '/')
    let Rdate = this.data.stopDate.replace(/-/g, '/')
    // 
    let start_enrollment_time_para = this.data.signDate.replace(/-/g, ' ').replace(/:/g, ' ').split(' ')
    
    var dateSign = new Date(start_enrollment_time_para[0], start_enrollment_time_para[1] - 1,
      start_enrollment_time_para[2], '00', '00', '00')
    //
    start_enrollment_time_para = this.data.stopDate.replace(/-/g, ' ').replace(/:/g, ' ').split(' ') 
    
    var dateStop = new Date(start_enrollment_time_para[0], start_enrollment_time_para[1] - 1,
      start_enrollment_time_para[2], '00', '00', '00')
    //
    start_enrollment_time_para = this.data.date.replace(/-/g, ' ').replace(/:/g, ' ').split(' ') 
    
    var dateStart = new Date(start_enrollment_time_para[0], start_enrollment_time_para[1] - 1,
      start_enrollment_time_para[2], '00', '00', '00')
    let temp = this.data.date + ' ' + this.data.start_time
    start_enrollment_time_para = temp.replace(/-/g, ' ').replace(/:/g, ' ').split(' ') 
    var actS = new Date(start_enrollment_time_para[0], start_enrollment_time_para[1] - 1,
      start_enrollment_time_para[2], start_enrollment_time_para[3], start_enrollment_time_para[4], '00')
      
    temp = this.data.date + ' ' + this.data.end_time
    start_enrollment_time_para = temp.replace(/-/g, ' ').replace(/:/g, ' ').split(' ')
    var actE = new Date(start_enrollment_time_para[0], start_enrollment_time_para[1] - 1,
      start_enrollment_time_para[2], start_enrollment_time_para[3], start_enrollment_time_para[4], '00')
    // 
    // 
    if (dateSign > dateStop) {
      wx.showModal({
        title: '提示',
        content: '活动开始报名时间不能晚于活动结束报名时间',
        showCancel: false
      })
    } else if (dateStop >= dateStart) {
      wx.showModal({
        title: '提示',
        content: '活动开始时间必须晚于结束报名时间',
        showCancel: false
      })
    } else if (actE <= actS) {
      wx.showModal({
        title: '提示',
        content: '活动开始时间必须早于活动结束时间',
        showCancel: false
      })
    } else if (this.data.act_name == null || this.data.act_name.length == 0) {
      wx.showModal({
        title: '提示',
        content: '没有设置活动名称',
        showCancel: false
      })
    }  else if (this.data.index == null) {
      wx.showModal({
        title: '提示',
        content: '没有选择校区',
        showCancel: false
      })
    } else if (this.data.act_number == null || this.data.act_number.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请设置活动人数限制',
        showCancel: false
      })
    }else if (this.data.act_number <= 0) {
      wx.showModal({
        title: '提示',
        content: '活动人数需为大于0的正整数',
        showCancel: falsez
      })
    }  else if (this.data.act_number >= 2001) {
      wx.showModal({
        title: '提示',
        content: '活动人数不能超过2000',
        showCancel: false
      })
    }else if(this.data.position == null || this.data.position.length == 0){
      wx.showModal({
        title: '提示',
        content: '请设置活动具体地点',
        showCancel: false
      })
    } else if (this.data.typeStr == null) {
      wx.showModal({
        title: '提示',
        content: '请设置活动类别',
        showCancel: false
      })
    } else if (this.data.haveimg == null) {
      wx.showModal({
        title: '提示',
        content: '请上传活动照片',
        showCancel: false
      })
    } else if (this.data.textareaValue.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入活动简介',
        showCancel: false
      })
    } else if (this.data.act_name.length >= 51) {
      wx.showModal({
        title: '提示',
        content: '活动名称不能超过50个字符',
        showCancel: false
      })
    } else if (this.data.type[this.data.typeStr] == '体育' && (this.data.longitude == null || this.data.latitude == null)) {
      wx.showModal({
        title: '提示',
        content: '运动类活动请进行选点',
        showCancel: false
      })
    } else if (this.data.longitude == null || this.data.latitude == null) {
      this.setData({
        'list.longitude': '',
        'list.latitude': '',
        'list.name': this.data.act_name,
        'list.start_enrollment_at': Sdate + ' 0:00',
        'list.end_enrollment_at': Rdate + ' 23:59',
        'list.activity_type': this.data.type[this.data.typeStr],
        'list.photo': this.data.imgList,
        'list.start_at': Mydate + ' ' + this.data.start_time,
        'list.end_at': Mydate + ' ' + this.data.end_time,
        'list.position': this.data.position,
        'list.tags': this.data.acttags
      })
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
    } else {
      this.setData({
        'list.longitude': this.data.longitude,
        'list.latitude': this.data.latitude,
        'list.name': this.data.act_name,
        'list.start_enrollment_at': Sdate + ' 0:00',
        'list.end_enrollment_at': Rdate + ' 23:59',
        'list.activity_type': this.data.type[this.data.typeStr],
        'list.photo': this.data.imgList,
        'list.start_at': Mydate + ' ' + this.data.start_time,
        'list.end_at': Mydate + ' ' + this.data.end_time,
        'list.position': this.data.position,
        'list.tags': this.data.acttags
      })
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
    wx.uploadFile({    
      header: self.data.head,
      url: getApp().globalData.baseUrl + '/api/activities/', //接口名称
      filePath: self.data.imgList[0],
      name:'photo',   
      // header: self.data.head,
      formData: self.data.list, 
       success(res) {     
         if(res.statusCode == 201){
           wx.navigateTo({
             url: '../../actList/actList?type=5',
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

  textareaAInput(e) {
    this.setData({
      textareaValue: e.detail.value,
      'list.description': e.detail.value
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    //this.tabBar();
    //console.log("call onshow()")
    //console.log(this.data.choosePlace)
    this.getAlltype()
    this.getTabBar().init();
    getApp().getNotificationCount()
    const location1 = chooseLocation.getLocation();
    if (location1 && this.data.choosePlace) {
      this.setData({
        location: location1.address,
        latitude: location1.latitude,
        longitude: location1.longitude
      })
    }
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
  },
  reset:function() {
    let nowTime = new Date()
    this.setData({
      longitude: null,
      latitude: null,
      stime: null,
      rtime: null,
      act_name: null,
      act_number: null,
      choosePlace: false,
      acttags: '',
      date: nowTime.getFullYear() + '-' + (nowTime.getMonth()+1<10?'0' + (nowTime.getMonth()+1):(nowTime.getMonth()+1)) 
      + '-' + (nowTime.getDate()<10?'0' + nowTime.getDate():nowTime.getDate()),
      signDate: nowTime.getFullYear() + '-' + (nowTime.getMonth()+1<10?'0' + (nowTime.getMonth()+1):(nowTime.getMonth()+1)) 
      + '-' + (nowTime.getDate()<10?'0' + nowTime.getDate():nowTime.getDate()),
      stopDate: nowTime.getFullYear() + '-' + (nowTime.getMonth()+1<10?'0' + (nowTime.getMonth()+1):(nowTime.getMonth()+1)) 
      + '-' + (nowTime.getDate()<10?'0' + nowTime.getDate():nowTime.getDate()),
      
      location:'选择运动类活动地点',
      index: null,
      typeStr: null,
      start_time: '12:00',
      end_time: '12:00',
      signUp_stime: null,
      signDown_rtime: null,
      imgList: [],
      haveimg: null,
      modalName: null,
      textareaValue: '',
      position: null
    })
    
  },

  /*tabBar(){
    if(typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setData({
        selected:2
      })
    }
  },*/
  
  onClick: function () {
    const key = '6QIBZ-MEA63-GAZ3S-3AHGH-MJPXJ-3FB5S'; //使用在腾讯位置服务申请的key
    const referer = 'asr-fri-1'; //调用插件的app的名称
    const location = JSON.stringify({
      latitude: 39.89631551,
      longitude: 116.323459711
    });
    this.setData({
      choosePlace: true
    })
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}`
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})