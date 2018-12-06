//index.js

//获取应用实例
const app = getApp()
var C = app.lib

// pages/mx_tanchuang/mx_tanchuang.js
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    dlist: [{}, {}, {}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //bloc tan_li tan_active
  //bloc tan_li
  onLoad: function (options) {
    var page = this
    C.TDRequest("dr", "dlist",
      {
        uid: app.globalData.openid
      },
      function (code, data) {
        var targetlist = {};
        for (var dream in data.dreams){
          
          var id = data.dreams[dream].did
          
          if (data.dreams[dream].state != "SUBMIT" && data.dreams[dream].state != "FAILED" ){
              continue
          }
          //console.log(data.dreams[dream])
          targetlist[id] = data.dreams[dream]
          targetlist[id]['select'] = "bloc tan_li"
        }
        console.log(targetlist)
        page.setData({
          dlist: targetlist
        })
      }, function (code, data) {

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
    //app.onPageExit()
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
  currentSelection:"",
  onSelection :function(res){
    
    var page=this
    
    if(page.currentSelection == res.currentTarget.id){
      return;
    }
    var currentdList = page.data.dlist

    if (page.currentSelection != "") {
      currentdList[page.currentSelection].select = "bloc tan_li"
    }
    currentdList[res.currentTarget.id].select = "bloc tan_li tan_active"
    page.currentSelection = res.currentTarget.id
    page.setData(
        {
          dlist: currentdList
        }
    )
    console.log(res.currentTarget.id)
  },
  onSubmit:function(){
    /*dr=sdream&uid=a01&did=DR1000000108&action={"selectdream" : {"uid" : "a01"},"buy" : {"uid" : "a01","pid" : "100017","dayLim" : 5,"less" : 11999}} */
    if(this.currentSelection == ""){
      wx.showToast({
        title:"还未选择梦想!",
        icon:"none"
      })
      return;
    }
    C.TDRequest(
      "dr",
      "sdream",
      {
        uid: app.globalData.openid,
        did: this.currentSelection,
        action : JSON.stringify(app.actionList)
      },
      function(code,data){
          //console.log(data,app.actionList)
          //wx.navigateBack()
      },
      function(code,data){

      }
    )
   // console.log(app.globalData.openid,this.currentSelection,app.actionList)
  }
})