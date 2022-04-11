// pages/htList/htList.js
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
            {
                "id": 114514,
                "ht_type_name": "选课",
                "name": "学院路计院大三选课",
                "create_at": "2022/04/11 08:42",
                "updated_at": "2022/04/12 08:42",
                "user_id": 1919810,
                "user_profile_url":'',
                "description": "如题",
                "audit": 1,
                "photos": "",
                "like": 2333,	
                "follow": 6666
            }, {
                "id": 2333,
                "ht_type_name": "生活",
                "name": "求推荐学校周边餐馆",
                "create_at": "2022/04/11 08:42",
                "updated_at": "2022/04/12 08:42",
                "user_id": 1919811,
                "user_profile_url":'',
                "description": "如题",
                "audit": 1,
                "photos": "https://ossweb-img.qq.com/images/lol/web201310/skin/big10005.jpg",
                "like": 2334,	
                "follow": 6667
            }, {
                "id": 6666,
                "ht_type_name": "吐槽",
                "name": "#￥%%……#",
                "create_at": "2022/04/11 08:42",
                "updated_at": "2022/04/12 08:42",
                "user_id": 1919812,
                "user_profile_url":'',
                "description": "如题",
                "audit": 1,
                "photos": "https://ossweb-img.qq.com/images/lol/web201310/skin/big10005.jpg",
                "like": 2335,	
                "follow": 6668
            }
        ],
        request_type:  1,
        keywords: '',
        sort: ''
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
        if (request_type == 1) {
            wx.request({
                url:'todo',
                header: head,
                method:"GET",   //todo
                data: {
                    // todo
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
          url: 'todo' + id,
        })
    },

    goToUserPage:function(event) {
        let user_id = event.currentTarget.dataset.user_id
        wx.navigateTo({
          url: '../profile/profile?id=' + user_id,
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