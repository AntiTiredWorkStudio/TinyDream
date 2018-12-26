// pages/luckyDream/luckyDream.js

//获取应用实例
const app = getApp()
var C = app.lib
Page({

    /**
     * 页面的初始数据
     */
    data: {
      ptitle : "",
      dtitle: "",
      lid:"",
      cbill:{},
      state:""
    },

    // 查看领奖进度
    look: function () {
       
      C.Intend("../mx_award/mx_award?id=" + this.targetDid)
    },
    // 完善梦想
    perfect: function () {
      C.Intend("../mx_xieyi/mx_xieyi?id=" + this.targetDid + "&state=" + this.state);
    }, 
    targetDid:"",
    state :"",
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log(options)
      this.targetDid = options.id;
      this.state = options.state;
      var bingoData = C.GetAndRemoveIntentData('bingo')
      console.log(bingoData)
      this.setData(
        {
          ptitle: bingoData.pool.ptitle,
          dtitle: bingoData.title,
          lid: bingoData.lottery.lid,
          cbill: C.BillExchange(bingoData.pool.cbill),
          state:bingoData.state
        }
      );
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