// pages/certification/certification.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const DEFAULT_AVATAR_URL = 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data:{
    //步骤条内容
		stepsList: [{
      name: '信息授权'
    }, {
      name: '方式选择'
    }, {
      name: '信息填写'
    }, {
      name: '申请完成'
    }
  ],
    //步骤条序号
    num: 0,
    //信息授权check
    checked: false,
    //信息授权按钮禁用
    wrrantDisabled: true, 
    //方式填写radio
    radio: '1',
    //输入框1内容
    input1: '',
    //输入框2内容
    input2: '',
    //输入框3内容
    input3: '',
    //输入框4内容
    input4: '',
    //输入框1错误信息
    errMsg1: '',
    //输入框2错误信息
    errMsg2: '',
    //输入框3错误信息
    errMsg3: '',
    //输入框4错误信息
    errMsg4: '',

    //通过方式二上传的照片临时链接
    fileList:[],
    //最大数量
    fileMaxNum: 1,

    //用户信息
    userInfo: null,
    //code
    code: '',
    //注册按钮禁用
    disabled: false
  },

  checkedChange(event){
    this.setData(
      {
        checked: event.detail,
      }
    )
    if(this.data.checked == true){
      this.setData(
        {
          wrrantDisabled: false,
        }
      )
    }else{
      this.setData(
        {
          wrrantDisabled: true,
        }
      )
    }
  },
  
  radioChange(event){
    this.setData(
      {
        radio: event.detail
      }
    )
  },

  sendMail(){
    if(this.data.input1==''){
      this.setData({
        errMsg1: '邮箱不能为空'
      })
      
    }
    let reg = new RegExp('^.+@buaa\.edu\.cn$')
    if(!reg.test(this.data.input1) && this.data.errMsg1 == '' && this.data.radio == '1'){
      this.setData({
        errMsg1: '该邮箱不是北航邮箱'
      })
    }
    if(this.data.errMsg1 == ''){
      Toast.loading({
        message: '邮件发送中...',
        forbidClick: true,
        duration: 0
      });
      wx.request({
        url: getApp().globalData.baseUrl + '/api/users/get_email_verification/',
        method: 'POST',
        data: {
          'email': this.data.input1
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          if(res.statusCode == 200){
            Toast.clear()
            wx.showToast({
              title: '邮件发送成功',
            })
            wx.requestSubscribeMessage({
              tmplIds: [
                '-FAyi3t4dQSNPa5uwAgUNXocZSp01cQhiScffMrFfZI',
                '-FAyi3t4dQSNPa5uwAgUNXocZSp01cQhiScffMrFfZI',
                '-FAyi3t4dQSNPa5uwAgUNQ-ejjKOitTnlnkzsNJNbZo'],
              success (res) { }
            })
          }else{
            Toast.clear()
            /*wx.showToast({
              title: '邮件发送失败',
              icon: 'error'
            })*/
            wx.showModal({
              content: res.data.detail || '邮件发送失败',
              showCancel: false
            })
          }
        },
        fail(res){
          Toast.clear()
          getApp().globalData.util.netErrorToast()
        }
      })
    }
  },

  nextStep(event) {
    
    if(this.data.num == 0){
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.setData({
            userInfo: res.userInfo,
          })
        },
        fail: (res) => {
          this.setData({
            num: 0
          })
        }
      })
      this.setData({
        num: 1
      })
    }else if(this.data.num == 1){
      if(this.data.userInfo == null){
        this.setData({
          num: 0
        })
      }else{
        this.setData({
          num: 2,
        })
        if(this.data.radio == '1'){
          this.setData({
            input1: '@buaa.edu.cn'
          })
        }
      }
    }
    else if(this.data.num == 2){
      let noError = true
      if(this.data.input1==''){
        this.setData({
          errMsg1: '邮箱不能为空'
        })
        noError = false
      }
      if(this.data.input2==''){
        this.setData({
          errMsg2: '验证码不能为空'
        })
        noError = false
      }
      if(this.data.input3==''){
        this.setData({
          errMsg3: '手机号不能为空'
        })
        noError = false
      } else if (!util.validatemobile(this.data.input3)) {
        this.setData({
          errMsg3: '请输入正确的手机号'
        })
        noError = false
      }

      if(this.data.input4==''){
        this.setData({
          errMsg4: '学号不能为空'
        })
        noError = false
      } else if (!util.validateStudentID(this.data.input4)) {
        this.setData({
          errMsg4: '请输入正确的学号'
        })
        noError = false
      }

      let reg = new RegExp('^.+@buaa\.edu\.cn$')
      if(!reg.test(this.data.input1) && this.data.errMsg1 == '' && this.data.radio == '1'){
        this.setData({
          errMsg1: '该邮箱不是北航邮箱'
        })
        noError = false
      }
      if(this.data.fileList.length == 0 && this.data.radio == '2'){
        wx.showToast({
          title: '图片不能为空',
          icon: 'error'
        })
        noError = false
      }
      if(noError){
        //用户审核接口
        let self = this
        self.setData({
          disabled: true
        })
        //显示加载
        Toast.loading({
          message: '认证信息提交中...',
          forbidClick: true,
          duration: 0
        });
        //重新获取code
        wx.login({
          success: res => {
            self.setData({
              code: res.code,
            })
            let code = self.data.code
            let userInfo = self.data.userInfo
            if(self.data.radio == '1'){
              wx.request({
                url: getApp().globalData.baseUrl + '/api/users/register/',
                method: 'POST',
                data: {
                  'code': code,
                  'email_verification_code': self.data.input2,
                  'email': self.data.input1,
                  'nickName': userInfo.nickName,
                  'avatarUrl': userInfo.avatarUrl,
                  'gender': userInfo.gender,
                  'student_id': self.data.input4,
                  'phone': self.data.input3
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success (res) {
                  Toast.clear();
                  self.setData({
                    disabled: false
                  }) 
                  if(res.statusCode == 201){
                    self.setData({
                      num: 3
                    })
                  }else{
                    console.log(res)
                    wx.showToast({
                      title: '身份认证失败',
                      icon: 'error'
                    })
                  }
                },
                fail(res){
                  Toast.clear();
                  self.setData({
                    disabled: false
                  }) 
                  getApp().globalData.util.netErrorToast()
                }
              })
            }else if(self.data.radio == '2' && self.data.fileList.length > 0){
              wx.uploadFile({
                url: getApp().globalData.baseUrl + '/api/users/register/',
                filePath: self.data.fileList[0],
                name: 'credential',
                formData: { 
                  'code': code,
                  'email': self.data.input1,
                  'email_verification_code': self.data.input2,
                  'nickName': userInfo.nickName,
                  'avatarUrl': userInfo.avatarUrl || DEFAULT_AVATAR_URL,
                  'gender': userInfo.gender,
                  'student_id': self.data.input4,
                  'phone': self.data.input3
                },
                success(res) {
                  Toast.clear();
                  self.setData({
                    disabled: false
                  }) 
                  if(res.statusCode == 201){
                    self.setData({
                      num: 3
                    })
                  }else{
                    // console.log(res)
                    wx.showToast({
                      title: '信息提交失败',
                      icon: 'error'
                    })
                  }
                },
                fail(res){
                  Toast.clear();
                  self.setData({
                    disabled: false
                  }) 
                  getApp().globalData.util.netErrorToast()
                }
              })
            }
          }
        })
      }       
    }
  },

  saveInput1(event){
    this.setData({
      input1: event.detail,
      errMsg1: ''
    })
    
  },

  saveInput2(event){
    this.setData({
      input2: event.detail,
      errMsg2: ''
    })
    
  },

  saveInput3(event){
    this.setData({
      input3: event.detail,
      errMsg3: ''
    })
    
  },

  saveInput4(event){
    this.setData({
      input4: event.detail,
      errMsg4: '',
    })
    if(this.data.radio == '1'){
      this.setData({
        input1: event.detail + '@buaa.edu.cn'
      })
    }
    
  },

  ChooseImage() {
    wx.chooseImage({
      count: this.data.fileMaxNum,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        if (this.data.fileList.length != 0) {
          this.setData({
            fileList: this.data.fileList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            fileList: res.tempFilePaths
          })
        }
      }
    });
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.fileList,
      current: e.currentTarget.dataset.url
    });
  },

  DelImg(e) {
    wx.showModal({
      content: '确定删除该照片吗？',
      cancelText: '取消',
      confirmText: '确认',
      success: res => {
        if (res.confirm) {
          this.data.fileList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            fileList: this.data.fileList
          })
        }
      }
    })
  },

  gotoHome(){
    wx.switchTab({
      url: '../activity/home/home',
    })
  },

  gotoHomeSuccess() {
    getApp().myLogin()
    const messages = {
      unread_count: 0
    }
    wx.setStorageSync('messages', messages)
    const messagesId = []
    wx.setStorageSync('messagesId', messagesId)
    getApp().globalData.messageCount = 0
    wx.switchTab({
      url: '../activity/home/home',
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
  onShow: function (e) {

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