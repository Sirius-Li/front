
// pages/release/releaseCommission/releaseConnission.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    //用户姓名
    username: 'username',
    //用户图片
    userAvatarUrl: '',
    // 委托id
    id: '',
    // 委托类型
    commission_type_id: -1,
    //委托名称
    name: 'commissionname',
    start_time: '05:20',
    end_time: '05:20',
    create_at: '2022-4-12',
    updated_at: '2022-4-12',
    //实时性
    real_time: '',
    // 用户id
    user_id: '',
    //位置
    location: '1',
    //状态
    status: '1',
    //详细描述
    description: "正值青春脑子灵，\n 哪有时间儿女情。\n 献身航空与航天，\n 单身十年笑盈盈。",
    //审核状态
    audit: '',
    //费用
    fee: '',
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

    //页面变量
    // 自动获取今天的日期
    date: '2022-4-12',
    imgList: [],
    type_list: [
      "取件",
      "带饭",
      "二手",
      "离谱",
    ],
    location_list: [
      "学院路",
      "沙河",
      "其他",
    ],
  },

  
  /**
   * 组件的方法列表
   */
  methods: {
    NameChange(event) {
      this.setData({
        name: event.detail.value,
      });
    },
  
    FeeChange(event) {
      this.setData({
        fee: event.detail.value,
      });
    },
  
    TypeChange(event) {
      this.setData({
        commission_type_id: event.detail.value,
      });
    },
  
    DateChange(event) {
      this.setData({
        date: event.detail.value,
      });
    },
  
    StartTimeChange(event) {
      this.setData({
        start_time: event.detail.value,
      });
    },
  
    EndTimeChange(event) {
      this.setData({
        end_time: event.detail.value,
      });
    },
  
    DiscriptionChange(event) {
      this.setData({
        description: event.detail.value,
      });
    },
  
    DelImg(event) {
      console.log("del this img")
      wx.showModal({
        title: '亲爱的用户',
        content: '确定要删除这张介绍图吗？',
        cancelText: '取消',
        confirmText: '确定',
        success: res => {
          if (res.confirm) {
            this.data.imgList.splice(event.currentTarget.dataset.index, 1);
            this.setData({
              imgList: this.data.imgList,
            });
          }
        }
      })
    },
  
    ChooseImage() {
      // wx.chooseImage({
      //   count: 1, //默认9
      //   sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      //   sourceType: ['album'], //从相册选择
      //   success: (res) => {
      //     console.log(res.tempFilePaths);
      //     if (this.data.imgList.length != 0) {
      //       this.setData({
      //         imgList: this.data.imgList.concat(res.tempFilePaths),
      //         'list.photo': res.tempFilePaths
      //       })
      //     } else {
      //       this.setData({
      //         imgList: res.tempFilePaths,
      //         haveimg: 1
      //       })
      //     }
      //   }
      // });
      wx.chooseMedia({
        count: 1, //默认9
        mediaType: ['image'], //默认['image', 'video']
        sourceType: ['camera'], //默认二者皆有
        camera: ['front'], //摄像头选择front | back
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        // success(res) {
        success: (res) => {
          // console.log(res.tempFiles[0].tempFilePath)
          // console.log(this.data.imgList.length)
          if (this.data.imgList.length != 0) {
            this.setData({
              imgList: this.data.imgList.concat(res.tempFiles[0].tempFilePath),
              'list.photo': res.tempFiles[0].tempFilePath
            })
          } else {
            this.setData({
              imgList: this.data.imgList.concat(res.tempFiles[0].tempFilePath),
            });
            // console.log(this.data.imgList)
          }
        },
        fail: (res) => {
            wx.showModal({
              title: "警告",
              content: "打开相册失败",
              showCancel: false,
              cancelColor: 'cancelColor',
            })
        },
      })
    },
  
    ViewImg(event) {
      // wx.previewImage({
      //   urls: this.data.imgList,
      //   current: e.currentTarget.dataset.url
      // });
      console.log(event.currentTarget.dataset.url)
      wx.previewMedia({
        sources: this.data.imgList,
        current: event.currentTarget.dataset.url,
        fail: (res) => {
          wx.showModal({
            title: "警告",
            content: "打开图片失败",
            showCancel: false,
            cancelColor: 'cancelColor',
          })
        },
      });
    },
  
    submit() {
  
    },
  },
  options: {
    addGlobalClass: true
  }
})



  NameChange(event) {
    this.setData({
      name: event.detail.value,
    });
  },

  FeeChange(event) {
    this.setData({
      fee: event.detail.value,
    });
  },

  TypeChange(event) {
    this.setData({
      commission_type_id: event.detail.value,
    });
  },

  DateChange(event) {
    this.setData({
      date: event.detail.value,
    });
  },

  StartTimeChange(event) {
    this.setData({
      start_time: event.detail.value,
    });
  },

  EndTimeChange(event) {
    this.setData({
      end_time: event.detail.value,
    });
  },

  DiscriptionChange(event) {
    this.setData({
      description: event.detail.value,
    });
  },

  DelImg(event) {
    console.log("del this img")
    wx.showModal({
      title: '亲爱的用户',
      content: '确定要删除这张介绍图吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(event.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList,
          });
        }
      }
    })
  },

  ChooseImage() {
    // wx.chooseImage({
    //   count: 1, //默认9
    //   sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
    //   sourceType: ['album'], //从相册选择
    //   success: (res) => {
    //     console.log(res.tempFilePaths);
    //     if (this.data.imgList.length != 0) {
    //       this.setData({
    //         imgList: this.data.imgList.concat(res.tempFilePaths),
    //         'list.photo': res.tempFilePaths
    //       })
    //     } else {
    //       this.setData({
    //         imgList: res.tempFilePaths,
    //         haveimg: 1
    //       })
    //     }
    //   }
    // });
    wx.chooseMedia({
      count: 1, //默认9
      mediaType: ['image'], //默认['image', 'video']
      sourceType: ['camera'], //默认二者皆有
      camera: ['front'], //摄像头选择front | back
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      // success(res) {
      success: (res) => {
        // console.log(res.tempFiles[0].tempFilePath)
        // console.log(this.data.imgList.length)
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFiles[0].tempFilePath),
            'list.photo': res.tempFiles[0].tempFilePath
          })
        } else {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFiles[0].tempFilePath),
          });
          // console.log(this.data.imgList)
        }
      },
      fail: (res) => {
          wx.showModal({
            title: "警告",
            content: "打开相册失败",
            showCancel: false,
            cancelColor: 'cancelColor',
          })
      },
    })
  },

  ViewImg(event) {
    // wx.previewImage({
    //   urls: this.data.imgList,
    //   current: e.currentTarget.dataset.url
    // });
    console.log(event.currentTarget.dataset.url)
    wx.previewMedia({
      sources: this.data.imgList,
      current: event.currentTarget.dataset.url,
      fail: (res) => {
        wx.showModal({
          title: "警告",
          content: "打开图片失败",
          showCancel: false,
          cancelColor: 'cancelColor',
        })
      },
    });
  },

  submit() {

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

