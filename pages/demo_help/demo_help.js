// pages/help/help.js

const app = getApp()
var C = app.lib
Page({

    /**
     * 页面的初始数据
     */
    data: {
      server:{
        book: false,
        teacher: false,
        report:false,
      },
      totalBill:0,
    },
    prices:{},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var page = this;
      C.TDRequest('cs', 'ud',
        { uid: app.globalData.openid },
        function (code, data) {
          console.log(data)
          page.prices = data.prices;
        }, function (code, data) {
          console.log(data)
        }
      );
    },
    onSelectServer:function(res){
      console.log(res.currentTarget.id)
      var cServer = this.data.server;
      cServer[res.currentTarget.id] = !cServer[res.currentTarget.id]
      console.log(this.getServerType())
      this.setData({
        server: cServer,
        totalBill: this.getBill()
      })
    },
    getBill:function(){
      return Math.round((this.data.server.book * this.prices.book + this.data.server.teacher * this.prices.teacher + this.data.server.report * this.prices.report) * 100) / 100;
    },
    getServerType:function(){
      return JSON.stringify(this.data.server).replace(/\"/g, "'");
    },
    hasSelectServer:function(){
      return this.data.server.book || this.data.server.teacher || this.data.server.report;
    },
    dreamTitle:"",
    dreamContent:"",
    onInputTitle:function(res){
      console.log(res.detail.value)
      this.dreamTitle = res.detail.value;
    },
    onInputContent: function (res) {
      console.log(res.detail.value)
      this.dreamContent = res.detail.value;
    },
    payAndSubmit:function(){
      var page = this
      if (this.dreamTitle == "" || this.dreamContent == ""){
        wx.showToast({
          title: '信息填写不完整',
          icon:'none'
        })
        return;
      }

      if (!this.hasSelectServer()){
        wx.showToast({
          title: '还未选择服务',
          icon: 'none'
        })
        return; 
      }
      //'uid', 'title', 'content', 'server', 'bill'
      C.TDRequest('cs', 'sp', 
        {
          uid:app.globalData.openid,
          title: this.dreamTitle,
          content: this.dreamContent,
          server:page.getServerType(),
          bill:page.getBill()*100
        },
        function(code,data){
          console.log(data)
          wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            complete:function(res){
              if (res.errMsg == 'requestPayment:ok') {
                C.TDRequest('cs', 'paid',
                  {
                    uid: app.globalData.openid,
                    hid: data.hid
                  },
                  function (code, data) {
                    console.log(data)
                    wx.navigateBack({
                      delta: 1
                    })
                  },
                  function (code, data) {
                    console.log(data)
                  }
                )
              }else{
                wx.showToast({
                  title: '支付取消',
                  icon:'none'
                })
              }
            }
          })
        },
        function (code, data) {
          console.log(data)
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