// pages/activity/home/search/search.js
import Dialog from '../../../../miniprogram_npm/@vant/weapp/dialog/dialog'
const util = require('../../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotSearchList:[
    {
      id: 0,
      keyword: "热搜一"
    }, {
      id: 1,
      keyword: "热搜二"
    }, {
      id: 2,
      keyword: "热搜三"
    }, {
      id: 3,
      keyword: "热搜四"
    }, {
      id: 4,
      keyword: "热搜五"
    }, {
      id: 5,
      keyword: "热搜六"
    }
  ],
    
    //这个列表仅显示前20条历史记录
    historySearchList:[
    {
      id: 0,
      keyword: "热搜1"
    }, {
      id: 1,
      keyword: "热搜2"
    }, {
      id: 2,
      keyword: "热搜3"
    }, {
      id: 3,
      keyword: "热搜4"
    }, {
      id: 4,
      keyword: "热搜5"
    }, {
      id: 5,
      keyword: "热搜6"
    }
  ],

    //这个列表用于保存完整的历史记录
    historySearchListAll:[],

    categorySearchList:[
    { // 活动相关
      id: 0,
      type: "活动",
      subkind: [
        {
          id: 0,
          name: "博雅"
        }, {
          id: 1,
          name: "运动"
        }, {
          id: 2,
          name: "志愿"
        }, {
          id: 3,
          name: "学术讲座"
        }
      ]
    }, { // 委托相关
      id: 1,
      type: "委托",
      subkind: [
        {
        id: 0,
        name: "取快递"
      }, {
        id: 1,
        name: "取外卖"
      }, {
        id: 2,
        name: "其他"
      }]
    }, { // 话题相关
        id: 2,
        type: "话题",
        subkind: [
        {
          id: 0,
          name: "选课"
        }, {
          id: 1,
          name: "运动"
        }, {
          id: 2,
          name: "志愿"
        }, {
          id: 3,
          name: "生活服务"
        }, {
          id: 4,
          name: "其他"
        }]
      }
  ],

    //请求头
    head: null,
    //历史搜索是否显示取消按钮，初始全为false
    cancelable: [],
    //空搜索
    searchError: false
  },

  //点击取消，回到上个页面
  onCancel: function(){
    wx.navigateBack({
      delta: 0,
    })
  },

  //与后端通信，获取热搜信息
  getHotSearchList: function(){
    //获取前六条
    let self = this
    let app = getApp()
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
      url: getApp().globalData.baseUrl + '/api/search_trending/',
      method: 'POST',
      data: {

      },
      header: this.data.head,
      success (res) {
        
        /*self.setData({
          hotSearchList: res.data.slice(0, 6)
        })*/
        let tmpList = res.data
        let resList = []
        for(let i = 0; i< tmpList.length; i++){
          resList.push({id: i, keyword: tmpList[i].keyword})
        }
        self.setData({
          hotSearchList: resList.filter(x => !util.strIsEmpty(x.keyword)).slice(0, 6)
        })
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  //清空历史搜索
  clearHistorySearch(){
    let self = this
    let keywordList = []
    for(let i = 0; i < this.data.historySearchListAll.length; i++){
      keywordList.push(this.data.historySearchListAll[i].keyword)
    }
    
    Dialog.confirm({
      message: '确定要清空历史记录吗？',
    })
      .then(() => {
        // on confirm
        let app = getApp()
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
          url: getApp().globalData.baseUrl + '/api/search/',
          method: 'POST',
          data: {
            'name': keywordList,
          },
          header: self.data.head,
          success (res) {
            if(res.statusCode == 204){
              self.getHistorySearchList()
            }else if(res.statusCode == 404){
              wx.showToast({
                title: '该用户不存在',
                icon: 'error'
              })
            }else{
              wx.showToast({
                title: '操作失败',
                icon: 'error'
              })
            }
          },
          fail(res){
            getApp().globalData.util.netErrorToast()
          }
        })
      })
      .catch(() => {
        // on cancel
      });
  },

  //长按历史搜索标签可出现取消按钮
  canCancel(event){
    let index = event.currentTarget.dataset.index
    let tempList = []
    for(let i = 0; i< 20; i++){
      tempList.push(false)
    }
    tempList[index] = true
    this.setData({
      cancelable: tempList
    })
    
  },

  deleteHistorySearch(event){
    let self = this
    Dialog.confirm({
      message: '确定要删除这条历史搜索记录吗？',
    })
      .then(() => {
        // on confirm
        let keyword = event.currentTarget.dataset.keyword
        let app = getApp()
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
          url: getApp().globalData.baseUrl + '/api/search/',
          method: 'POST',
          data: {
            'name': [keyword]
          },
          header: self.data.head,
          success (res) {
            if(res.statusCode == 204){
              self.getHistorySearchList()
            }else if(res.statusCode == 404){
              wx.showToast({
                title: '该用户不存在',
                icon: 'error'
              })
            }else{
              wx.showToast({
                title: '操作失败',
                icon: 'error'
              })
            }
          },
          fail(res){
            getApp().globalData.util.netErrorToast()
          }
        })
      })
      .catch(() => {
        // on cancel
        let index = event.currentTarget.dataset.index
        let tempList = self.data.cancelable
        tempList[index] = false
        self.setData({
          cancelable: tempList
        })
      });
  },

  //获取历史搜索列表
  getHistorySearchList(){
    //初始化cancelable
    let tempList = []
    for(let i = 0; i< 20; i++){
      tempList.push(false)
    }
    this.setData({
      cancelable: tempList
    })
    let app = getApp()
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
    wx.request({
      url: getApp().globalData.baseUrl + '/api/search_history/',
      method: 'POST',
      data: {

      },
      header: this.data.head,
      success (res) {
        if(res.statusCode == 200){
          self.setData({
            historySearchList: res.data.reverse().filter(x => !util.strIsEmpty(x.keyword)).slice(0, 20),
            historySearchListAll: res.data
          })
        }
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  //将关键词传值到活动列表
  onSearch(event){
    //空输入报错
    if(event.detail == ''){
      this.setData({
        searchError: true
      })
    }else{
      
    wx.navigateTo({
      url: '../../../actList/actList?keywords='+ event.detail
    })
    }
  },

  //将关键词传值到活动列表
  onSearchActivity(event){
    //空输入报错
    if(event.detail == ''){
      this.setData({
        searchError: true
      })
    }else{
      
    wx.navigateTo({
      url: '../../../actList/actList?keywords='+ event.detail
    })
    }
  },

  //将关键词传值到委托列表
  onSearchWt(event){
    //空输入报错
    if(event.detail == ''){
      this.setData({
        searchError: true
      })
    }else{
      
    wx.navigateTo({
      url: '../../../wtList/wtList?keywords='+ event.detail
    })
    }
  },

   //将关键词传值到话题列表
   onSearchTopic(event){
    //空输入报错
    if(event.detail == ''){
      this.setData({
        searchError: true
      })
    }else{
      
    wx.navigateTo({
      url: '../../../htList/htList?keywords='+ event.detail
    })
    }
  },

  //检测到关键词时取消报错
  hasKeyword(event){
    this.setData({
      searchError: false
    })
  },

  //将热搜、历史字段传值到活动列表
  tagSearch(event){
    let index = event.currentTarget.dataset.index
    
    if(index != undefined && this.data.cancelable[index] == true){
      this.deleteHistorySearch(event)
    }else{
      //let keyword = event.currentTarget.dataset.keyword
      wx.navigateTo({
        url: '../../../actList/actList?keywords='+ event.currentTarget.dataset.keyword
      })
    }
  },

  //将分类搜索的类别传到活动列表
  typeSearch(event){
    //let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../../actList/actList?type=6&id='+ event.currentTarget.dataset.id
    })
  },

  getCategorySearchList(){
    let self = this
    let app = getApp()
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
        //console.log(res.data)
        self.setData({
          categorySearchList: res.data
        })
        //console.log(res)
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
    // this.getHotSearchList()
    // this.getCategorySearchList()
    // this.getHistorySearchList()
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