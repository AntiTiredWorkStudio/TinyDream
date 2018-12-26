
//获取应用实例
const app = getApp()
var C = app.lib
// pages/mx_phone/mx_phone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 是否绑定过手机号
    isphone: false,
    // 已绑定的手机号
    oldPhoneNum: "",
    phoneNum: '',
    changebg: false,
    isdisable: false,
    tip: '点击获取',


    tele:"未绑定手机号",
    inputTele:"",
    inputCode:""
  },
  teleInput: function (con){
    this.setData({
      inputTele: con.detail.value
    });
  },
  codeInput: function (con) {
    this.setData({
      inputCode: con.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onInit()
  },
  onInit: function () {
    var page = this
    C.TDRequest(
      'va', 'pbind', { uid: app.globalData.openid },
      function (code, data) {
        console.log(data)
        if (data.tele == "") {
          page.setData({
            isphone:false,
            oldPhoneNum: ""
          })
        } else {
          page.setData({
            isphone: true,
            oldPhoneNum: data.tele
          })
        }
      },
      function (code, data) {
        console.log(data)
      }
    );
  }
  ,
  generateCode: function () {
    var page = this
    if(this.data.isdisable){
      return;
    }
    if (page.data.inputTele == page.data.oldPhoneNum) {
      wx.showToast({
        title: '输入的手机号和已绑定手机号相同',
        icon: 'none',
      })
      return;
    }
    if (page.data.inputTele ==""){

      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
      })
      return;
    }

    this.onGetCode()
    C.TDRequest('va', 'gcode', { tele: page.data.inputTele },
      function (code, data) {
        console.log(data)
        wx.showToast({
          title: '验证码已发送',
          icon: 'success',
        })
      },
      function (code, data) {
        console.log(data)
        wx.showToast({
          title: data.context,
          icon: 'none',
        })
      })
    //console.log("generateCode:" + this.data.inputTele);
  },
  submitCode: function () {
    var page = this


    if (page.data.inputCode == '') {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        mask: true
      })
      return;
    }

    C.TDRequest('va', 'bind', 
    { uid: app.globalData.openid,
      tele: page.data.inputTele,
      code: page.data.inputCode, },
      function (code, data) {
        console.log(data)
        page.setData({
          inputTele: "",
          inputCode: ""
        })
        wx.navigateBack({
          complete: function () {
            wx.showToast({
              title: '绑定成功',
              icon: 'success',
            })
          }
        })
        page.onInit()
      },
      function (code, data) {
        console.log(data)
        wx.showToast({
          title: data.context,
          icon: 'none',
        })
      })
  },



  // 验证码输入框逻辑处理
  changebg: function () {
    this.setData({
      changebg: true
    })
  },
  // 判断手机号正确性
  check: function (e) {
    console.log(e)
    var reg = /^1([3578][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
    if (e.detail.value == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        mask: true
      })
      return false;
    } else {
      if (e.detail.value.length == 11) {
        if (!reg.test(e.detail.value)) {
          e.detail.value = '';
          wx.showToast({
            title: '请输入正确的手机号',
            icon: 'none',
            mask: true
          })
          return false;
        } else {
          this.setData({
            isdisable: false,
            phoneNum: e.detail.value
          })
        }
      }
    }
  },
  onGetCode: function (e) {
    // 进行网络请求
    var num = 60;
    let that = this;
    var timer = setInterval(function () {
      num--;
      if (num < 10) {
        num = '0' + num;
      }
      if (num <= 0) {
        console.log(that.data.tip)
        that.setData({
          tip: '重新发送',
          isdisable: false
        })
        console.log(that.data.tip)
        clearInterval(timer);
      } else {
        that.setData({
          tip: num + '秒',
          isdisable: true
        })
      }
    }, 1000)
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