// pages/htList/htList.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
Page({
    data: {
        list: [
        ],
        originList: [

        ],
        option1: [
        ],
        option2: [
            { text: '时间排序', value: 'a' },
            { text: '点赞数排序', value: 'b' },
            { text: '关注数排序', value: 'c' },
        ],
        value1: 0,
        value2: 'a',
        type: 1,
        keywords: '',
        sort: '',
        activename:'0',
        activeId:0
    },

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
           let tmpList = []
                      wx.request({
                          url: getApp().globalData.baseUrl + '/api/topic_search/',
                          header: head,
                          method:"POST", 
                          data: {
                                 keyword : self.data.keywords
                          },
                          success(res) {
                              for (let i = 0; i < res.data.length; i++) {
                                  tmpList.push(res.data[i].content)
                              }
                              self.setData({
                                  list: tmpList
                              })
                          },
                          fail(res) {
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
        } else if (this.data.type == 10) { // 历史话题
          wx.request({
            url: getApp().globalData.baseUrl + '/api/topic_click_users_self/',
            header: head,
            method:"GET", 
            data: {
            },
            success(res) {
              console.log("htList type = 10 ", res.data)
              let tmp = []
              let i = 0
              for (i = 0; i < res.data.length; i++) {
                  tmp.push(res.data[i].topic)
              }
              console.log("tmp=", tmp)
                self.setData({
                    list: tmp
                })
            },
            fail(res) {
                getApp().globalData.util.netErrorToast()
            }
        })
      }
      console.log("======================", this.data.list)
    },

    jumpToSonPages:function(event) {
        let id = event.currentTarget.dataset.id
        wx.navigateTo({
          url: '../htdetail/htdetail?id=' + id,
        })
    },

    goToUserPage:function(event) {
        let user_id = event.currentTarget.dataset.userid
        wx.navigateTo({
          url: '../profile/profile?id=' + user_id,
        })
    },
    
    getTypeList:function() {
        var tmpList = [ { text: '全部分类', value: 0 },]
        var that = this
        var headers = {}
        if (getApp().globalData.token != null) {
            headers = {
                Authorization: 'Token ' + getApp().globalData.token
            }
        }
        wx.request({
            url:  getApp().globalData.baseUrl + '/api/topic_types/',
            method:'GET',
            header:headers,
            success(res) {
              for (let i = 0 ; i < res.data.length; i++) {
                var tmpItem = {
                    text: res.data[i].name, 
                    value: res.data[i].id
                }
                tmpList.push(tmpItem)
              }
              that.setData({
                  option1: tmpList
              })
            },
            fail(res) {
              getApp().globalData.util.netErrorToast()
            }
        })
    },

    changeTab:function(event) {
        let activeID = event.detail.index
        let app = getApp()
        let head
        let self = this
        self.setData({
            activeId :activeID
        })
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
                url:getApp().globalData.baseUrl + '/api/user_create_topic_self/',
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
                        tmpList.push(res.data[i].topic.id)
                    }
                    for (let i = 0; i < tmpList.length; i++) {
                        wx.request({
                          url: getApp().globalData.baseUrl + '/api/topic/' + tmpList[i] + '/',
                          header: head,
                          method:"GET",   
                          data: {
                          }, success(resu) {
                            itemList.push(resu.data)
                            self.setData({
                                list : itemList
                            })
                          }, fail(resu) {
                            getApp().globalData.util.netErrorToast()
                          } 
                        })
                    }     
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
                    url:getApp().globalData.baseUrl + '/api/user_create_topic_self/',
                    header: head,
                    method:"GET",   
                    data: {
                    },
                    success(res) {
                        that.setData({
                            list : res.data
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
        }).catch((err)=>{
            
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
                        let tmpList = []
                    let itemList = []
                    for(let i = 0; i < res.data.length; i++){
                        tmpList.push(res.data[i].topic.id)
                    }
                    for (let i = 0; i < tmpList.length; i++) {
                        wx.request({
                          url: getApp().globalData.baseUrl + '/api/topic/' + tmpList[i] + '/',
                          header: head,
                          method:"GET",   
                          data: {
                          }, success(resu) {
                            itemList.push(resu.data)
                            that.setData({
                                list : itemList
                            })
                          }, fail(resu) {
                            getApp().globalData.util.netErrorToast()
                          } 
                        })
                    }
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
        }).catch((err)=>{
            
        })
    },

    myCompare:function(prop) {
        return function(a, b) {
            if (prop == "b") {
                var v1 = parseInt(a["like"])
                var v2 = parseInt(b["like"])
            } else if (prop == "c") {
                var v1 = parseInt(a["follow"])
                var v2 = parseInt(b["follow"])
            } else {
                var v1 = Date.parse(new Date(a["create_at"]))
                var v2 = Date.parse(new Date(b["create_at"]))
            }
            return v2-v1;
        }
    },

    select:function(event) {
        var id = event.detail
        let that = this
        let tmpList = [];
        if (that.data.originList.length == 0) {
            that.setData({
                originList: that.data.list
            })
        }
        if (id == "a" || id == "b" || id == "c") {
            that.setData({
                value2: id
            })
        } else {
            that.setData({
                value1: id
            })
        }

        if (that.data.value1 != 0) {
            console.log("1")
            for (let i = 0; i < that.data.originList.length; i++) {
                if (that.data.originList[i].topic_type.id == that.data.value1) {
                    tmpList.push(that.data.originList[i]);
                }
            }
        } else {
            tmpList = that.data.originList
        }
        that.setData({
            list: tmpList.sort(that.myCompare(that.data.value2))
        })

    },

    onLoad: function (options) {
        var that = this
        that.setData({
            keywords:options.keywords,
            type: options.type,
        })
        if (that.data.keywords == undefined) {
            that.setData({
                type: options.type,
                sort: options.sort
            })
        }
        
    },

    onReady: function () {

    },

    onShow: function () {
        if (this.data.type == 5 && this.data.activeId == 0) {
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
                url:getApp().globalData.baseUrl + '/api/user_create_topic_self/',
                header: head,
                method:"GET",   
                data: {
                    
                },
                success(res) {
                    self.setData({
                        list : res.data
                    })
                },
                fail(res) {
                    getApp().globalData.util.netErrorToast()
                }
            })
        } else if (this.data.type == 5 && this.data.activeId == 1) {
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
                url:getApp().globalData.baseUrl + '/api/topic_follow_users_self/',
                header: head,
                method:"GET",   
                data: {
                },
                success(res) {
                    let tmpList = []
                    let itemList = []
                    for(let i = 0; i < res.data.length; i++){
                        tmpList.push(res.data[i].topic.id)
                    }
                    for (let i = 0; i < tmpList.length; i++) {
                        wx.request({
                          url: getApp().globalData.baseUrl + '/api/topic/' + tmpList[i] + '/',
                          header: head,
                          method:"GET",   
                          data: {
                          }, success(resu) {
                            itemList.push(resu.data)
                            self.setData({
                                list : itemList
                            })
                          }, fail(resu) {
                            getApp().globalData.util.netErrorToast()
                          } 
                        })
                    }     
                },
                fail(res) {
                    getApp().globalData.util.netErrorToast()
                }
            })
        } else {
            this.getDetail()
            this.getTypeList()
        }   
    },

    onHide: function () {

    },

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