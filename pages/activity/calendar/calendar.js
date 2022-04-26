// pages/activity/calendar/calendar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedDate: '',//选中的几月几号
    selectedWeek: '',//选中的星期几
    selectDay: '',
    curYear: 2021,//当前年份
    curMonth: 4,//当前月份
    daysCountArr: [// 保存各个月份的长度，平年
      31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ],
    weekArr: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dateList: [],
    commissionList: [
      {
        commissionId: 111,
        commissionName: "取快递",
        commissionLocation: "学院路",
        commissionTime: "now",
        date: "2022/4/25"
      },
      {
        commissionId: 112,
        commissionName: "取外卖",
        commissionLocation: "学院路",
        commissionTime: "14:00",
        date: "2022/4/24"
      }
    ],
  },

  getDateList: function (y, mon) {
    
    var vm = this;
    var today = new Date();//当前时间  
    //如果是否闰年，则2月是29日
    var daysCountArr = this.data.daysCountArr;
    if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
      // this.data.daysCountArr[1] = 29;
      daysCountArr[1] = 29;
      this.setData({
        daysCountArr: daysCountArr
      });
    } else {
      daysCountArr[1] = 28;
      this.setData({
        daysCountArr: daysCountArr
      });
    }
    var activityList = {}
    for (var i = 1; i <= vm.data.daysCountArr[mon]; i++) {
      activityList[i] = []
    }
    var commissionyList = {}
    for (var i = 1; i <= vm.data.daysCountArr[mon]; i++) {
      commissionyList[i] = []
    }
    var that = this
    var headers = {}
    if (getApp().globalData.token != null) {
      headers = {
        Authorization: 'Token ' + getApp().globalData.token
      }
    }
    //第几个月；下标从0开始实际月份还要再+1  
    var dateList = [];
    // 
    dateList[0] = [];
    var weekIndex = 0;//第几个星期
    var timerange = {
      start: y + '/' + (parseInt(mon) + 1) + '/1 00:00',
      end: y + '/' + (parseInt(mon) + 1) + '/' + vm.data.daysCountArr[mon] + ' 23:59'  
    }
    
    wx.request({

      url: getApp().globalData.baseUrl + '/api/commission/applied/',
      method: 'POST',
      header: headers,
      data: {
        user_attend: true,
        timerange: timerange,
        audit_status: [3],
      },
      success (res) {
        
        for (var i = 0; i < res.data.length; i++) {
          var m = res.data[i]
          var start = parseInt(m.start_time.split(' ')[0].split('/')[2])
          var end = parseInt(m.end_time.split(' ')[0].split('/')[2])
          
          for (var d = start; d <= end; d++) {
            commissionList[d].push({
              commissionId: m.id,
              commissionName: m.name,
              commissionTime: m.start_time + ' - ' + m.ent_time,
              commissionRealTime: m.real_time
            })
          }
        }
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      },
      complete () {
        vm.setData({
          //commissionList: commissionyList[vm.data.selectDay] || []
        });
        // console.log(vm.data.dateList)
      }
    })

    wx.request({
      url: 'https://se.alangy.net/api/condition/activities/',

      method: 'POST',
      header: headers,
      data: {
        user_attend: true,
        timerange: timerange,
        audit_status: [3],
      },
      success (res) {
        
        for (var i = 0; i < res.data.length; i++) {
          var m = res.data[i]
          var start = parseInt(m.normal_activity.start_at.split(' ')[0].split('/')[2])
          var end = parseInt(m.normal_activity.end_at.split(' ')[0].split('/')[2])
          
          
          for (var d = start; d <= end; d++) {
            activityList[d].push({
              activityId: m.id,
              activityName: m.name,
              activityTime: m.normal_activity.start_at + ' - ' + m.normal_activity.end_at,
              activityLocation: m.position
            })
          }
        }
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      },
      complete () {
        for (var i = 0; i < vm.data.daysCountArr[mon]; i++) {
          var week = new Date(y, mon, (i + 1)).getDay();
          // 如果是新的一周，则新增一周
          if (week === 1 && i !== 0) {
            weekIndex++;
            dateList[weekIndex] = [];
          }
          // 如果是第一行，则将该行日期倒序，以便配合样式居右显示
          if (weekIndex == 0) {
            dateList[weekIndex].unshift({
              value: y + '/' + (mon + 1) + '/' + (i + 1),
              date: i + 1,
              week: week,
              activitiesCnt: activityList[i + 1].length,
            });
          } else {
            dateList[weekIndex].push({
              value: y + '/' + (mon + 1) + '/' + (i + 1),
              date: i + 1,
              week: week,
              activitiesCnt: activityList[i + 1].length,
            });
          }
        }
        // 
        
        vm.setData({
          dateList: dateList,
          activityList: activityList,
          todoList: activityList[vm.data.selectDay] || []
        });
        // console.log(vm.data.dateList)
      }
    })
  },
  selectDate: function (e) {
    var vm = this;
    console.log(this.data.selectedDate)
    // 
    vm.setData({
      selectedDate: e.currentTarget.dataset.date.value,
      selectedWeek: vm.data.weekArr[e.currentTarget.dataset.date.week],
      selectDay: e.currentTarget.dataset.date.date,
      todoList: vm.data.activityList[e.currentTarget.dataset.date.date]
    });
    
  },
  preMonth: function () {
    // 上个月
    var vm = this;
    var curYear = vm.data.curYear;
    var curMonth = vm.data.curMonth;
    curYear = curMonth - 1 ? curYear : curYear - 1;
    curMonth = curMonth - 1 ? curMonth - 1 : 12;
    // 
    vm.setData({
      curYear: curYear,
      curMonth: curMonth,
      selectDay: 0,
      selectedDate: '',
      todoList: []
    });

    vm.getDateList(curYear, curMonth - 1);
  },
  nextMonth: function () {
    // 下个月
    var vm = this;
    var curYear = vm.data.curYear;
    var curMonth = vm.data.curMonth;
    curYear = curMonth + 1 == 13 ? curYear + 1 : curYear;
    curMonth = curMonth + 1 == 13 ? 1 : curMonth + 1;
    // 
    vm.setData({
      curYear: curYear,
      curMonth: curMonth,
      selectDay: 0,
      selectedDate: '',
      todoList: []
    });

    vm.getDateList(curYear, curMonth - 1);
  },

  syncData() {
    // 获取列表
    // this.data.todos = todoStore.getTodos()
    // this.data.todos = this.todosFilter()
    // this.update()
    // // 更新置顶标题
    // let uncompletedCount = todoStore.getUncompletedTodos().length
    // let todayCompletedCount = todoStore.getTodayCompletedTodos().length
    // let title = ['TodoList（进行中: ', uncompletedCount, ', 今日已完成: ', todayCompletedCount, '）'].join('')
    // wx.setTopBarText({ text: title })
    // // 动画结束后取消动画队列延迟
    // // setTimeout(() => {
    // //   this.update({ delay: false })
    // // }, 2000)
  },

  routeActivityDescription: function (event) {
    wx.navigateTo({
      url: '../../actList/activity/activity?id=' + event.currentTarget.dataset.activityid,
    })
  },

  routeCommissionDescription: function (event) {
    wx.navigateTo({
      url: '../../commission/commission?id=' + event.currentTarget.dataset.commissionid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var today = new Date();//当前时间  
    var y = today.getFullYear();//年  
    var mon = today.getMonth() + 1;//月  
    var d = today.getDate();//日  
    var i = today.getDay();//星期  
    this.setData({
      curYear: y,
      curMonth: mon,
      selectedDate: y + '/' + mon + '/' + d,
      nowDate: y + '/' + mon + '/' + d,
      selectDay: d,
      selectedWeek: this.data.weekArr[i],
    });
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
    //this.getTabBar().init();
    getApp().getNotificationCount()
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
    // var today = new Date();//当前时间  
    // var y = today.getFullYear();//年  
    // var mon = today.getMonth() + 1;//月  
    // var d = today.getDate();//日  
    // var i = today.getDay();//星期  
    // this.setData({
    //   curYear: y,
    //   curMonth: mon,
    //   selectedDate: y + '/' + mon + '/' + d,
    //   nowDate: y + '/' + mon + '/' + d,
    //   selectDay: d,
    //   selectedWeek: this.data.weekArr[i],
    // });
    let y = this.data.curYear
    let mon = this.data.curMonth
    this.syncData()
    this.getDateList(y, mon - 1);
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.syncData()
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