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
    countPiece:1
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


    C.TDRequest('ds','wxpay',
    {
      oid: app.actionList.pay.oid,
      bill: tbill,
    },
    function(code,data){
      console.log(data)

      wx.requestPayment({
        timeStamp: ""+data.pay.timestamp,
        nonceStr: data.pay.noncestr,
        package: data.pay.package,
        signType: 'MD5',
        paySign: data.pay.sign,
        success(res) {
          console.log(res)
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
         },
        fail(res) {
          console.log(res)
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            mask: true,
            complete: function () {
              C.Intend('../mx_wode/mx_wode?pay=false', true);
              console.log(data)
            }
          })
          
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
        content: data.error.return_msg,
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
})