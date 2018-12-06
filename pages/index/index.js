//index.js
//获取应用实例
const app = getApp()
var C = app.lib

var index = Page({
  data: {
    authVisible: true,
    poolHours:0,
    poolMinutes:0,
    poolSeconds:0,
    mainpool:{
      cbill:0,
      tbill:10000,
      durnation:10000,
      ubill:10,
      ptime:C.PRCTIME(),
      ptitle:"默认梦想池"
    },
    orderAnimation:{},
    orderList:[],
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLogin:function(openid){
    console.log(openid)
    var page = this
    wx.getSetting({
      success: res => {
        console.log(res);
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        if (res.authSetting['scope.userInfo']) {
          page.setData(
            {
              authVisible : false
            }
          )
          page.onGetUserInfo()
        } else {//未授权
          page.setData(
            {
              authVisible: true
            }
          )
          console.log("发起授权");
        }
      }
    })
  },
  onLoad: function () {
    if (app && app.onLoadPage){
      app.onLoadPage(this)
    }

    /*显示时间戳
    wx.showModal({
      title: 'time',
      content: ''+C.PRCTIME(),
    })*/

    if (app.globalData.hasInfo){//如果已经获取过用户信息
      console.log("已经获取过用户信息")
      this.onInfoReady()
    } else {
      console.log("未获取过用户信息")
    }
  },
  showIndex: 0,
  animOpcity:0,
  countDown: function () {
//    console.log(this.duration)
    var sec = (Math.floor(this.mainpooltime) + Math.floor(this.duration)) - Math.floor(C.PRCTIME())
    var h = Math.floor(sec / 3600);
    var m = Math.floor(Math.floor(sec % 3600) / 60);
    var s = Math.floor(sec % 60);
    this.setData({
      poolHours:h,
      poolMinutes:m,
      poolSeconds:s
    });
    //console.log(sec)
  },
  setMainPool :function(pool){
    //this.mainpool = pool
    console.log("main pool:",pool)
    
    var billResult = C.BillExchange(pool.cbill);
    
    pool.realBill = billResult.value;
    pool.unit = billResult.unit;
    pool.percentVal = Math.floor((pool.cbill / pool.tbill) *10000)/100
    console.log("billResult:",billResult);
    this.setData({
      mainpool:pool
    })
    
  },
  
  orderInterval: null,
  countdownInterval: null,
  switchOrders:function(){
    //console.log("轮播")
    var animation = wx.createAnimation()
    this.animOpcity = 0.0
    //animation.opacity(0.5).step({ duration: 0 })
   /* animation.opacity(1).step()
    this.setData({
      orderAnimation: animation.export()
    })*/
    var that = this;
    

    var start = 0+this.showIndex*3
    var end = 3 + this.showIndex*3
    if(end>this.fullOrderList.length){
      end = this.fullOrderList.length
      this.showIndex = 0;
    }else{
      this.showIndex++;
    }
    var i = 0;
    var currentShowList = [];
    var time = C.PRCTIME();
    for(var key=start;key<end;key++){
      var outdate = time - this.fullOrderList[key].ptime;
      this.fullOrderList[key].ctime = C.DescriptionTime(outdate);
      var cNickname = this.fullOrderList[key].nickname;
      //console.log(cNickname.length);
      if (cNickname.length>4){
        cNickname = cNickname.substr(0, 4) +"..."
      }
      this.fullOrderList[key].cNickname = cNickname
      /*if (this.fullOrderList[key].nickName.replace(/[\u0391-\uFFE5]/g, "aa").length >5){
        this.fullOrderList[key].nickName = substr(this.fullOrderList[key].nickName,0,4) +"..."
      }*/
//      this.fullOrderList[key]
      currentShowList[i++] = this.fullOrderList[key]
    }
    this.setData({
      orderList: currentShowList
    })
   // console.log(start,end);
  },
  onGetUserInfo:function(res){
    var page = this
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        app.globalData.nickname = res.userInfo.nickName
        app.globalData.headicon = res.userInfo.avatarUrl
        app.globalData.hasInfo = true
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        //console.log(app.globalData);
        page.onInfoReady()
      }
    })
  },
  onInfoReady :function(){

    var page = this
    wx.showShareMenu({
      withShareTicket:true
    })
    console.log("onInfoReady")
    C.TDRequest("us", "enter",
      {
        uid: app.globalData.openid,
        nickname: app.globalData.nickname,
        headicon: app.globalData.headicon,
      }, function (code, data) {
        page.setData(
          {
            authVisible: false
          }
        )
        page.onPageLaunch(data)

        console.log(data);
      }, function (code, data) {
        console.log(data);
      }
    );
  },
  onPageLaunch: function (data) {
    // console.log("onPageIntend:" + window.localStorage);
    var that = this;
    var enterResult = data
    console.log("enterResult:", data);
    that.fullOrderList = enterResult.buyinfo
    that.mainpooltime = enterResult.mainpool.ptime;
    that.duration = enterResult.mainpool.duration;
    that.setMainPool(enterResult.mainpool)
    this.countdownInterval = setInterval(that.countDown, 1000);
    //启动订单轮播
    that.switchOrders();
    this.orderInterval = setInterval(that.switchOrders, 8000);
    //console.log("showShareMenu")
  },
  morePools: function (res) {

    //ds = plistg & uid=11304626 & min=1 & max=10
    C.TDRequest(
      "ds",'plists',{
      }, 
      function (code, data) { 
      //  console.log(data.poolCount) 
        var poolCount = data.poolCount;
        C.TDRequest(
          "ds", "plistg",
          {
            uid: app.globalData.openid,
            min: 0,
            max: 10
          }, function (code, data) {
           //  console.log(data)
            C.SetPageIntendData("jinxing", data.Pools);
            C.Intend("../mx_jinxing/mx_jinxing?pcount=" + poolCount + "&min=1&max=10");
              },
          function (code, data) { console.log(data) }
        );
      },
      function (code, data) { console.log(data) }
    );

    //C.Intend("../mx_jinxing/mx_jinxing");
  },
  joinin :function(res){
   // console.log(res.currentTarget.id)
   // console.log(app.globalData.openid);
    C.TDRequest(
      "ds", "buy", { uid: app.globalData.openid,pid:res.currentTarget.id},
      function (code, data) { console.log(data) }, function (code, data)        { 
        console.log(data)
        if(code == '11'){
          wx.showModal({
            title: '提示',
            content: '您还没有绑定手机号',
            confirmText:'前往绑定',
            cancelText:'取消',
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
        if (code == '18'){
            wx.showToast({
              title: '已到达当日购买上限',
              icon : 'none'
            })
        }

        }
    )
    
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
      console.log("on unload")
      if (this.orderInterval) {
        clearInterval(this.orderInterval)
      }
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval)
      }
  },
})
