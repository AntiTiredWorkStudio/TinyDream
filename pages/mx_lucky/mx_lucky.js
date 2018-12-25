// pages/lucky/lucky.js
const app = getApp()
var C = app.lib
Page({

    /**
     * 页面的初始数据
     */
    data: {
      awards:[]
    },
    luckyInfo(res){
      C.SetPageIntendData("award", this.data.awards[res.currentTarget.id]);
        wx.navigateTo({
          url: '/pages/mx_luckyInfo/mx_luckyInfo',
        })
    },
    count :0,
    seek : 0,
    size : 3,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var page = this
      C.TDRequest("aw", "cplu",{},
      function(code,data){
        console.log(data)
        page.count = data.count
        page.loadItem()
      },
        function (code, data) {
          console.log(data)
      })
    },
    loadItem:function(){
      var page = this
      if (this.seek < this.count){
        C.TDRequest("aw", "gplu", 
          {
            seek:this.seek,
            count:this.count
          },
          function (code, data) {
            console.log(data)
            var current = page.data.awards;
            for (var award in data.awards) {
              current.push(data.awards[award])
            }
            page.setData({
              awards: current
            })
          },
          function (code, data) {
            console.log(data)
          })

        this.seek += this.size;
        if (this.seek >= this.count) {
          wx.showToast({
            title: '已经全部加载',
            icon: 'none'
          })
        }
      }else{
        wx.showToast({
          title: '已经全部加载',
          icon: 'none'
        })
      }
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
      this.loadItem()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})