// pages/test/test.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    list: [],

    originList: [],
    showList: [],

    releasedWtList: [],

    appliedWtList: [],

    waitComfirmedWtList: [],

    finishedWtList: [],

    realTimeList: [],

    wtTypeList: [],

    statusOption: [
      { text: '全部状态', value: 'all' },
      { text: '已完成', value: 'finished' },
      { text: '未完成', value: 'unfinished' },
    ],
    feeOption: [
      { text: '金额', value: 'default' },
      { text: '由高到低', value: 'desc' },
      { text: '由低到高', value: 'asc' },
    ],
    locationOption: [
      { text: '全部校区', value: 'all' },
      { text: '学院路', value: 'xueyuanroad' },
      { text: '沙河', value: 'shahe' },
    ],
    selectType: 0,
    selectStatus: 'all',
    selectFee: 'default',
    selectLocation: 'all',

    //包括关键字 搜索栏输入关键字
    keywords: '',
    //id 当前用户id
    id: '',
    //type 不同界面进入标识符
    type: 2,
    //
    sort: '',
    status: '',
  },

  select: function (event) {
    // console.log("in select")
    // selectType: 0,
    // selectStatus: 'all',
    // selectFee: 'default',
    // selectLocation: 'all',
    let that = this
    let tmpList = [];
    that.setData({
      showList: that.data.originList
    })
    if (that.data.selectType != 0) {
      for (let i = 0; i < that.data.showList.length; i++) {
        if (that.data.showList[i].commission_type.id == that.data.selectType) {
          tmpList.push(that.data.showList[i]);
        }
      }
      that.setData({
        showList: tmpList
      })
      tmpList = []
    }
    if (that.data.selectStatus == "unfinished") {
      for (let i = 0; i < that.data.showList.length; i++) {
        if (that.data.showList[i].status == 1 || that.data.showList[i].status == 2) {
          tmpList.push(that.data.showList[i]);
        }
      }
      that.setData({
        showList: tmpList
      })
      tmpList = []
    } else if (that.data.selectStatus == "finished") {
      for (let i = 0; i < that.data.showList.length; i++) {
        if (that.data.showList[i].status == 3 || that.data.showList[i].status == 4) {
          tmpList.push(that.data.showList[i]);
        }
      }
      that.setData({
        showList: tmpList
      })
      tmpList = []
    }
    if (that.data.selectLocation == "xueyuanroad") {
      for (let i = 0; i < that.data.showList.length; i++) {
        if (that.data.showList[i].location == 1) {
          tmpList.push(that.data.showList[i]);
        }
      }
      that.setData({
        showList: tmpList
      })
      tmpList = []
    } else if (that.data.selectLocation == "shahe") {
      for (let i = 0; i < that.data.showList.length; i++) {
        if (that.data.showList[i].location == 2) {
          tmpList.push(that.data.showList[i]);
        }
      }
      that.setData({
        showList: tmpList
      })
      tmpList = []
    }
    if (that.data.selectFee == "asc") {
      if (that.data.type == 10) { // 实时委托
        that.setData({
          realTimeList: that.data.showList.sort(function (m, n) {
            var a = m.fee
            var b = n.fee
            if (a < b) return -1
            else if (a > b) return 1
            else return 0
          })
        })
      } else {
        that.setData({
          list: that.data.showList.sort(function (m, n) {
            var a = m.fee
            var b = n.fee
            if (a < b) return -1
            else if (a > b) return 1
            else return 0
          })
        })
      }
    }
    if (that.data.selectFee == "desc") {
      if (that.data.type == 10) { // 实时委托
        that.setData({
          realTimeList: that.data.showList.sort(function (m, n) {
            var a = m.fee
            var b = n.fee
            if (a < b) return 1
            else if (a > b) return -1
            else return 0
          })
        })
      } else {
        that.setData({
          list: that.data.showList.sort(function (m, n) {
            var a = m.fee
            var b = n.fee
            if (a < b) return 1
            else if (a > b) return -1
            else return 0
          })
        })
      }
    }
    else {
      if (that.data.type == 10) { // 实时委托
        that.setData({
          realTimeList: that.data.showList
        })
      } else {
        that.setData({
          list: that.data.showList
        })
      }
    }
  },

  selectTpye: function (event) {
    // console.log("in selectTpye")
    this.setData({
      selectType: event.detail
    })
    this.select()
  },

  selectStatus: function (event) {
    // console.log("in selectStatus")
    this.setData({
      selectStatus: event.detail
    })
    this.select()
  },

  selectFee: function (event) {
    // console.log("in selectFee")
    this.setData({
      selectFee: event.detail
    })
    this.select()
  },

  selectLocation: function (event) {
    // console.log("in selectLocation")
    this.setData({
      selectLocation: event.detail
    })
    this.select()
  },

  /*
  * 获取list数据
  */
  getDetail: function () {
    let app = getApp()
    let head
    let self = this
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
    // console.log(this.data.type)
    if (this.data.type == 1) { // 所有类别所有委托
      wx.request({
        url: getApp().globalData.baseUrl + '/api/commission/search/all/', //接口名称   
        header: head,
        method: "GET",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
        },
        success(res) {
          // console.log("所有类别所有委托")
          // console.log(res.data)
          self.setData({
            list: res.data,
            originList: res.data
          })
        },
        fail(res) {
          // console.log(res)
          getApp().globalData.util.netErrorToast()
        }
      })
    }
    else if (this.data.type == 2) { // 所有类别指定info委托
      wx.request({
        url: getApp().globalData.baseUrl + '/api/commission/search/all/', //接口名称   
        header: head,
        method: "POST",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
          "info": this.data.keywords
        },
        success(res) {
          // console.log("in wtList type = 2")
          // console.log(res)
          self.setData({
            list: res.data,
            originList: res.data
          })
          // console.log(self.data.list)
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
    }
    else if (this.data.type == 3) { // 指定类别所有委托
      wx.request({
        url: getApp().globalData.baseUrl + '/api/commission/search/specific/' + this.data.sort, //接口名称   
        header: head,
        method: "GET",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
          // 'keyword': this.data.keywords
        },
        success(res) {
          self.setData({
            list: res.data,
            originList: res.data
          })
          // console.log(res)
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
    }
    else if (this.data.type == 4) { // 指定类别指定“info”委托
      wx.request({
        url: getApp().globalData.baseUrl + '/api/commission/search/specific/' + this.data.sort + '/', //接口名称   
        header: head,
        method: "POST",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
          "info": this.data.keywords
        },
        success(res) {
          self.setData({
            list: res.data,
            originList: res.data
          })
          // console.log(self.data.list)
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
    }
    else if (this.data.type == 10) { // 查看实时委托
      wx.request({
        url: getApp().globalData.baseUrl + '/api/commission/search/all/', //接口名称   
        header: head,
        method: "GET",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
        },
        success(res) {
          let tempList = []
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].real_time == 1) {
              tempList.push(res.data[i])
            }
          }
          self.setData({
            realTimeList: tempList,
            originList: res.data
          })
          // console.log("查询实时委托")
          // console.log(self.data.realTimeList)
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
    }
    else {
      // 查看已申请的委托
      wx.request({
        url: getApp().globalData.baseUrl + '/api/commission/applied/2/', //接口名称   
        header: head,
        method: "GET",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
          //'keyword': this.data.keywords
        },
        success(res) {
          // console.log("查看已申请的委托")
          // console.log(res)
          self.setData({
            appliedWtList: res.data
          })
          // console.log(self.data.appliedWtList)
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
      // 查看等待确认的委托
      wx.request({
        url: getApp().globalData.baseUrl + '/api/commission/applied/3/', //接口名称   
        header: head,
        method: "GET",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
          //'keyword': this.data.keywords
        },
        success(res) {
          self.setData({
            waitComfirmedWtList: res.data
          })
          // console.log(res)
          console.log('等待确认')
          console.log(res)
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
      // 查看已完成的委托
      wx.request({
        url: getApp().globalData.baseUrl + '/api/commission/applied/4/', //接口名称   
        header: head,
        method: "GET",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
          //'keyword': this.data.keywords
        },
        success(res) {
          self.setData({
            finishedWtList: res.data
          })
          // console.log(res)
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
      // 查看已发布的委托
      wx.request({
        url: getApp().globalData.baseUrl + '/api/commission/check/1/', //接口名称   
        header: head,
        method: "GET",  //请求方式    
        //data: app.globalData.zdxx,  //用于存放post请求的参数  
        data: {
          //'keyword': this.data.keywords
        },
        success(res) {
          // console.log("查看我发布的委托")
          // console.log(res)
          self.setData({
            releasedWtList: res.data
          })
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
    }
    // 查询所有委托类别
    var tmpTypeList = [{ text: '全部分类', value: 0 },]
    wx.request({
      url: getApp().globalData.baseUrl + '/api/commission/sort/', //获取委托类别
      header: head,
      method: "GET",  //请求方式    
      data: {},
      success(res) {
        // console.log("查看委托类别")
        // console.log(res)
        for (let i = 0; i < res.data.length; i++) {
          var tmpItem = {
            text: res.data[i].name,
            value: res.data[i].id
          }
          tmpTypeList.push(tmpItem)
        }
        self.setData({
          wtTypeList: tmpTypeList
        })
      },
      fail(res) {
        getApp().globalData.util.netErrorToast()
      }
    })
    // console.log(this.data.wtTypeList)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      keywords: options.keywords,
      type: options.type
    })
    if (this.data.keywords == undefined) {
      this.setData({
        type: options.type,
        id: options.id, // 当前用户id
        sort: options.sort
      })
    }
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
    // console.log("onshow")
    this.getDetail();
    //this.tabBar();
  },

  /*tabBar(){
    if(typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setData({
        selected:0
      })
    }
  },*/

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

  jumppages: function () {
    wx.switchTab({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "../publish/publish"
    })
  },

  jumpToSonPages: function (event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../commission/commission?id=' + id,
    })
  },

  gotoUserPage(event) {
    //跳转到个人主页
    let userId = event.currentTarget.dataset.userid
    wx.navigateTo({
      url: '../profile/profile?id=' + userId,
    })
  }
})

