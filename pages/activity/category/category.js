// pages/activity/category/category.js
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
  },

  getCategories: function () {
    var that = this
    var headers = {}
    if (getApp().globalData.token != null) {
      headers = {
        Authorization: 'Token ' + getApp().globalData.token
      }
      wx.request({
        url: 'https://se.alangy.net/api/activity_types_user_list/',
        method: 'GET',
        header: headers,
        success (res) {
          that.setData({
            categories: res.data
          })
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        }
      })
    } else {
      wx.request({
        url: getApp().globalData.baseUrl + '/activity_types_list/',
        method: 'GET',
        success (res) {
          that.setData({
            categories: res.data
          })
        },
        fail (res) {
          getApp().globalData.util.netErrorToast()
        }
      })
    }
    
  },

  subscribe: function (event) {
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
      var id = event.currentTarget.dataset.id
      var that = this
      var headers = {}
      if (getApp().globalData.token != null) {
        headers = {
          Authorization: 'Token ' + getApp().globalData.token
        }
      }
      wx.request({
        url: 'https://se.alangy.net/api/subscribe',
        method: 'POST',
        data: {
          activity_type_id: id
        },
        header: headers,
        success (res) {
          
          that.getCategories()
          wx.showToast({
            title: '订阅成功',
          })
        },
        fail(res){
          getApp().globalData.util.netErrorToast()
        }
      })
    }
  },

  undoSubscribe: function (event) {
    var id = event.currentTarget.dataset.id
    var that = this
    var headers = {}
    if (getApp().globalData.token != null) {
      headers = {
        Authorization: 'Token ' + getApp().globalData.token
      }
    }
    wx.request({
      url: 'https://se.alangy.net/api/unsubscribe',
      method: 'POST',
      data: {
        activity_type_id: id
      },
      header: headers,
      success (res) {
        
        that.getCategories()
        wx.showToast({
          title: '取消订阅成功',
        })
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  routeActivities: function (event) {
    var id = event.currentTarget.dataset.id
    // 
    wx.navigateTo({
      url: '../../actList/actList?type=6&id=' + id,
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
    this.getTabBar().init();
    getApp().getNotificationCount()
    this.getCategories()
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