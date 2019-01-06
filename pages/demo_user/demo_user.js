// pages/user/user.js

const app = getApp()
var C = app.lib
Page({

    /**
     * 页面的初始数据
     */
    data: {
      hasDream:false,
      hasPay:false,
      dreamName:"暂未提交梦想",
      dreamContent:"点击填写并提交自己的梦想",
    },
    onSubmitAndPay:function(){
        if(this.data.hasDream&& this.data.hasPay){
          wx.showToast({
            title: '您已提交并购买了梦想',
            icon:'none'
          })
          return;
        }
        wx.navigateTo({
          url: '/pages/demo_help/demo_help',
        })
    },
    order: function () {
        wx.navigateTo({
          url: '/pages/demo_order/demo_order',
        })
    },
    help: function () {
        wx.navigateTo({
          url: '/pages/demo_application/demo_application',
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
    onShow: function () {
      var page = this
      console.log(app.globalData.openid);
      C.TDRequest('cs', 'ud',
        { uid: app.globalData.openid},
        function (code, data) {
          console.log(data)
          if (data.dream.length <= 0) {
            page.setData({
              hasDream: false,
              hasPay: false,
              dreamName: "暂未提交梦想",
              dreamContent: "点击填写并提交自己的梦想",
            })
            wx.showToast({
              title: '暂无梦想',
              icon: 'none'
            })
          } else {
              page.setData({
                hasDream: true,
                hasPay: (data.dream[0]).ptime!=0,
                dreamName: data.dream[0].title,
                dreamContent: data.dream[0].content,
              })
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