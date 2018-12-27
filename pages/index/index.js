//index.js
//获取应用实例
const app = getApp()
var C = app.lib
var ctx = wx.createCanvasContext('top');
var index = Page({
  data: {
    showSwiper: false,
    authVisible: false,
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
    if(openid == null){
      return
    }
    var page = this
    wx.getSetting({
      success: res => {
        console.log(res);
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        if (res.authSetting['scope.userInfo']) {
          wx.showTabBar({})
          page.setData(
            {
              authVisible : false
            }
          )
          page.onGetUserInfo()
        } else {//未授权
          wx.hideTabBar({})
          wx.hideLoading()
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
  loadTimes : 1,
  onLoad: function () {
    this.loadTimes++;
    wx.setNavigationBarTitle({
      title: '参与互助'
    })
    if (app && app.onLoadPage){
      app.onLoadPage(this)
    }
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    /*显示时间戳
    wx.showModal({
      title: 'time',
      content: ''+C.PRCTIME(),
    })*/

    if (app.globalData.hasInfo){//如果已经获取过用户信息
      console.log("已经获取过用户信息")
      this.onInfoReady()
      this.setData(
        {
          authVisible: false
        }
      )
    } else {
      console.log("未获取过用户信息")
    }
  },
  showIndex: 0,
  animOpcity:0,
  countDown: function () {
//    console.log(this.duration)
    var sec = (Math.floor(this.mainpooltime) + Math.floor(this.duration)) - Math.floor(C.PRCTIME())
   // sec = sec -86400
    
    if(sec <= 0){
      sec = 0
      clearInterval(this.countdownInterval)
      this.onInfoReady()
    }

    var h = Math.floor(sec / 3600);
    var m = Math.floor(Math.floor(sec % 3600) / 60);
    var s = Math.floor(sec % 60);

    if (h < 10) {
      h = '0' + h
    }
    if (m < 10) {
      m = '0' + m 
    }
    if (s < 10) {
      s = '0' + s
    }
    this.setData({
      poolHours:h,
      poolMinutes:m,
      poolSeconds:s
    });
    this.initCircle();
    //console.log(sec)
  },
  bossContent:{
    'muyan': { 
      title:"慕岩", 
      content: "99年开始互联网创业，百合网联合创始人，知名互联网创业者，在互联网产品、品牌、运营有丰富经验和资源。清华大学计算机和经管学院双学位，湖畔大学首期学员"
    },
    'yuanfeng': {
      title: "李圆峰", 
      content: "猎鹰创投董事总经理 头条大V 青云计划获奖者"
    }
  },
  bossInfo: function(res){
    console.log('boss')
    var id = res.currentTarget.id;
    wx.showModal({
      title: this.bossContent[id].title,
      content: this.bossContent[id].content,
      showCancel :false
    })
  },
  setMainPool :function(pool){
    //this.mainpool = pool
    //console.log("main pool:",pool)
    
    var billResult = C.BillExchange(pool.cbill);
    var targetBillResult = C.BillExchange(pool.tbill);
    pool.realtBill = targetBillResult.value;
    pool.realtUnit = targetBillResult.unit;
    pool.realBill = billResult.value;
    pool.realDuration = C.DescriptionTime(pool.duration);
    //pool.duration;
    pool.unit = billResult.unit;
    pool.percentVal = Math.floor((pool.cbill / pool.tbill) *10000)/100
    //console.log("billResult:",billResult);
    this.updateCircle(pool.percentVal/100)
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
    

    var start = 0 + this.showIndex
    var end = 1+this.showIndex
    if(end>this.fullOrderList.length-1){
      end = 1 + this.showIndex
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
      if (cNickname.length>8){
        cNickname = cNickname.substr(0, 8) +"..."
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
  initCircle(){
    var cxt_arc = wx.createCanvasContext('bottom');
    cxt_arc.setLineWidth(15);
    cxt_arc.setStrokeStyle('#edf0f5');
    cxt_arc.setLineCap('round');
    cxt_arc.beginPath();
    cxt_arc.arc(95, 95, 80, 0, 2 * Math.PI, false);
    cxt_arc.stroke();
    cxt_arc.draw();
  }
  ,
  //绘制进度条
  updateCircle(jindu) {
    var jindu = jindu * 2;
    if (jindu == 0) {
      ctx.clearRect(0, 0, 190, 190);
      return;
    }
    ctx.setFillStyle('white');
    ctx.clearRect(0, 0, 190, 190);
    ctx.setLineWidth(15);
    ctx.setStrokeStyle('#ffc057');
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(95, 95, 80, Math.PI / -2, jindu * Math.PI - Math.PI / 2, false);
    ctx.stroke()
    ctx.draw()
  },
  onInfoReady :function(){
    var page = this
    wx.showShareMenu({
      withShareTicket:true
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.showTabBar({})
    //this.updateCircle(0)
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
        wx.hideLoading()

        //console.log(data);
      }, function (code, data) {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '主页加载失败,是否重试?',
          success: function (res) {
            if (res.confirm) {
              page.onInfoReady()
            }
          }
        })
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

    if (data.award.result && !app.awardHint){
      app.awardHint = true
      wx.showModal({
        title: '提示',
        content: '恭喜您!您的梦想' + data.award.dtitle + '成为了幸运梦想,请前往完善梦想并领取互助金吧!', 
        success: function (res) {
          console.log(res)
          if (res.confirm) {
            C.SetPageIntendData('tab_type','bingo')
            wx.switchTab({
              url: '../mx_naicha/mx_naicha?type=bingo'
            })
            /*wx.navigateTo({
              url: '../mx_naicha/mx_naicha?type=bingo',
            })*/
            //C.Intend('../mx_naicha/mx_naicha?type=bingo',true)
          }
        }
      })
    }
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
      console.log("app.globalData.currentPage:",app.globalData.currentPage)

      if (this.orderInterval) {
        clearInterval(this.orderInterval)
      }
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval)
      }
  },
  onLuckyTap(){
    console.log('onLuckyTap')
    C.Intend('../mx_lucky/mx_lucky');
  },
  
  onShow() {
    C.ReloadTabPage();
  }
})
