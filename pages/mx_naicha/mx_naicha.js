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
      canAddDream : true,
      dreams:[],
      bingos:[]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //dr = dlist & uid=11304626
    wx.setNavigationBarTitle({
      title: '小梦想'
    })
    app.onLoadPage(this)
    this.updateList()
    if(options.hasOwnProperty('type')){
      this.switchType({ currentTarget: { id: options.type}});
    }
  },
  getTitleDescription :function(state){
    //'SUBMIT','DOING','VERIFY','FAILED','SUCCESS'
    switch (state) {
      case "SUBMIT":
        return '';
      case "DOING":
        return '[正在进行]';
      case "VERIFY":
        return '[审核中]';
      case "FAILED":
        return '[失败]';
      case "SUCCESS":
        return '[成功]';
    }
  },
  indexDreamList:{},
  updateList: function () {
    var page = this
    C.TDRequest("dr", "dlist",
      {
        uid: app.globalData.openid
      },
      function (code, data) {
        console.log(data);
        var dreams = data.dreams
        var bingoDreams = []
        for(var key in data.dreams){
          if (data.dreams[key].state == "DOING" || data.dreams[key].state == "VERIFY"){
            bingoDreams.push(data.dreams[key])
          }

          dreams[key].title = dreams[key].title + page.getTitleDescription(dreams[key].state)

          page.indexDreamList[dreams[key].did] = dreams[key]
        }

        console.log(bingoDreams)

        page.setData({
          dreams: data.dreams,
          bingos: bingoDreams,
          canAddDream: (data.dcount.code == '0')
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
    var page = this
    if (!page.indexDreamList.hasOwnProperty(dream.currentTarget.id)){
      console.log("没有id(但这是不可能的)")
      return;
    }
    var targetDream  = page.indexDreamList[dream.currentTarget.id]
    if (targetDream.state != "SUBMIT" && targetDream.state != "FAILED"){
      wx.showToast({
        title: '无法对正在进行或已经结束的梦想进行修改',
        icon:'none'
      })
      return;
    }
    console.log(page.indexDreamList)
    
    C.Intend("../mx_xieyi/mx_xieyi?id=" + dream.currentTarget.id);
  },
  /*onAdd :function(){
    
  },*/
  onDreamPerfect(res){
    console.log("onDreamPerfect",res.currentTarget.id)
    C.Intend("../mx_xieyi/mx_xieyi?id=" + res.currentTarget.id +"&state=all");
  },
  onDreamVerify(res) {
    console.log(res.currentTarget.id)
    var page = this
     C.TDRequest("ds", "sver",{
       uid:app.globalData.openid,
       did: res.currentTarget.id
     },
     function(code,data){
        console.log(data)
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        })
        page.updateList()
     },
       function (code, data) {
         console.log(data)

         wx.showToast({
           title: data.context,
           icon: 'none'
         })
         page.updateList()
     }
     );
  },
  onCommunicate(res) {
    console.log(res.currentTarget.id)
    /*wx.makePhoneCall({
      phoneNumber: '400-600-2233',
    })*/
    this.switchType({currentTarget:{id:'plan'}})
  },
  longTap: function () {
    console.log('longTap')
    wx.setClipboardData({
      data: "Melodybaby0925",
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({ title: '微信号复制成功' })
          }
        })
      }
    })
  }
})