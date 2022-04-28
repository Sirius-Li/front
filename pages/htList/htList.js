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
        if (this.data.type == 1) {     //所有委托
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
        } else if (this.data.type == 2) {   //分类搜索
            wx.request({
                url: getApp().globalData.baseUrl + '/api/condition/topics/',
                header: head,
                method:"POST", 
                data: {
                    types : {
                        method : "id",
		                value : self.data.sort
                    }
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
        } else if (this.data.type == 3) {   //指定info
            wx.request({
                url: getApp().globalData.baseUrl + '/api/topic_search/',
                header: head,
                method:"POST", 
                data: {
                    types : {
		                keyword : self.data.keywords
                    }
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
                url:getApp().globalData.baseUrl + '/api/user_create_topic/' + getApp().globalData.myUserId + '/',
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
                url:getApp().globalData.baseUrl + '/api/topic_follow_users_self/',
                header: head,
                method:"GET",   
                data: {
                },
                success(res) {
                    let tmpList = []
                    let itemList = []
                    for(let i = 0; i < res.data.length; i++){
                        tmpList.push(res.data[i].id)
                    }
                    for (let i = 0; i < tmpList.length; i++) {
                        wx.request({
                          url: getApp().globalData.baseUrl + '/api/topic/' + tmpList[i] + '/',
                          header: head,
                          method:"GET",   
                          data: {
                          }, success(res) {
                            itemList.push(res.data)
                          }, fail(res) {
                            getApp().globalData.util.netErrorToast()
                          } 
                        })
                    }
                    self.setData({
                        list : itemList
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
            url: getApp().globalData.baseUrl + '/api/topic/' + id + '/', //接口名称   
            header: head,
            method:"DELETE",  //请求方式    
            data: {
              'id': id
            }, 
            success(res) {   
                wx.request({
                    url:getApp().globalData.baseUrl + '/api/user_create_topic/' + getApp().globalData.myUserId + '/',
                    header: head,
                    method:"GET",   
                    data: {
                    },
                    success(res) {
                        that.setData({
                            list: res.data
                        })
                    },
                    fail(res) {
                        getApp().globalData.util.netErrorToast()
                    }
                })
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
        let that = this
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
            url: getApp().globalData.baseUrl + '/api/topic_follows/' + id + '/', //接口名称   
            header: head,
            method:"DELETE",  //请求方式    
            data: {
              'id': id
            }, 
            success(res) {   
                wx.request({
                    url:getApp().globalData.baseUrl + '/api/topic_follow_users_self/',
                    header: head,
                    method:"GET",   
                    data: {
                        
                    },
                    success(res) {
                        that.setData({
                            list: res.data
                        })
                    },
                    fail(res) {
                        getApp().globalData.util.netErrorToast()
                    }
                })
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
        var that = this
        that.setData({
            keywords:options.keywords
        })
        if (that.data.keywords == undefined) {
            that.setData({
                type: options.type,
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
        if (this.data.type == 5) {
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
            wx.request({
                url:getApp().globalData.baseUrl + '/api/user_create_topic/' + getApp().globalData.myUserId + '/',
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
        } else {
            this.getDetail()
        }
        
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