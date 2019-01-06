// pages/application/application.js

const app = getApp()
var C = app.lib
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

    },
    description: "",
    difficult: "",
    help: "",
    onInputDescription:function(res){
      this.description = res.detail.value;
    },
    onInputDifficult: function (res) {
      this.difficult = res.detail.value;
    },
    onInputHelp: function (res) {
      this.help = res.detail.value;
    },
    submit:function(){
      if (this.description== ""||
        this.difficult== "" ||
        this.help== ""){
            wx.showToast({
              title: '信息填写不完整',
              icon:'none'
            })
            return;
          }
      wx.navigateBack({
        delta:1,
        success:function(res){
            wx.showToast({
              title: '提交成功',
              icon:'success'
            })
        }
      })  
    }
})