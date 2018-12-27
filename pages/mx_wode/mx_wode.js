//index.js

//获取应用实例
const app = getApp()
var C = app.lib
// pages/mx_wode/mx_wode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    owner:{}
  },
  loadTimes:0,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadTimes++;
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    //us=selfinfo&uid=a01
    var page = this
    C.TDRequest('us','selfinfo',
    {
      uid:app.globalData.openid
    },
    function(code,data){
      console.log(data)
      var selfInfo = data.selfinfo
      selfInfo.totalReward = C.BillExchange(parseInt(selfInfo.totalReward))
      page.setData({
        owner: selfInfo
      })
      
      if (C.ExistIntendData('pay')){
        console.log('intend:pay',C.ExistIntendData('pay'))
        C.RemoveIntendData('pay')
        page.myPool()
      }
    },
    function(code,data){

    }
    )
  },
  teleManage:function(){
    C.Intend("../mx_phone/mx_phone")
  },
  selfIdentitfy:function(){
    C.Intend("../mx_shenfenzheng/mx_shenfengzheng");
  },
  dreamServer:function(){
    C.Intend("../mx_dreamserver/mx_dreamserver")
  },
  questions: function () {
    C.Intend("../mx_wenti/mx_wenti")
  },
  myPool:function(){
    C.TDRequest(
      "ds", 'plists', {
      },
      function (code, data) {
        //  console.log(data.poolCount) 
        var poolCount = data.poolCount;
        C.TDRequest(
          "ds", "plistg",
          {
            uid: app.globalData.openid,
            min: 1,
            max: 10
          }, function (code, data) {
            //  console.log(data)
            C.SetPageIntendData("jinxing", data.Pools);
            C.Intend("../mx_jinxing/mx_jinxing?pcount=" + poolCount + "&min=1&max=10&type=mine");
          },
          function (code, data) { console.log(data) }
        );
      },
      function (code, data) { console.log(data) }
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

  , onCommunicate:function(){
    wx.makePhoneCall({
      phoneNumber: '15601390196',
    })
  },

  onShow() {
    C.ReloadTabPage();
  }
})