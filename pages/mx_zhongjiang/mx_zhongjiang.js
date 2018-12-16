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
    numTabClass: "col-6 memu_act",
    userTabClass: "col-6 menu_unact",
    type: "code",
    pool: {},
    pstate:'',
    lottery: {},
    orders: {},
    seek: 0,
    count: 0,
    cd: {
      h: 0,
      m: 0,
      s: 0
    }
  },
  countdownInterval: null,

  poolDataUpgraded: function(pool) {
    //for (var key in pools) {
    var billResult = C.BillExchange(parseInt(pool.cbill));
    pool.realBill = billResult.value;
    pool.unit = billResult.unit;
    pool.percent = Math.ceil(pool.cbill / pool.tbill * 100)
    var less = (parseInt(pool.ptime) + parseInt(pool.duration)) - C.PRCTIME()
    //判断条件
    if (less < 0 || (parseInt(pool.cbill) >= parseInt(pool.tbill))) {
      pool.tdescription = "互助结束"
      pool.btnStyle = "color:white;background:#e60012;border-radius:15px;margin-right:10px"
      pool.btnText = "点击查看"
    } else {
      pool.tdescription = "距离结束:" + C.DescriptionTime(less);
      pool.btnStyle = "color:white;background:#e9ba65;border-radius:15px;margin-right:10px;margin-right:10px"
      pool.btnText = "参与互助"
    }
    // }
    return pool
  },
  /**
   * 生命周期函数--监听页面加载
   */
  currentTab:"num",
  switchTab: function(res) {
    if (this.currentTab == res.currentTarget.id) {
      return
    } 
    this.currentTab = res.currentTarget.id
    switch (res.currentTarget.id) {
      case "user":
        this.viewDetials();
        break;
      case "num":
        this.viewCodes();
        break;
    }
  },
  onLoad: function(options) {
    var tPool = C.GetPageIntendData(options.pid)
    console.log(tPool)
    tPool = C.DreamPoolAnalysis(tPool)
    console.log("DreamPoolAnalysis", tPool)
    tPool = this.poolDataUpgraded(tPool)
    console.log("poolDataUpgraded", tPool)
    //var real
    var page = this
    var stateText = ''
    C.TDRequest('aw', 'lfromp', { pid: options.pid },
      function (code, data) {
        console.log('lfromp', data)
        stateText = data.lid
        page.setData({
          pstate: stateText
        })
      }, function (code, data) {
        console.log('lfromp', data)
        if (tPool.tdescription != '互助结束'){
          stateText = "互助中"
        }else{
          stateText = "等待开奖"
        }
        page.setData({
          pstate: stateText
        })
      }
    );
    //aw=lfromp&pid=100012
    //ds=pdetial&uid=97374267&pid=100011
    C.TDRequest(
      'ds',
      'pdetial', {
        uid: app.globalData.openid,
        pid: options.pid
      },
      function(code, data) {
        var seeker = 0
        var count = 0
        var lotteryList = []
        console.log(data.lottey)
        for (var key in data.lottey) {
          lotteryList[seeker] = {
            left: null,
            right: null
          }

          if (seeker % 2 == 0) {
            lotteryList[count].left = data.lottey[key]
          } else {
            lotteryList[count].right = data.lottey[key]
            count++
          }
          seeker++;
        }

        console.log("lotteryList", lotteryList)

        page.setData({
          lottery: lotteryList,
          pool: tPool
        },function(){
          if (page.data.pool.state == 'RUNNING')
            page.countdownInterval = setInterval(page.countDown, 1000);
        })


        console.log('aw', data)

      },
      function(code, data) {
        console.log(data)
      }
    )
  },
  viewCodes: function() {
    console.log('viewCodes')
    this.setData({
      numTabClass: "col-6 memu_act",
      userTabClass: "col-6 menu_unact",
      type: 'code'
    })
  },
  viewDetials: function() {
    var page = this
    this.setData({
      orders: {}
    })
    console.log("viewDetials");
    //    ds = precs & pid=100016
    //ds=preco&pid=100016&min=1&max=6
    C.TDRequest('ds', 'precs', {
        pid: this.data.pool.pid
      },
      function(code, data) {
        console.log(data)
        var ordCount = data.ordCount
        C.TDRequest('ds', 'preco', {
            pid: page.data.pool.pid,
            min: 0,
            max: 5
          },
          function(code, data) {
            console.log(data)
            console.log('viewDetials')
            page.setData({
              seek: 0,
              numTabClass: "col-6 menu_unact",
              userTabClass: "col-6 memu_act",
              type: 'detial',
              orders: data.orders,
              count: ordCount
            })
          },
          function (code, data) {
            console.log(data)
          })

      },
      function(code, data) {

        console.log(data)
      }
    )
  },
  loadMore: function() {
    var tSeek = this.data.seek + 5
    var page = this
    C.TDRequest('ds', 'preco', {
        pid: page.data.pool.pid,
        min: tSeek,
        max: 5
      },
      function(code, data) {
        console.log(data)
        var torders = page.data.orders
        if (data.orders != []) {
          for (var key in data.orders) {
            //torders[data.orders[key].oid] = data.orders[key]
            torders.push(data.orders[key])
          }
          if (page.data.seek + 5 >= page.data.count) {
            wx.showToast({
              title: '已经全部加载',
              icon: 'none'
            })
          }
        } else {
          console.log('已经全部加载')
          wx.showToast({
            title: '已经全部加载',
            icon: 'none'
          })
        }
        page.setData({
          orders: torders,
          seek: tSeek
        })
      },
      function(code, data) {

      })
  },
  onCommunicate: function(res) {
    console.log("onCommunicate", res)

    wx.makePhoneCall({
      phoneNumber: '15601390196',
    })
  },
  sharePool: function(res) {
    console.log("sharePool", res)
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  showCode: function(res) {
    console.log(res.currentTarget.id)
    //aw=onums&oid=154579937265
    C.TDRequest('aw', 'onums', {
        oid: res.currentTarget.id
      },
      function(code, data) {
        var sContent = ''
        for (var num in data.nums) {
          sContent += (parseInt(num) + 1) + "." + data.nums[num].lid + ";\r\n"
        }
        wx.showModal({
          title: '编号',
          content: sContent,
          showCancel: false, //是否显示取消按钮
          success: function(res) {
            if (res.confirm) { //这里是点击了确定以后
              console.log('用户点击确定')
            } else { //这里是点击了取消以后
              console.log('用户点击取消')
            }
          }
        })
      },
      function(code, data) {
        console.log(data)
      }
    )
  },

  countDown: function() {
    // console.log(this.data.pool)
    var sec = (Math.floor(this.data.pool.ptime) + parseInt(Math.floor(this.data.pool.duration))) - Math.floor(C.PRCTIME())
    // console.log(sec)
    var page = this
    if (sec <= 0) {
      sec = 0
      clearInterval(this.countdownInterval)
      this.onLoad({
        pid: page.data.pool.pid
      })
    }

    var th = Math.floor(sec / 3600);
    var tm = Math.floor(Math.floor(sec % 3600) / 60);
    var ts = Math.floor(sec % 60);
    
    if (th < 10) {
      th = '0' + th
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
    //console.log(sec)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.countdownInterval)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    return {
      title: res.target.id,
      path: '/pages/index/index', //这里设定都是以"/page"开头,并拼接好传递的参数
      success: function(res) {
        // 转发成功
        console.log(res);
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  onPoolJoin: function (target) {
    console.log("onPoolJoin:" + target.currentTarget.id);

    C.TDRequest(
      "ds", "buy", { uid: app.globalData.openid, pid: target.currentTarget.id },
      function (code, data) {
        console.log(data)
      }, function (code, data) {
        console.log(data)
        if (code == '5') {
          wx.showToast({
            title: '该梦想池已经结束互助',
            icon: 'none'
          })
        }
        if (code == '11') {
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

        if (code == '18') {
          wx.showToast({
            title: '已到达当日购买上限',
            icon: 'none'
          })
        }

      }
    )

  }
})