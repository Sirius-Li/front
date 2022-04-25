// pages/commission/commission.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户姓名
    username: 'username',
    //用户图片
    userAvatarUrl: '',
    // 委托id
    id: '',
    // 委托类型
    commission_type_id: '',
    //委托名称
    name: 'commissionname',
    start_time: '2022-4-12',
    end_time: '2022-4-12',
    create_at: '2022-4-12',
    updated_at: '2022-4-12',
    //实时性
    real_time: '',
    // 用户id
    user_id: 'id1',
    //位置
    location: '1',
    //状态
    status: '3',
    //详细描述
    description: "正值青春脑子灵，\n 哪有时间儿女情。\n 献身航空与航天，\n 单身十年笑盈盈。",
    //审核状态
    audit: '',
    //费用
    fee: '198',
    //评论
    comments: [
      {
        "user":{
            "user_id":'id1',
            "name":'name1'
        },
        "to_user":{
            "user_id":'id2',
            "name":'name2'
        },
        "content": 'text',
        "comment_time":'2022-4-1',
      }
    ],
    
    //一些控制变量
    commentShow: [],
    commentStr: null,
    myUserId: 'id1'
  },

  catchCommmission() {
    //TODO
    //接取委托
  },

  changeCommission() {
    //TODO
    //修改委托
    // 跳转到发布的子组件？？
    wx.navigateTo({
      url: '',
    })
  },

   Evaluate() {
    wx.showModal({
      title: "评价",
      placeholderText: "请输入您的评价",
      showCancel: true,
      editable: true,
      success: (res) => {
        var evaluate = res.content;
        if (res.confirm) {
          //TODO
          //提交到后端
          console.log(evaluate);
        }
      },
    });
  },

  showModal(event) {
    if(getApp().globalData.user_status == 2){
      wx.navigateTo({
        url: '../../certification/certification',
      })
    }else if(getApp().globalData.user_status == 1){
      wx.showToast({
        title: '用户还在认证中',
        icon: 'error'
      })
    }else{
      let index =  event.currentTarget.dataset.index
      let tempList = []
      for(let i = 0; i<= this.data.commentShow.length; i++){
        tempList.push(false)
      }
      tempList[index + 1] = true
      this.setData({
        commentShow: tempList
      })
    }
  },

  hideModal(event) {
    let index =  event.currentTarget.dataset.index
    let tempList = this.data.commentShow
    tempList[index + 1] = false
    this.setData({
      commentShow: tempList
    })
    this.reset()
  },

  reset: function() {
    this.setData({
      commentStr: null
    })
  },

  setValue(event) {
    this.setData({
      commentStr: event.detail.value
    });
  },

  submitCom() {
    //TODO
    if(getApp().globalData.user_status == 2){
      wx.navigateTo({
        url: '../../certification/certification',
      })
    }else if(getApp().globalData.user_status == 1){
      wx.showToast({
        title: '用户还在认证中',
        icon: 'error'
      })
    }else{
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
        method:"POST",  //请求方式    
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
        fail(res){
          getApp().globalData.util.netErrorToast()
        }
      })
      }
    }
  },

  resubmitCom(event) {
    let at_user_id = event.currentTarget.dataset.user_id
    let comment = self.data.commentStr
  },

  onTapUserName() {
    let userid = this.user_id
    wx.navigateTo({
      url: '../../profile/profile?id=' + userid,
    })
  },

  gotoUserPage(event) {
    //跳转到个人主页
    let userid = event.currentTarget.dataset.userid
    
    wx.navigateTo({
      url: '../../profile/profile?id=' + userid,
    })
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