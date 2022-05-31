// pages/htrelease/htrealse.js
const app = getApp()
Component({

  /**
   * 页面的初始数据
   */
  data: {
    head: null,
    topic_name: null,
    modalname: null,
    textareaValue: '',
    typeStr: null,
    type: [],
    imgList: [],
    haveimg: null,
    list: {
      "name": '',
      "description": '',
      "topic_type": '',
      "photo": ''
    }
  },

  methods: {
    NameChange(e) {
      this.setData({
        topic_name: e.detail.value,
      })
    },
    textareaAInput(e) {
      this.setData({
        textareaValue: e.detail.value,
        'list.description': e.detail.value
      })
    },
    ViewImage(e) {
      wx.previewImage({
        urls: this.data.imgList,
        current: e.currentTarget.dataset.url
      });
    },
    DelImg(e) {
      wx.showModal({
        title: '亲爱的用户',
        content: '确定要删除这张图片吗？',
        cancelText: '取消',
        confirmText: '确定',
        success: res => {
          if (res.confirm) {
            this.data.imgList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              imgList: this.data.imgList,
              haveimg: null
            })
          }
        }
      })
    },
    ChooseImage() {
      wx.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: (res) => {
          if (this.data.imgList.length != 0) {
            this.setData({
              imgList: this.data.imgList.concat(res.tempFilePaths),
              'list.photo': res.tempFilePaths
            })
          } else {
            this.setData({
              imgList: res.tempFilePaths,
              haveimg: 1
            })
          }
        }
      });
    },
    TypeChange(e) {
      this.setData({
        typeStr: e.detail.value
      })
    },

    reset: function () {
      this.setData({
        topic_name: null,
        typeStr: null,
        imgList: [],
        haveimg: null,
        modalName: null,
        textareaValue: ''
      })
    },

    submit: function () {
      let app = getApp()
      if (this.data.topic_name == null || this.data.topic_name.length == 0) {
        wx.showModal({
          title: '提示',
          content: '没有设置话题名称',
          showCancel: false
        })
      } else if (this.data.textareaValue.length == 0) {
        wx.showModal({
          title: '提示',
          content: '请输入话题内容',
          showCancel: false
        })
      } else if (this.data.typeStr == null) {
        wx.showModal({
          title: '提示',
          content: '请设置话题类别',
          showCancel: false
        })
      } else if (this.data.topic_name.length >= 51) {
        wx.showModal({
          title: '提示',
          content: '话题名称不能超过50个字符',
          showCancel: false
        })
      } else {
        this.setData({
          'list.name': this.data.topic_name,
          'list.topic_type': this.data.type[this.data.typeStr],
          'list.photo': this.data.imgList,
        })
        //console.log(this.data.list)
        if (app.globalData.token == null) {
          this.data.head = {
            'content-type': 'application/json'
          }
        } else {
          this.data.head = {
            'content-type': 'application/json',
            'Authorization': 'Token ' + app.globalData.token
          }
        }
        let self = this
        wx.getSetting({
          withSubscriptions: true,

          success(res) {
            if (res.subscriptionsSetting.mainSwitch) {
              self.release(self)
              wx.requestSubscribeMessage({
                tmplIds: [
                  'mEFV6psbMGpP9i8CU8NXTJ27dOoppg8FZsYQmN9lHcs',
                  'C4V9ycGzS0BGvjVsmcondcBwFMOvLFQ3sE8j0KKTF0g',
                  'N0g3qePR6hz8Fn79lM_5sIT9jhUTKEYQW5Y_VObffZ0'],
                success(res) {
                  self.release(self)
                }
              })
            } else {
              self.release(self)
            }
          },
        })
      }
    },
    release(self) {
      if (this.data.list.photo.length == 0) {
        console.log(self.data.list)
        console.log(self.data.head)
        wx.request({
          url: getApp().globalData.baseUrl + '/api/topic/',
          header: self.data.head,
          method: "POST",
          data: {
            name: self.data.list.name,
            description: self.data.list.description,
            topic_type: self.data.list.topic_type
          },
          success(res) {
            console.log(res)
            if (res.statusCode == 201) {
              wx.navigateTo({
                url: '/pages/htList/htList?type=5',//todo
              })
              wx.showToast({
                title: '话题发布成功',
              })
              self.reset()
            } else if (res.statusCode == 403) {
              self.reset()
              wx.showModal({
                title: '当前用户无发布话题权限，请及时进行申诉。是否跳转至权限申诉界面？',
                success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/other/appeal/appeal',
                    })
                  }
                }
              })
            } else if (res.statusCode == 400) {
              if (res.data === '') {
                wx.showToast({
                  title: '话题发布失败',
                  icon: 'error'
                })
              } else {
                wx.showModal({
                  content: res.data,
                  showCancel: false
                })
              }
            } else {
              wx.showToast({
                title: '话题发布失败',
                icon: 'error'
              })
            }
          },
          fail(res) {
            getApp().globalData.util.netErrorToast()
          }
        })
      } else {
        // console.log(self.data.imgList[0])
        // console.log(self.data.list)
        wx.uploadFile({
          header: self.data.head,
          url: getApp().globalData.baseUrl + '/api/topic/', //接口名称
          filePath: self.data.imgList[0],
          name: 'photo',
          // header: self.data.head,
          formData: self.data.list,
          success(res) {
            console.log(res)
            if (res.statusCode == 201) {
              wx.navigateTo({
                url: '/pages/htList/htList?type=5',//todo
              })
              wx.showToast({
                title: '话题发布成功',
              })
              self.reset()
            } else if (res.statusCode == 403) {
              self.reset()
              wx.showModal({
                title: '当前用户无发布话题权限，请及时进行申诉。是否跳转至权限申诉界面？',
                success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/other/appeal/appeal',
                    })
                  }
                }
              })
            } else if (res.statusCode == 400) {
              if (res.data === '') {
                wx.showToast({
                  title: '话题发布失败',
                  icon: 'error'
                })
              } else {
                wx.showModal({
                  content: res.data,
                  showCancel: false
                })
              }
            } else {
              wx.showToast({
                title: '话题发布失败',
                icon: 'error'
              })
            }
          },
          fail(res) {
            getApp().globalData.util.netErrorToast()
          }
        })
      }

    },
  },

  attached() {
    let self = this
    let app = getApp()
    let temp = []
    let t = []
    if (getApp().globalData.user_status == 2) {
      wx.redirectTo({
        url: '../../certification/certification',
      })
    } else if (getApp().globalData.user_status == 1) {
      wx.switchTab({
        url: '../home/home',
        success(res) {
          wx.showToast({
            title: '用户还在认证中',
            icon: 'error'
          })
        }
      })
    } else {
      if (app.globalData.token == null) {
        self.data.head = {
          'content-type': 'application/json'
        }
      } else {
        self.data.head = {
          'content-type': 'application/json',
          'Authorization': 'Token ' + app.globalData.token
        }
      }
      wx.request({
        url: app.globalData.baseUrl + '/api/topic_types_simple/',
        method: 'GET',
        data: {

        },
        header: this.data.head,
        success(res) {
          temp = res.data.filter(x => x.name != '博雅')
          for (let i = 0; i < temp.length; i++) {
            t.push(temp[i].name)
          }
          self.setData({
            type: t
          })
        },
        fail(res) {
          getApp().globalData.util.netErrorToast()
        }
      })
    }

  },
  options: {
    addGlobalClass: true
  }

})