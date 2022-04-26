// pages/htList/htList.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        /*
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        */
        list: [
           /* {
                "id": 1,
                "topic_type": {
                  "id": 2,
                  "name": "求助"
                },
                "name": "学院路计院大三选课",
                "create_at": "2022/04/13 23:39",
                "audit": 1,
                "photo": "",
                "description": "核心专业和个人专业都拜托了",
                "like": 1,
                "follow": 0,
                "create_user": {
                  "id": 1,
                  "nickName": "田所浩二",
                  "avatarUrl": "../../img/profile2.jpg",
                  "email": "admin@se.alangy.net",
                  "age": 22,
                  "gender": 0,
                  "audit_status": 3,
                  "is_staff": true
                }
            }, {
                "id": 2,
                "topic_type": {
                  "id": 1,
                  "name": "生活"
                },
                "name": "求推荐学校周边餐馆",
                "create_at": "2022/04/13 23:39",
                "audit": 1,
                "photo": "../../img/bg.jpg",
                "description": "RT",
                "like": 56,
                "follow": 987,
                "create_user": {
                  "id": 1,
                  "nickName": "远野",
                  "avatarUrl": "../../img/profile1.jpg",
                  "email": "admin@se.alangy.net",
                  "age": 22,
                  "gender": 0,
                  "audit_status": 3,
                  "is_staff": true
                }
            },  */
        ],
        type: 1,
        keywords: '',
        sort: '',
        activename:'0'
    },

    /*
     * 获取list数据
     */
    getDetail:function() {
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
        if (this.data.type == 1) {
            wx.request({
                url: getApp().globalData.baseUrl + '/api/topic/',
                header: head,
                method:"GET", 
                data: {
                    'keyword': this.data.keywords
                },
                success(res) {
                    self.setData({
                        list: res.data
                    })
                },
                fail(res) {
                    getApp().globalData.util.netErrorToast()
                }
            })
        } else if (this.data.type == 2) {
            wx.request({
                url: getApp().globalData.baseUrl + '/api/topic/',
                header: head,
                method:"GET", 
                data: {
                    
                },
                success(res) {
                    self.setData({
                        list: res.data
                    })
                },
                fail(res) {
                    getApp().globalData.util.netErrorToast()
                }
            })
        } else if (this.data.type == 5) {
            wx.request({
                url: getApp().globalData.baseUrl + '/api/topic/',
                header: head,
                method:"GET", 
                data: {
                },
                success(res) {
                    self.setData({
                        list: res.data
                    })
                },
                fail(res) {
                    getApp().globalData.util.netErrorToast()
                }
            })
        }

    },

    jumpToSonPages:function(event) {
        let id = event.currentTarget.dataset.id
        wx.navigateTo({
          url: '../htdetail/htdetail?id=' + id,
        })
    },

    goToUserPage:function(event) {
        let user_id = event.currentTarget.dataset.user_id
        wx.navigateTo({
          url: '../profile/profile?id=' + user_id,
        })
    },


    changeTab:function(event) {
        let activeID = event.detail.index
        console.log(activeID)
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
        if (activeID === 0) {
            wx.request({
                url:getApp().globalData.baseUrl + '/api/options/',
                header: head,
                method:"GET",   
                data: {
                    
                },
                success(res) {
                    self.setData({
                        list: res.data
                    })
                },
                fail(res) {
                    getApp().globalData.util.netErrorToast()
                }
            })
        } else if (activeID === 1) {
            wx.request({
                url:getApp().globalData.baseUrl + '/api/topic/',
                header: head,
                method:"GET",   
                data: {
                    
                },
                success(res) {
                    self.setData({
                        list: res.data
                    })
                },
                fail(res) {
                    getApp().globalData.util.netErrorToast()
                }
            })
        }
    },

    deleteHt:function(event) {
        let id = event.currentTarget.dataset.id
        let app = getApp()
        let that = this
        let head
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
        Dialog.confirm({
            message: '您是否要删除该话题？'
          }).then(() => {wx.request({    
            url: getApp().globalData.baseUrl + '/api/topic/', //接口名称   
            header: head,
            method:"DELETE",  //请求方式    
            data: {
              'id': id
            }, 
            success(res) {   
                that.getDetail()
                wx.showToast({
                  title: '删除成功',
                })
            },
            fail(res){
              getApp().globalData.util.netErrorToast()
            }
          })
        })  
    }, 

    undoFollow:function(event) {
        let id = event.currentTarget.dataset.id
        let app = getApp()
        let head
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
        Dialog.confirm({
            message: '您是否决定不再关注该话题？'
          }).then(() => {wx.request({    
            url: getApp().globalData.baseUrl + '/api/topic_follows/', //接口名称   
            header: head,
            method:"DELETE",  //请求方式    
            data: {
              'id': id
            }, 
            success(res) {   
                that.getDetail()
                wx.showToast({
                  title: '取消关注成功',
                })
            },
            fail(res){
              getApp().globalData.util.netErrorToast()
            }
          })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            keywords:options.keywords
        })
        if (this.data.keywords == undefined) {
            this.setData({
                type: options.type,
                sort:options.sort
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

    }
})