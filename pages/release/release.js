// pages/release/release.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    

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
    this.getTabBar().init();
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

  },



  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function () {
  //   //this.tabBar();
  //   //console.log("call onshow()")
  //   //console.log(this.data.choosePlace)
  //   this.getAlltype()
  //   this.getTabBar().init();
  //   getApp().getNotificationCount()
  //   const location1 = chooseLocation.getLocation();
  //   if (location1 && this.data.choosePlace) {
  //     this.setData({
  //       location: location1.address,
  //       latitude: location1.latitude,
  //       longitude: location1.longitude
  //     })
  //   }
  //   if(getApp().globalData.user_status == 2){
  //     wx.redirectTo({
  //       url: '../../certification/certification',
  //     })
  //   }else if(getApp().globalData.user_status == 1){
  //     wx.switchTab({
  //       url: '../home/home',
  //       success(res){
  //         wx.showToast({
  //           title: '用户还在认证中',
  //           icon: 'error'
  //         })
  //       }
  //     })
  //   }
  // },
  // reset:function() {
  //   let nowTime = new Date()
  //   this.setData({
  //     longitude: null,
  //     latitude: null,
  //     stime: null,
  //     rtime: null,
  //     act_name: null,
  //     act_number: null,
  //     choosePlace: false,
  //     acttags: '',
  //     date: nowTime.getFullYear() + '-' + (nowTime.getMonth()+1<10?'0' + (nowTime.getMonth()+1):(nowTime.getMonth()+1)) 
  //     + '-' + (nowTime.getDate()<10?'0' + nowTime.getDate():nowTime.getDate()),
  //     signDate: nowTime.getFullYear() + '-' + (nowTime.getMonth()+1<10?'0' + (nowTime.getMonth()+1):(nowTime.getMonth()+1)) 
  //     + '-' + (nowTime.getDate()<10?'0' + nowTime.getDate():nowTime.getDate()),
  //     stopDate: nowTime.getFullYear() + '-' + (nowTime.getMonth()+1<10?'0' + (nowTime.getMonth()+1):(nowTime.getMonth()+1)) 
  //     + '-' + (nowTime.getDate()<10?'0' + nowTime.getDate():nowTime.getDate()),
      
  //     location:'选择运动类活动地点',
  //     index: null,
  //     typeStr: null,
  //     start_time: '12:00',
  //     end_time: '12:00',
  //     signUp_stime: null,
  //     signDown_rtime: null,
  //     imgList: [],
  //     haveimg: null,
  //     modalName: null,
  //     textareaValue: '',
  //     position: null
  //   })
    
  // },

  // /*tabBar(){
  //   if(typeof this.getTabBar === 'function' && this.getTabBar()){
  //     this.getTabBar().setData({
  //       selected:2
  //     })
  //   }
  // },*/
  
  // onClick: function () {
  //   const key = '6QIBZ-MEA63-GAZ3S-3AHGH-MJPXJ-3FB5S'; //使用在腾讯位置服务申请的key
  //   const referer = 'asr-fri-1'; //调用插件的app的名称
  //   const location = JSON.stringify({
  //     latitude: 39.89631551,
  //     longitude: 116.323459711
  //   });
  //   this.setData({
  //     choosePlace: true
  //   })
  //   wx.navigateTo({
  //     url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}`
  //   });
  // },
})