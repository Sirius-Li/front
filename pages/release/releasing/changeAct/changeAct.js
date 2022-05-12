const app = getApp();
const chooseLocation = requirePlugin('chooseLocation');
Page({
  data: {
    head : {},
    active_id: null,
    stime: '2021/1/1 10:00',
    rtime: '2021/3/1 10:00',
    act_name: null,
    act_number: 0,
    getActive: [],
    position: '',
    signDate: '',
    stopDate: '',
    list :{
      "start_at": '', //1
      "end_at": '', //1 
      "description": '', //1
      "allow_total": 0, // 1
      "name":'?', //1
      "activity_type": 'name', //1
      "start_enrollment_at":'', //1
      "end_enrollment_at":'', //1
      "location":1,
      "position":'',
    },
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null,
    typeStr: null,
    typetemp: null,
    picker: ['学院路', '沙河', '校外'],
    type: [],
    start_time: '7:00',
    end_time: '23:59',
    signUp_stime: null,
    signDown_rtime: null,
    date: '2018-12-25',
    region: ['广东省', '广州市', '海珠区'],
    imgList: [],
    modalName: null,
    textareaValue: '',
    //是否选择了地图地点
    choosePlace: false,
    //当前选择的地图地点
    location: '选择运动类活动地点',
    //经纬度
    longitude:null,
    latitude:null,
    //地图选点按钮禁用
    mapDisabled: true,
    //存档标记
    got: false
  },
  PickerChange(e) {
    this.setData({
      index: e.detail.value
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
  actPositionChange(e) {
    this.setData({
      position: e.detail.value
    })
  },
  NameChange(e) {
    this.setData({
      act_name: e.detail.value,
    })
  },
  NumberChange(e) {
    this.setData({
      act_number: e.detail.value
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
  stopDateChange(e) {
    this.setData({
      stopDate: e.detail.value
    })
  },
  signDateChange(e) {
    this.setData({
      signDate: e.detail.value
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
        self.getChange()
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      }
    })
  },
  
  textareaAInput(e) {
    this.setData({
      textareaValue: e.detail.value
    })
  },

  //修改经纬度
  onClick: function () {
    const key = '6QIBZ-MEA63-GAZ3S-3AHGH-MJPXJ-3FB5S'; //使用在腾讯位置服务申请的key
    const referer = 'asr-fri-1'; //调用插件的app的名称
    let location = JSON.stringify({
      latitude: 39.89631551,
      longitude: 116.323459711
    });
    if(this.data.longitude != null && this.data.latitude != null){
      location = JSON.stringify({
        latitude: this.data.latitude,
        longitude: this.data.longitude
      });
    }
    this.setData({
      choosePlace: true
    })
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}`
    });
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
            imgList: res.tempFilePaths
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
      content: '确定要删除这张介绍图吗吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  copymessage:function() {
    let start = this.data.getActive.normal_activity.start_at
    let end = this.data.getActive.normal_activity.end_at
    let dd, stdd, rtdd
    if(start == undefined && end == undefined){
      dd = this.data.date
      stdd = this.data.start_time
      rtdd = this.data.end_time
    }else if(start == undefined && end != undefined){
      dd = end.split(' ')[0].replace(/\//g, "-")
      stdd = this.data.start_time
      rtdd = end.split(' ')[1]
    }else if(start != undefined && end == undefined){
      dd = start.split(' ')[0].replace(/\//g, "-")
      stdd = start.split(' ')[1]
      rtdd = this.data.end_time
    }else{
      dd = start.split(' ')[0].replace(/\//g, "-")
      stdd = start.split(' ')[1]
      rtdd = end.split(' ')[1]
    }
    /*let ddd = this.data.getActive.normal_activity.start_at.split(' ')
    let fff = this.data.getActive.normal_activity.end_at.split(' ')
    let dd = ddd[0].replace(/\//g, "-")
    let stdd = ddd[1]
    let rtdd = fff[1]*/
    //console.log(this.data.getActive.activity_type.name)
    //console.log(this.data.getActive.longitude)
    this.setData({
      act_name: this.data.getActive.name,
      signUp_stime: this.data.getActive.start_enrollment_at,
      signDown_rtime: this.data.getActive.end_enrollment_at,
      signDate: this.data.getActive.start_enrollment_at.split(' ')[0].replace(/\//g, '-'),
      stopDate: this.data.getActive.end_enrollment_at.split(' ')[0].replace(/\//g, '-'),
      typetemp: this.data.getActive.activity_type.name,
      imgList: this.data.getActive.photo,
      date: dd,
      start_time: stdd,
      end_time: rtdd,
      index: this.data.getActive.location - 1,
      textareaValue: this.data.getActive.normal_activity.description,
      act_number: this.data.getActive.normal_activity.allow_total,
      position: this.data.getActive.position,
      longitude: this.data.getActive.longitude,
      latitude: this.data.getActive.latitude
    })
    for(let i=0;i<this.data.type.length;i++){
      if (this.data.type[i]==this.data.typetemp){
        this.setData({
          typeStr: i
        })
      }
    }
    if(this.data.type[this.data.typeStr] == '体育'){
      this.setData({
        mapDisabled: false
      })
    }else{
      this.setData({
        mapDisabled: true
      })
    }
    let self = this
    if(this.data.longitude != null && this.data.latitude != null){
      wx.request({
        url: 'https://apis.map.qq.com/ws/geocoder/v1/',
        method: 'GET',
        data: {
          'location': self.data.latitude + ',' + self.data.longitude,
          'key': 'SVYBZ-IMUKD-23D4M-PU46M-WMXIQ-MPFRZ',
        },
        success(res){
          if(res.statusCode == 200){
            //console.log(res)
            self.setData({
              location: res.data.result.address,
            })
          }else{
            wx.showToast({
              title: '位置获取失败',
              icon: 'error'
            })
          }
          self.setData({
            got: true
          })
          if (self.gotCallback){
            self.gotCallback(self.data.got);
          }
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
          self.setData({
            got: true
          })
          if (self.gotCallback){
            self.gotCallback(self.data.got);
          }
        }
      })
    }else{
      self.setData({
        got: true
      })
      if (self.gotCallback){
        self.gotCallback(self.data.got);
      }
    }
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
      })
    } else if (dateStop >= dateStart) {
      wx.showModal({
        title: '提示',
        content: '活动开始时间不能早于结束报名时间',
      })
    } else if (actE <= actS) {
      wx.showModal({
        title: '提示',
        content: '活动开始时间不能晚于活动结束时间',
      })
    } else if (this.data.act_name.length == 0) {
      wx.showModal({
        title: '提示',
        content: '没有设置活动名称',
        showCancel: false
      })
    } else if (this.data.act_number == null || this.data.act_number.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请设置活动人数限制',
        showCancel: false
      })
    } else if (this.data.act_number <= 0) {
      wx.showModal({
        title: '提示',
        content: '活动人数需为大于0的正整数',
        showCancel: false
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
    } else {
      this.setData({
        'list.name': this.data.act_name,
        'list.start_enrollment_at': Sdate + ' 0:00',
        'list.end_enrollment_at': Rdate + ' 23:59',
        'list.activity_type': this.data.type[this.data.typeStr],
        'list.photo': this.data.imgList,
        'list.start_at': Mydate + ' ' + this.data.start_time,
        'list.end_at': Mydate + ' ' + this.data.end_time,
        'list.location': parseInt(this.data.index) + 1,
        'list.description': this.data.textareaValue,
        'list.allow_total': this.data.act_number,
        'list.position':this.data.position,
      })
      if(this.data.type[this.data.typeStr] == '体育'){
        this.setData({
          'list.longitude': this.data.longitude,
          'list.latitude': this.data.latitude
        })
      }
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
      console.log(self.data.list)
      //console.log(self.data.list.activity_type)
      wx.request({    
        header: this.data.head,
        url: getApp().globalData.baseUrl + `/api/activities/${this.data.active_id}/`, //接口名称
        method: "PUT",
        //filePath: this.data.imgList[0],
        //name:'photo',   
        // header: this.data.head,
        data: this.data.list, 
        success(res) {     
          if(res.statusCode == 201){
            wx.redirectTo({
              url: '../../../actList/actList?type=5',
            })
            wx.showToast({
              title: '活动修改成功',
            })
            self.getChange()
          }else if(res.statusCode == 400){
            if(res.data === ''){
              wx.showToast({
                title: '活动修改失败',
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
                title: '活动修改失败',
              })
          }
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        }
      })
    }
  },
  getChange: function() {
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
      url: getApp().globalData.baseUrl + `/api/activities/${self.data.active_id}/`,
      header: head,
      method:"GET",  //请求方式   
      success(res) {     
        console.log(res.data)
        self.data.getActive = res.data 
        self.copymessage()
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      active_id: options.id
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
    this.tabBar();
    if(!this.data.got){
      this.getAlltype()
    }
    if (this.data.got == false) {
      //callback
      this.gotCallback = (got) => {
        if (got) {
          this.locationUpdate()
        }
      }
    } else {
      this.locationUpdate()
    }
  },

  //位置更新
  locationUpdate(){
    let self = this
    const location1 = chooseLocation.getLocation();
    //根据是否获取到了地图地点首先更新choosePlace
    if (location1 && self.data.choosePlace) {
      self.setData({
        location: location1.address,
        latitude: location1.latitude,
        longitude: location1.longitude
      })
    }
  },

  tabBar(){
    if(typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setData({
        selected:2
      })
    }
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