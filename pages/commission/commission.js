// pages/commission/commission.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户姓名
    username: 'username',
    //用户图片
    userAvatarUrl: '',
    // 委托id
    id: '',
    // 委托类型
    commission_type_id: '',
    //委托名称
    name: 'commissionname',
    start_time: '2022-4-12',
    end_time: '2022-4-12',
    create_at: '2022-4-12',
    updated_at: '2022-4-12',
    //实时性
    real_time: '',
    // 用户id
    user_id: '',
    //位置
    location: '1',
    //状态
    status: '3',
    //详细描述
    description: "正值青春脑子灵，\n 哪有时间儿女情。\n 献身航空与航天，\n 单身十年笑盈盈。",
    //审核状态
    audit: '',
    //费用
    fee: '198',
    //评论
    comments: [
      {
        "user":{
            "user_id":'int',
            "name":'str'
        },
        "to_user":{
            "user_id":'int',
            "name":'str'
        },
        "content": 'text',
        "comment_time":'str',
      }
    ],

    //一些控制变量
    
  },

  Evaluate() {
    wx.showModal({
      title: "评价",
      placeholderText: "请输入您的评价",
      showCancel: true,
      editable: true,
      success: (res) => {
        var evaluate = res.content;
        if (res.confirm) {
          //TODO
          //提交到后端
          console.log(evaluate);
        }
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})