
//获取应用实例
const app = getApp()
var C = app.lib
// pages/mx_phone/mx_phone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
            tele: "未绑定手机号"
          })
        } else {
          page.setData({
            tele: data.tele
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
    
    if (page.data.inputTele ==""){

      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
      })
      return;
    }
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
    if (page.data.inputCode == "") {

      wx.showToast({
        title: '验证码格式不正确',
        icon: 'none',
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
        wx.showToast({
          title: '绑定成功',
          icon: 'success',
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