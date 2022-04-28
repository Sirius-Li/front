import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
const util = require('../../utils/util')
Page({

  data: {
    rate: 5,
    value:'1',
    hide: 1,
    str: '',
    list: [],
    is_like:true,
    user_status: null,
    commentShow:[],
    ht:{
      id: 1111,
      ht_type_name: "选课",
      topic_type:{
        id:1,
        name:"课程"
      },
      name: "学院路计院大三选课",
      created_at: "2022/04/11 08:42",
      create_user:{
        id:"1",
        nickName:"ccc",
        avatarUrl:""
      },
      description: "6系大三下有什么好课可以选呢？",
      photo: "",		// 图片文件夹URL   
      like: 100,				// 点赞数
      follow: 100,				// 关注数
    },
    comment: [
    	{
        user:{
          id:2,
          nickName:"aaa",
          avatarUrl:"",
        },
        comment_content: "软工这门课真是太好了！",
        comment_time:"2022/04/27 15:47",
        to_user:{
          id:0,
          nickName:""
        },
        like: 10
      },
      {
        user:{
          id:3,
          nickName:"bbb",
          avatarUrl:"",
        },
        comment_content: "软工这门课真是太好了！",
        comment_time:"2022/04/27 15:50",
        to_user:{
          id:2,
          nickName:"aaa"
        },
        like: 9
      }
    ],
    //myUserId: getApp().globalData.myUserId
    myUserId:1111
  },
  onChange(event) {
    this.setData({
      rate: event.detail,
    });
  },
  onLoad(options) {
    //this.towerSwiper('swiperList');
    // 初始化towerSwiper 传已有的数组名即可
    this.setData({
      //id: options.id,
      //type: options.type,
      myUserId: getApp().globalData.myUserId
    })
    
    
  },
  
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
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
      url: 'https://se.alangy.net/api/condition/activities/', //接口名称 todo   
      header: head,
      method:"POST",  //请求方式    
      //data: app.globalData.zdxx,  //用于存放post请求的参数  
      data: {
        'user_attend':true,
        'audit_status': [3]
      }, 
      success(res) { 
        for(let i = 0; i < res.data.length; i++){
          temp_list_attend.push(res.data[i].id)
        }
        wx.request({    
          url: 'https://se.alangy.net/api/condition/activities/', //接口名称   
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
              url: `https://se.alangy.net/api/activities/${self.data.id}/`, //接口名称   
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
                    'swiperList[0].url': res.data.photo == ''?'../../../static/img/nophoto.jpg':getApp().globalData.baseUrl + res.data.photo,
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

  gotoFix(){
    wx.navigateTo({
      url: '../../activity/releasing/changeAct/changeAct?id='+this.data.id,
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

  },

  // 隐藏回复部分
  cancelHide: function() {
    this.setData({
      hide:0
    })
  },

  continueHide: function() {
    this.setData({
      hide:1
    })
  },
  

  // 储存评论
  setValue: function(e) {
    this.setData({
      str:e.detail.value
    })
  },

  reset: function() {
      this.setData({
        str: null
      })
  },

  submitCom: function() {
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
  resubmitCom: function(event) {
    let userid = event.currentTarget.dataset.userid
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
          url: 'https://se.alangy.net/api/comment/', //接口名称   
          header: head,
          method:"POST",  //请求方式    
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
          fail(res){
            getApp().globalData.util.netErrorToast()
          }
        })
      }
    }
    
  },
  showModal(e) {
    // if(getApp().globalData.user_status == 2){
    //   wx.navigateTo({
    //     url: '../certification/certification',
    //   })
    // }else if(getApp().globalData.user_status == 1){
    //   wx.showToast({
    //     title: '用户还在认证中',
    //     icon: 'error'
    //   })
    // }else{
    //   let index =  e.currentTarget.dataset.index
    //   let tempList = []
    //   for(let i = 0; i<= this.data.commentShow.length; i++){
    //     tempList.push(false)
    //   }
    //   tempList[index + 1] = true
    //   this.setData({
    //     commentShow: tempList
    //   })
    // }
    let index = e.currentTarget.dataset.index
    let tempList = []
    for(let i = 0; i <= this.data.commentShow.length; i++){
      tempList.push(false)
    }
    tempList[index+1] = true

    this.setData({
      commentShow: tempList
    })
  },
  hideModal(e) {
    let index =  e.currentTarget.dataset.index
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

  gotoUserPage(event){
    //跳转到个人主页
    let userid = event.currentTarget.dataset.userid
    
    wx.navigateTo({
      url: '../../profile/profile?id=' + userid,
    })
  },


  view(event){
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
          url: getApp().globalData.baseUrl +  `/api/comment/${commentId}/`,
          method: 'DELETE',
          header: getApp().getHeaderWithToken(),
          success (res) {
            that.getDetail()
            wx.showToast({
              title: '删除成功',
            })
          },
          fail (res) {
            getApp().globalData.util.netErrorToast()
          }
        })
      }).catch(() => {})
    } else {
      wx.showModal({
        title: '错误',
        content: '您没有删除该评论的权限',
        showCancel: false
      })
    }
  }
})