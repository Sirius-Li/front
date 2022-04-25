const markerTemplate = {
  // id: null,
  // latitude: null,
  // longitude: null,
  iconPath: '/image/location.png',
  customCallout: {
    anchorY: 25,
    anchorX: 0,
    display: 'ALWAYS',
  },
  width: "40",  
  height: "40"
} 

// pages/activity/sports/sports.js
Page({
  data: {
    dateToday: '',
    latitude: 23.096994,
    longitude: 113.324520,
    markers: [],
    customCalloutMarkerIds: [],
    sportsList: []
  },

  getSportActivities: function (e) {
    var that = this
    var header = {}
    if (getApp().globalData.token != null) {
      header = {
        'content-type': 'application/json',
        'Authorization': `Token` + ' ' + `${getApp().globalData.token}`
      }
    }

    var today = new Date();
    var dateDay = String(today.getDate())
    var dateMonth = String(today.getMonth() + 1)
    var dateYear = String(today.getFullYear())
    
    
    
    var dateString = dateYear + '/' + dateMonth + '/' + dateDay
    
    var startTimeString = dateString + ' 0:00'
    var stopTimeString = dateString + ' 23:59'
    //var startTimeString = '2018/12/25 0:00'
    //var stopTimeString = '2018/12/25 23:59'
    
    
    
    var data = {
        "timerange":{
            'start': startTimeString,
            'end': stopTimeString,
        }, 
        'audit_status': [3],
        'types': {
          "method":'name',
          "value": ['体育']
      },
    }
    
    wx.request({
      url: getApp().globalData.baseUrl + '/api/condition/activities/',
      method: 'POST',
      data,
      header,
      success(res) {
        if (res.statusCode === 200) {
          const data = res.data
          // console.log(data)
          var sportsList = []
          var currentId = 1
          for (const act of data) {
            let it = {
              id: currentId++,
              act_id: act.id,
              latitude: act.latitude,
              longitude: act.longitude,
              name: act.name,
              location: act.position,
              datetime: act.normal_activity.start_at.split(' ')[1],
            }
            sportsList.push(it)
          }
          that.setData({
            sportsList
          })
        } else {
          
          
        }
        
      },
      fail(res){
        getApp().globalData.util.netErrorToast()
      }
    })
  },

  onLoad: function (e) {
    this.getSportActivities();
  },

  onReady: function (e) {
    var today = new Date();
    var dateToday = String(today.getMonth() + 1) + "月" + String(today.getDate()) + '日';
    

    var markers = []
    for (const sport of this.data.sportsList) {
      const new_marker = Object.assign({
        id: sport.id,
        latitude: sport.latitude,
        longitude: sport.longitude
      }, markerTemplate)
      markers.push(new_marker)
    }

    this.mapCtx = wx.createMapContext('myMap')
    this.mapCtx.moveToLocation({
      latitude: 39.980229,
      longitude: 116.346435,
    })

    this.setData({
      dateToday,
      markers
    })
  },
  onTapSport: function (e) {
    const { actid } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../../actList/activity/activity?id='+actid,
    })

  },
  onTapSportId: function (e) {
    this.goTop()
    const { sportid } = e.currentTarget.dataset
    this.mapCtx.moveToLocation({
      longitude: this.data.sportsList[sportid - 1].longitude,
      latitude: this.data.sportsList[sportid - 1].latitude
    })
  },
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
})