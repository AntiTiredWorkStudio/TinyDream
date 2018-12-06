//index.js

//获取应用实例
const app = getApp()
var C = app.lib
// pages/mx_zhongjiang/mx_zhongjiang.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:"code",
    pool:{},
    lottery:{},
    orders: {},
    seek: 0,
    count:0,
    cd:{
      h:0,
      m:0,
      s:0
    }
  },
  countdownInterval:null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tPool =  C.GetPageIntendData(options.pid)
    console.log(tPool)
    //ds=pdetial&uid=97374267&pid=100011
    var page = this
    C.TDRequest(
      'ds',
      'pdetial',
      {
        uid:app.globalData.openid,
        pid:options.pid
      },
      function(code,data){
          console.log(data)

        page.countdownInterval = setInterval(page.countDown, 1000);

          page.setData({
            lottery: data.lottey,
            pool: tPool
          })
      },
      function (code, data) {
        console.log(data)
      }
    )
  },
  viewCodes :function(){
    this.setData({
      type:'code'
    })
  },
  viewDetials: function () {
    var page =this
    this.setData({
      orders: {}
    })
//    ds = precs & pid=100016
//ds=preco&pid=100016&min=1&max=6
    C.TDRequest('ds','precs',{pid:this.data.pool.pid}
    ,
    function(code,data){
      console.log(data)
      var ordCount = data.ordCount
      C.TDRequest('ds', 'preco', 
      { 
        pid: page.data.pool.pid,
        min:0,
        max:5
      },
      function (code, data) {
          console.log(data)
          page.setData({
            type: 'detial',
            orders: data.orders,
            count: ordCount
          })
      },function(code,data){

      })

    },
    function(code,data){

    }
    )
  },
  loadMore:function(){
      var tSeek = this.data.seek+5
      var page = this
    C.TDRequest('ds', 'preco',
      {
        pid: page.data.pool.pid,
        min: tSeek,
        max: 5
      },
      function (code, data) {
        console.log(data)
        var torders = page.data.orders
        if(data.orders != []){
          for(var key in data.orders){
            //torders[data.orders[key].oid] = data.orders[key]
            torders.push(data.orders[key])
          }
        } else {
          console.log('已经全部加载')
          wx.showToast({
            title: '已经全部加载',
            icon:'none'
          })
        }
        page.setData({
          orders: torders,
          seek: tSeek
        })
      }, function (code, data) {

      })
  },
  onCommunicate: function (res) {
    console.log("onCommunicate",res)
    
    wx.makePhoneCall({
      phoneNumber: '15601390196',
    })
  },
  sharePool: function (res) {
    console.log("sharePool", res)
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  showCode:function(res){
      console.log(res.currentTarget.id)
      //aw=onums&oid=154579937265
      C.TDRequest('aw','onums',
      {
        oid: res.currentTarget.id
      },
      function(code,data){
        var sContent = ''
        for (var num in data.nums) {
          sContent += (parseInt(num)+1)+"."+data.nums[num].lid +";\r\n"
        }
        wx.showModal({
          title: '编号',
          content: sContent,
          showCancel: false,//是否显示取消按钮
          success: function (res) {
            if (res.confirm) {//这里是点击了确定以后
              console.log('用户点击确定')
            } else {//这里是点击了取消以后
              console.log('用户点击取消')
            }
          }
        })
      },function(code,data){
          console.log(data)
      }
      )
  },

  countDown: function () {
   // console.log(this.data.pool)
    var sec = (Math.floor(this.data.pool.ptime) + parseInt(Math.floor(this.data.pool.duration))) - Math.floor(C.PRCTIME())
   // console.log(sec)
    var th = Math.floor(sec / 3600);
    var tm = Math.floor(Math.floor(sec % 3600) / 60);
    var ts = Math.floor(sec % 60);
    this.setData({
      cd:{
        h:th,
        m:tm,
        s:ts
      }
    });
    //console.log(sec)
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
  onShareAppMessage: function (res) {
    return {
      title: res.target.id,
      path: '/pages/index/index', //这里设定都是以"/page"开头,并拼接好传递的参数
      success: function (res) {
        // 转发成功
        console.log(res);
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})