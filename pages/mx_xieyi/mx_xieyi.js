//index.js

//获取应用实例
const app = getApp()
var C = app.lib

// pages/mx_xieyi/mx_xieyi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
    //console.log("on hide")
    app.onPageExit()
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

  } ,
  title:"",
  content:"",
  agree:false,
  titleInput: function (res) {
    this.title = res.detail.value
  },
  contentInput: function (res) {
    this.content = res.detail.value
  },
  checkedEvent: function (res) {
    this.agree = Object.keys(res.detail.value).length ==1;
    console.log(this.agree)
  },
  submitDream: function (res) {
    console.log("提交梦想")
    if(!this.agree){
      wx.showToast({
        title:"还未同意用户协议",
        icon:"none"
      })
      return;
    }

    //dr = dedit & uid=a01 & title=关于程序的梦想 & content=我就特么想赶紧做完这个
    var dataset = {
      uid: app.globalData.openid,
      title: this.title,
      content: this.content,
      //action: app.actionList
    }
    if(Object.keys(app.actionList).length>0){
      dataset.action = JSON.stringify(app.actionList)
      console.log(app.actionList);
    }

    C.TDRequest("dr","dedit",
      dataset, 
      function(code,data){
        console.log(data)
      },
      function (code, data) {
        console.log(data)
      }
    )
  }
})