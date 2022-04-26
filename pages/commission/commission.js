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
      if (this.data.commentStr.length == 0 || util.strIsEmpty(this.data.commentStr)) {
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
        method:"POST",  //请求方式    
        data: {
          commission_id: this.id,
          to_user_id: null,
          comment: self.data.commentStr
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
    let to_user_id = event.currentTarget.dataset.user_id
    let comment = self.data.commentStr
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
      if (this.data.commentStr.length == 0 || util.strIsEmpty(this.data.commentStr)) {
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
        method:"POST",  //请求方式    
        data: {
          commission_id: this.id,
          to_user_id: this.to_user_id,
          comment: self.data.commentStr
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

  onTapUserName() {
    let userid = this.user_id
    wx.navigateTo({
      url: '../../profile/profile?id=' + userid,
    })
  },

  getDetail: function() {
    let app = getApp()
    let head = {}
    let temp_list_attend=[]
    let temp_list_create=[]
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
      method:"POST",  //请求方式    
      //data: app.globalData.zdxx,  //用于存放post请求的参数  
      data: {
        //TODO
        'commission_id': this.id,
      }, 
      success(res) { 
        console.log(res.data)
        for(let i = 0; i < res.data.length; i++){
          temp_list_attend.push(res.data[i].id)
        }
        wx.request({    
          url: getApp().globalData.baseUrl + '/api/condition/activities/', //接口名称   
          header: head,
          method:"POST",  //请求方式    
          //data: app.globalData.zdxx,  //用于存放post请求的参数  
          data: {
            'user_create':true,
            'audit_status': [3]
          }, 
          success(res) { 
            for(let i = 0; i < res.data.length; i++){
              temp_list_create.push(res.data[i].id)
            }
            wx.request({    
              url: getApp().globalData.baseUrl + `/api/activities/${self.data.id}/`, //接口名称   
              header: head,
              method:"GET",  //请求方式    
              //data: app.globalData.zdxx,  //用于存放post请求的参数   
              success(res) {
                if(res.statusCode == 200){
                  let inArr = 0
                  for(let i = 0; i<temp_list_attend.length; i++){
                    if(temp_list_attend[i] == res.data.id){
                      inArr = 1
                      break
                    }
                  }
                  if(inArr == 0){
                    self.setData({
                      choosed: false
                    })
                  }else{
                    self.setData({
                      choosed: true
                    })
                  }
                  inArr = 0
                  for(let i = 0; i<temp_list_create.length; i++){
                    if(temp_list_create[i] == res.data.id){
                      inArr = 1
                      break
                    }
                  }
                  if(inArr == 1){
                    self.setData({
                      type: 5
                    })
                  }
                  self.setData({
                    activity: res.data,
                    'swiperList[0].url': res.data.photo == ''?'../../../static/img/nophoto.jpg':getApp().globalData.baseUrl + '/' + res.data.photo,
                    rate: res.data.remark
                  })
                  //评论弹窗控制 初始化commentShow
                  let tempList = []
                  for(let i = 0; i<= res.data.comment.length; i++){
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
                  if(now_time > end_time && self.data.choosed == true && self.data.type != 5){
                    self.setData({
                      type: 4
                    })
                  }
                  if(now_time < start_time && self.data.type == 5){
                    self.setData({
                      fixed: true
                    })
                  }
                  self.setData({
                    actEnded: (now_time > end_time)
                  })
                }else if(res.statusCode == 404){
                  wx.showToast({
                    title: '该活动不存在',
                    icon: 'error'
                  })
                }else{
                  wx.showToast({
                    title: '活动获取异常',
                    icon: 'error'
                  })
                }
              },
              fail(res){
                getApp().globalData.util.netErrorToast()
              }
            })
          },
          fail(res){
            getApp().globalData.util.netErrorToast()
          }
        })
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      }
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