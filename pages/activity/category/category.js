// pages/activity/category/category.js
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    /*categories0: [
      {
        id:0,
        name:"博雅",
        icon: "../../../img/profile2.jpg"
      },
      {
        id:1,
        name:"运动",
        icon: "../../../img/profile2.jpg"
      },
      {
        id:2,
        name:"讲座",
        icon: "../../../img/profile2.jpg"
      }
    ],
    categories1: [
      {
        id:0,
        content:"取件",
        icon: "../../../img/profile1.jpg"
      },
      {
        id:1,
        content:"带饭",
        icon: "../../../img/profile1.jpg"
      },
      {
        id:2,
        content:"二手",
        icon: "../../../img/profile1.jpg"
      },
      {
        id:3,
        content:"离谱",
        icon: "../../../img/profile1.jpg"
      }
    ],
    categories2: [
      {
        id:0,
        content:"选课",
        icon: "../../../img/profile3.jpg"
      },
      {
        id:1,
        content:"生活",
        icon: "../../../img/profile3.jpg"
      },
      {
        id:2,
        content:"交友",
        icon: "../../../img/profile3.jpg"
      }
    ],*/
    menu:[
      {
        id:0,
        content:"活动"
      },
      {
        id:1,
        content:"委托"
      },
      {
        id:2,
        content:"话题"
      }
    ],
    activeID:0
  },

  getCateList() {
    var that = this
    var headers = {}
    if (getApp().globalData.token != null) {
      headers = {
        Authorization: 'Token ' + getApp().globalData.token
      }
    }
    if (this.data.activeID === 0) {
      wx.request({
        url: getApp().globalData.baseUrl + '/api/activity_types_list/',
        method:'GET',
        header:headers,
        success(res) {
          that.setData({
            categories: res.data
          })
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
    } else if (this.data.activeID === 1) {
      wx.request({
        url:  getApp().globalData.baseUrl + '/api/commission/sort/',
        method:'GET',
        header:headers,
        success(res) {
          that.setData({
            categories: res.data
          })
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
    } else if (this.data.activeID === 2) {
      wx.request({
        url:  getApp().globalData.baseUrl + '/api/topic_types/',
        method:'GET',
        header:headers,
        success(res) {
          that.setData({
            categories: res.data
          })
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
    }
  },

  changeActiveId(event) {
    var that = this
    that.setData({
      activeID: event.detail
    })
    this.getCateList()
    // if (this.data.activeID === 0) {
    //   that.setData({
    //     categories: this.data.categories0
    //   })
    // } else if (this.data.activeID === 1) {
    //   that.setData({
    //     categories: this.data.categories1
    //   })
    // } else if (this.data.activeID === 2){
    //   that.setData({
    //     categories: this.data.categories2
    //   })
    // }
  },

  jumpToList(event) {
    let id = event.currentTarget.dataset.id
    if (this.data.activeID === 0) {
      wx.navigateTo({
        url: '../../actList/actList?id=' + id + '&type=6',
      })
    } else if (this.data.activeID === 1) {
      wx.navigateTo({
        url: '../../wtList/wtList?sort=' + id + '&type=3',
      })
    } else if (this.data.activeID === 2){
      wx.navigateTo({
        url: '../../htList/htList?sort=' + id + '&type=2',
      })
    }
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
    this.setData({
      categories: this.data.categories0
    })
    this.getCateList()
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