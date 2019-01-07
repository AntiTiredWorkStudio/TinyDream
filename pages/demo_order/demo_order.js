// pages/order/order.js

const app = getApp()
var C = app.lib
Page({

    /**
     * 页面的初始数据
     */
    data: {
      title:"",
      time:0,
      bill:0,
      has:false,
      pay:false,
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
    pay:function(){
      var page = this
      console.log(this.server)
      C.TDRequest('cs', 'sp',
        {
          uid: app.globalData.openid,
          title: this.server.title,
          content: this.server.content,
          server: this.server.server,
          bill: this.server.bill,
        },
        function (code, data) {
          console.log(data)
          wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            complete: function (res) {
              if (res.errMsg == 'requestPayment:ok') {
                C.TDRequest('cs','paid',
                {
                  uid:app.globalData.openid,
                  hid:data.hid
                },
                  function (code, data) {
                    console.log(data)
                  /*wx.navigateBack({
                    delta: 1
                  })*/
                    page.onShow();
                },
                  function (code, data) {
                    console.log(data)
                }
                )
              } else {
                wx.showToast({
                  title: '支付取消',
                  icon: 'none'
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
     * 生命周期函数--监听页面显示
     */
    server:null,
    onShow: function () {
      var  page = this
      C.TDRequest('cs', 'ud',
        { uid: app.globalData.openid },
        function (code, data) {
          console.log(data)
          if (data.dream.length <= 0) {
            page.setData({
              has:false
            })
            wx.showToast({
              title: '暂无梦想',
              icon: 'none'
            })
          } else {
            page.server = data.dream[0]
            if(data.dream[0].ptime==0){
              page.setData({
                title: data.dream[0].title,
                time: C.GetLocalTime(data.dream[0].ctime),
                bill: data.dream[0].bill,
                has: true,
                pay: false
              })
            }else{
              page.setData({
                title: data.dream[0].title,
                time: C.GetLocalTime(data.dream[0].ptime),
                bill: data.dream[0].bill,
                has: true,
                pay:true
              })
            }
            wx.hideLoading()
          }
        }, function (code, data) {
          console.log(data)
        }
      );
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