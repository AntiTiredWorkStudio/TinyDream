//index.js

//获取应用实例
const app = getApp()
var C = app.lib
// pages/mx_zhifu/mx_zhifu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pool:{},
    dream:{},
    limPiece:0,
    countPiece: 1,
    cd: {
      h: 0,
      m: 0,
      s: 0
    }
  },

  countdownInterval: null,
  countDown:function(){
    var sec = (Math.floor(this.data.pool.ptime) + parseInt(Math.floor(this.data.pool.duration))) - Math.floor(C.PRCTIME())

    var page = this
    if (sec <= 0) {
      sec = 0
      clearInterval(this.countdownInterval)
      wx.showModal({
        title: '提示',
        content: '当前梦想池互助已经结束',
        showCancel:false,
        complete:function(){
          C.Intend('../index/index')
        }
      })
      return
    }

    // console.log(sec)
    var th = Math.floor(sec / 3600);
    var tm = Math.floor(Math.floor(sec % 3600) / 60);
    var ts = Math.floor(sec % 60);
    if(th<10){
      th = '0'+th
    }
    if (tm < 10) {
      tm = '0' + tm
    }
    if (ts < 10) {
      ts = '0' + ts
    }
    this.setData({
      cd: {
        h: th,
        m: tm,
        s: ts
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page =this
    console.log("下单",)
    var targetDream = app.actionList.buy.dream
    var lim = Math.min(app.actionList.buy.less,app.actionList.buy.dayLim)

      C.TDRequest('ds','ord',{
        action: JSON.stringify(app.actionList)
      },
      function(code,data){
          console.log(data)
           var aPool = C.DreamPoolAnalysis(data.pool)
           console.log(aPool)
        page.countdownInterval = setInterval(page.countDown, 1000);
          page.setData({
            pool: aPool ,
            dream: targetDream,
            limPiece: lim
          })

          //调起支付
      },
      function (code, data) {
          console.log(data)
      }
      
      )
  },
  onChangePiece:function(res){
    console.log(res.currentTarget.id)
    var currentPiece = this.data.countPiece + parseInt(res.currentTarget.id)
    currentPiece = Math.max(1,Math.min(currentPiece,this.data.limPiece))
    this.setData({
      countPiece: currentPiece
    })
  },
  onPay:function(){
    /*
ds=pay&uid=a01&oid=162721259015&bill=1000&pcount=1&action={"pay" : {"info" : [],"oid" : 162721259015,"pid" : "100017","did" : "DR1000000108","pless" : 11999}}
     */
   
    var page = this
    var tbill = page.data.countPiece * page.data.pool.ubill
    console.log(tbill)

    if (page.data.pool.ubill == 0){
      C.TDRequest('ds', 'pay', {
        uid: app.globalData.openid,
        oid: app.actionList.pay.oid,
        bill: tbill,
        pcount: page.data.countPiece,
        action: JSON.stringify(app.actionList)
      }, function (code, data) {
        wx.showToast({
          title: '支付成功',
          icon: 'none',
          mask: true,
          complete: function () {
            C.Intend('../mx_wode/mx_wode?pay=true', true);
            console.log(data)
          }
        })

      }, function (code, data) {
        console.log(data)
        wx.showToast({
          title: '支付失败',
          icon: 'none',
          mask: true,
          complete: function () {
            C.Intend('../mx_wode/mx_wode?pay=false', true);
            console.log(data)
          }
        })

      })
      return
    }




    C.TDRequest('ds','wxpay',
    {
      oid: app.actionList.pay.oid,
      bill: tbill,
      uid:app.globalData.openid
    },
    function(code,data){
      /*console.log("prepayid=" + data.pay.prepayid)
      console.log(
        "timeStamp:"+"" + data.pay.timestamp,
        "noncestr:" +data.pay.noncestr,
        "package:" +"prepayid=" + data.pay.prepayid,
        "paySign:" +data.paySign
      )*/



      //支付完成API调用
     /* var payData = {
        uid: app.globalData.openid,
        oid: app.actionList.pay.oid,
        bill: tbill,
        pcount: page.data.countPiece,
        action: JSON.stringify(app.actionList)
      }

      if (page.exchangeDream != null) {
        payData['did'] = page.exchangeDream.did
      }

      C.TDRequest('ds', 'pay', payData, function (code, data) {
        wx.showToast({
          title: '支付成功',
          icon: 'none',
          mask: true,
          complete: function () {
            C.Intend('../mx_wode/mx_wode?pay=true', true);
            console.log(data)
          }
        })

      }, function (code, data) {
        console.log(data)
        wx.showToast({
          title: '支付失败',
          icon: 'none',
          mask: true,
          complete: function () {
            C.Intend('../mx_wode/mx_wode?pay=false', true);
            console.log(data)
          }
        })

        }) */
      //支付完成API调用 结束

     /* return;*/
      //微信支付
      console.log(data)
      console.log({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
      });
      
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        success(res) {
          console.log(res)

          //支付完成API调用
          var payData = {
            uid: app.globalData.openid,
            oid: app.actionList.pay.oid,
            bill: tbill,
            pcount: page.data.countPiece,
            action: JSON.stringify(app.actionList)
          } 
          
          if (!C.isEmpty(page.exchangeDream)){
            console.log("更换的梦想不是空却是:",page.exchangeDream)
            payData['did'] = page.exchangeDream.did
          }
          console.log("actionList:", app.actionList)
          console.log("payData:", payData)

          C.TDRequest('ds', 'pay', payData, function (code, data) {
            console.log('支付成功',data)
            wx.showToast({
              title: '支付成功',
              icon: 'none',
              mask: true,
              complete: function () {
                C.Intend('../mx_wode/mx_wode?pay=true', true);
                console.log(data)
               }
            })
            
          }, function (code, data) {
            console.log('支付失败',data)
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              mask: true,
              complete: function () {
                C.Intend('../mx_wode/mx_wode?pay=false', true);
                console.log(data)
              }
            })
            
          })

          //支付完成API调用 结束



         },
        fail(res) {
          console.log("fail:",res)
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            mask: true,
            complete: function () {
              C.Intend('../mx_wode/mx_wode?pay=false', true);
             // console.log(data)
            }
          })
        },
        complete(res){
          console.log('complete:',res)
        }
      })
    },
    function (code, data) {
        console.log(data)

      /*wx.showToast({
        title: '支付失败:' + data.context,
        icon: 'none',
        mask: true,
        complete: function () {
          C.Intend('../mx_wode/mx_wode?pay=false', true);
          console.log(data)
        }
      })*/
      wx.showModal({
        title: data.context ,
        content: data.error,
        mask: true,
        showCancel:false,
        success: function () {
          C.Intend('../mx_wode/mx_wode?pay=false', true);
          console.log(data)
        }
      })
    }
    )
   /* */
    /**/
  },
  exchangeDream : null,
  exchangeDream01: function () {
    console.log("替换梦想")
    C.Intend("../mx_tanchuang/mx_tanchuang?type=exchange", false)
  },
  onExchangeDream:function(tdream){
    console.log('onExchangeDream',tdream)
    this.exchangeDream = tdream;
    this.setData({
      dream: tdream
    })
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
    //console.log("ON PAY PAGE SHOW")

    var exchangeDream = C.GetPageIntendData('exchange');
    if(exchangeDream!=null){
      this.onExchangeDream(exchangeDream)
    }
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
    clearInterval(this.countdownInterval)
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