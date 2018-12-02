//index.js

//获取应用实例
const app = getApp()
var C = app.lib
// pages/mx_jinxing.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poolcount: 0,
    start: 0,
    end: 0,
    showingPool:{},
    runningPool:{},
    joinedPool:{},
    historyPool:{},
    type: {
      selection: "running",
      running: "col-4 memu_act",
      joined: "col-4 menu_unact",
      history: "col-4 menu_unact",
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app && app.onLoadPage) {
      this.setData(
        { 
          poolcount: options.pcount ,
          start: options.min,
          end: options.max
        })

      this.running = [];
      this.joining = [];
      this.history = [];

      app.onLoadPage(this)
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
  onloading : false,
  onReachBottom: function () {
    if(this.onloading){
      return;
    }
    this.onloading = true;
    console.log("upload");
    var page = this;
    var tMin = page.data.end
    var tMax = (parseInt(page.data.end)  + 3)
    if(tMax > page.data.poolcount){
      tMax = page.data.poolcount;
    }
    if (tMin >= page.data.poolcount){
      console.log("全部加载完毕")
      wx.showToast({
        title: '已经到最底部了',
        icon: 'none'
      })
      return;
    }
    this.setData(
      {
        start: tMin,
        end: tMax,
      }
    );
    console.log(tMin,tMax);
    wx.showToast({
      title: '正在加载',
      icon:'loading'
    })
    C.TDRequest(
      "ds", "plistg",
      {
        uid: app.globalData.openid,
        min: page.data.start,
        max: page.data.end
      }, function (code, data) {
        console.log(data)
        page.pushToDreamPoolsList(data.Pools);
        page.onloading = false;
        wx.hideToast()
      },
      function (code, data) {
        console.log(data)
        page.onloading = false;
        wx.hideToast()}
    );
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onPoolControl: function (target){
    //console.log(target.currentTarget.id);
    //console.log(this.data.showingPool);
   /* if (this.data.showingPool.hasOwnProperty(target.currentTarget.id)){
      console.log("hasOwnProperty");
    }*/
    var page = this;
    for (var key in this.data.showingPool){
      //console.log(this.data.showingPool[key]);
      
      if (target.currentTarget.id == this.data.showingPool[key].pid){
        var ustatus = this.data.showingPool[key].ustatus;
        if (ustatus == "JOIN|AWARD" || ustatus == "JOIN|NOTAWARD" || ustatus == "NONE|NOTAWARD"){
          page.onPoolView(target);
        }else{
          page.onPoolJoin(target);
        }
        break;
      }
    }
  },
  onPoolView:function(target){
    console.log("onPoolView:" + target.currentTarget.id);
  },
  onPoolJoin : function(target){
    console.log("onPoolJoin:" + target.currentTarget.id);

      C.TDRequest(
        "ds", "buy", { uid: app.globalData.openid, pid: target.currentTarget.id },
        function (code, data) { 
          console.log(data)
        }, function (code, data){
          console.log(data)
          if (code = '11') {
            wx.showModal({
              title: '提示',
              content: '您还没有绑定手机号',
              confirmText: '前往绑定',
              cancelText: '取消',
              success: function (res) {
                if (res.confirm) {//这里是点击了确定以后
                  console.log('用户点击确定')//跳转到绑定手机页面
                  C.Intend("../mx_phone/mx_phone")
                } else {//这里是点击了取消以后
                  console.log('用户点击取消')//取消
                }
              }
            })
          }

        }
      )

  },
  pushToDreamPoolsList: function (pools) {
    var that = this;
    for (var key in pools) {
      var billResult = C.BillExchange(parseInt (pools[key].cbill));
      pools[key].realBill = billResult.value;
      pools[key].unit =  billResult.unit;

      pools[key].percent = Math.ceil(pools[key].cbill / pools[key].tbill * 100)
      var less = (parseInt(pools[key].ptime) + parseInt(pools[key].duration)) - C.PRCTIME()
      if(less<0){
        pools[key].tdescription = "互助结束"
        pools[key].btnStyle = "color:white;background:#e60012;border-radius:15px;margin-right:10px"
        pools[key].btnText = "点击查看"
      }else{
        pools[key].tdescription = "距离结束:" + C.DescriptionTime(less);
        pools[key].btnStyle = "color:white;background:#e9ba65;border-radius:15px;margin-right:10px;margin-right:10px"
        pools[key].btnText = "参与互助"
      }
      
      switch (pools[key].ustatus) {
        case "NONE":
          that.running.push(pools[key])
          break;
        case "JOIN":
          that.joining.push(pools[key])
          break;
        case "JOIN|AWARD":
          that.history.push(pools[key])
          break;
        case "JOIN|NOTAWARD":
          that.history.push(pools[key])
          break;
        case "NONE|NOTAWARD":
          that.history.push(pools[key])
          break;
        default:
          break;
      }
    }

    var targetList = [];
    switch (that.data.type.selection) {
      case "running":
        targetList  = that.running
        break;
      case "joined":
        targetList = that.joining
        break;
      case "history":
        targetList = that.history
        break;
      default:
        targetList = that.history
        console.log("default:" ,that.data)
        break;
    }

    console.log(targetList)
    that.setData({
      showingPool: targetList,//默认显示正在进行中
      runningPool: that.running,
      joinedPool: that.joining,
      historyPool: that.history
    });
  },
  onPageIntend: function () {
    //console.log("OnPageIntentd")
    var page = this;
    C.GetPageIntendDataDync('jinxing', function (res) {
      page.pushToDreamPoolsList(res.data);
    });
  },
  switchType:function(type){
    if (this.data.type.selection == type.currentTarget.id){
      return;
    }
    this.data.type.selection = type.currentTarget.id;
    var page = this;
    console.log(type.currentTarget.id);
    switch(type.currentTarget.id){
      case "running":
        page.setData({
          showingPool: page.data.runningPool,
          type: {
            selection: type.currentTarget.id,
            running: "col-4 memu_act",
            joined: "col-4 menu_unact",
            history: "col-4 menu_unact",
          }
        })
        break;
      case "joined":
        page.setData({
          showingPool: page.data.joinedPool,
          type: {
            selection: type.currentTarget.id,
            running: "col-4 menu_unact",
            joined: "col-4 memu_act",
            history: "col-4 menu_unact",
          }
        })
        break;
      case "history":
        page.setData({
          showingPool: page.data.historyPool,
          type: {
            selection: type.currentTarget.id,
            running: "col-4 menu_unact",
            joined: "col-4 menu_unact",
            history: "col-4 memu_act",
          }
        })
        break;
    }
  }
})