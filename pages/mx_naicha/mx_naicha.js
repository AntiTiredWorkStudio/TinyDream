//index.js

//获取应用实例
const app = getApp()
var C = app.lib

// pages/mx_naicha/mx_naicha.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: {
      selection: "mine",
      mine: "col-4 memu_act",
      bingo: "col-4 menu_unact",
      plan: "col-4 menu_unact",
      dreams:[]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //dr = dlist & uid=11304626
    var page = this
    C.TDRequest("dr", "dlist", 
      {
         uid: app.globalData.openid
      },
      function(code,data){
        console.log(data);
        page.setData({
          dreams:data.dreams
        })
      },function(code,data){

      }
    )
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
  switchType:function(res){
    var page = this
    if (res.currentTarget.id == page.data.type.selection){
      return;
    }
    switch(res.currentTarget.id){
      case "mine":
        page.setData({
          type: {
            selection: "mine",
            mine: "col-4 memu_act",
            bingo: "col-4 menu_unact",
            plan: "col-4 menu_unact",
          }
        })
        break;
      case "bingo":
        page.setData({
          type: {
            selection: "bingo",
            mine: "col-4 menu_unact",
            bingo: "col-4 memu_act",
            plan: "col-4 menu_unact",
          }
        })
        break;
      case "plan":
        page.setData({
          type: {
            selection: "plan",
            mine: "col-4 menu_unact",
            bingo: "col-4 menu_unact",
            plan: "col-4 memu_act",
          }
        })
        break;
    }
  },
  onEdit :function(dream){
    console.log(dream.currentTarget.id)
  },
  onAdd :function(){
    
  }
})