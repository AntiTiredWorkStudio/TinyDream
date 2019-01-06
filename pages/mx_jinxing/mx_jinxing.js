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
    showingPool: {},
    runningPool: {},
    joinedPool: {},
    historyPool: {},
    type: {
      selection: "",
      running: "col-4 memu_act",
      joined: "col-4 menu_unact",
      history: "col-4 menu_unact",
    }
  },

  statustab: function (e) {
    console.log(e);
    this.setData({
      status: e.currentTarget.id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app && app.onLoadPage) {
      this.setData({
        poolcount: options.pcount,
        start: options.min,
        end: options.max
      })

      this.running = [];
      this.joining = [];
      this.history = [];

      app.onLoadPage(this)
      var page = this
      //http://localhost:8003/?ds=pcount&uid=oi7gL0ms3YzO3_r10Z-2wMGbJbeQ
      C.TDRequest('ds', "pcount", {
        uid: app.globalData.openid
      },
        function (code, data) {
          console.log("pcount", data)
          page.runningObject.total = parseInt(data.rcount)
          page.finishedObject.total = parseInt(data.fcount)
          page.joinedObject.total = parseInt(data.ucount)

          if (options.hasOwnProperty("type")) {
            page.switchType({
              currentTarget: {
                id: 'joined'
              }
            })
          } else {
            page.switchType({
              currentTarget: {
                id: 'running'
              }
            })
          }
        },
        function (code, data) {
          console.log("pcount", data)
        })


    }
  },
  poolInfo: function (res) {

    var targetPoolInfo = {}
    for (var key in this.data.showingPool) {
      if (res.currentTarget.id == this.data.showingPool[key].pid) {
        targetPoolInfo = this.data.showingPool[key]
        break;
      }
    }

    console.log(targetPoolInfo)

    C.SetPageIntendData(res.currentTarget.id, targetPoolInfo)
    C.Intend("../mx_zhongjiang/mx_zhongjiang?pid=" + res.currentTarget.id);
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
    console.log("app.globalData.currentPage:", app.globalData.currentPage)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onloading: false,
  onReachBottom: function () {
    if (this.onloading) {
      return;
    }
    this.onloading = true;

    var page = this
    switch (this.data.type.selection) {
      case "running":
        page.onTypeRunningLaunch(false, function (object) {

          page.setData({
            showingPool: object.poolData,
          })
          page.onloading = false
        });

        break;
      case "joined":
        page.onTypeJoinedLaunch(false, function (object) {
          page.setData({
            showingPool: object.poolData,
          })
          page.onloading = false
        })
        break;
      case "history":
        page.onTypeFinishedLaunch(false, function (object) {
          page.setData({
            showingPool: object.poolData,
          })
          page.onloading = false
        })
        break;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log("onShareAppMessage", res)
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
  },
  onPoolControl: function (target) {
    var page = this;
    for (var key in this.data.showingPool) {
      //console.log(this.data.showingPool[key]);

      // console.log(target.currentTarget.id, this.data.showingPool[key].pid)
      // console.log(target.currentTarget.id==this.data.showingPool[key].pid) 
      if (target.currentTarget.id == this.data.showingPool[key].pid) {
        //console.log(page.data.type.selection)
        switch (page.data.type.selection) {
          case "running":
            page.onPoolJoin(target);
            break
          case "history":
            console.log(target)
            page.onPoolView(target);
            break
          case "joined":
            page.onPoolJoin(target);
            break
        }
      }
    }
  },
  sharePool: function (res) {
    console.log("sharePool:", res)

  },
  drawCircle: function (i) {
    var ctx = wx.createCanvasContext('top-' + i)
    //console.log(ctx)
    ctx.setFillStyle('white');
    ctx.clearRect(0, 0, 85, 85);
    ctx.setLineWidth(7);
    ctx.setStrokeStyle('#ffc057');
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(42.5, 42.5, 35.5, Math.PI / -2, 1.5 * Math.PI - Math.PI / 2, false);
    ctx.stroke()
    ctx.draw()
  },

  drawBottomCircle: function (i) {
      var cxt_arc = wx.createCanvasContext('bottom-' + i);
      cxt_arc.setLineWidth(7);
      cxt_arc.setStrokeStyle('#edf0f5');
      cxt_arc.setLineCap('round');
      cxt_arc.beginPath();
      cxt_arc.arc(42.5, 42.5, 35.5, 0, 2 * Math.PI, false);
      cxt_arc.stroke();
      cxt_arc.draw();
  },
  drawPoolsCircle:function(){
    for (var key in this.data.showingPool) {
      if (this.data.showingPool[key].state == 'RUNNING'){
        this.drawBottomCircle(this.data.showingPool[key].pid)
        this.drawCircle(this.data.showingPool[key].pid)
      }

    }
  },
  onPoolView: function (target) {
    console.log("onPoolView:" + target.currentTarget.id);
    //C.Intend("../mx_canyu/mx_canyu")
    this.poolInfo(target)
  },
  onPoolJoin: function (target) {
    console.log("onPoolJoin:" + target.currentTarget.id);

    C.TDRequest(
      "ds", "buy", {
        uid: app.globalData.openid,
        pid: target.currentTarget.id
      },
      function (code, data) {
        console.log(data)
      },
      function (code, data) {
        console.log(data)
        if (code == '11') {
          wx.showModal({
            title: '提示',
            content: '您还没有绑定手机号',
            confirmText: '前往绑定',
            cancelText: '取消',
            success: function (res) {
              if (res.confirm) { //这里是点击了确定以后
                console.log('用户点击确定') //跳转到绑定手机页面
                C.Intend("../mx_phone/mx_phone")
              } else { //这里是点击了取消以后
                console.log('用户点击取消') //取消
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

  },
  indexPool: {},
  poolDataUpgraded: function (pools) {
    for (var key in pools) {
      var billResult = C.BillExchange(parseInt(pools[key].cbill));
      pools[key].realBill = billResult.value;
      pools[key].unit = billResult.unit;
      pools[key].percent = Math.ceil(pools[key].cbill / pools[key].tbill * 100)
      var less = (parseInt(pools[key].ptime) + parseInt(pools[key].duration)) - C.PRCTIME()
      //判断条件
      if (less < 0 || (parseInt(pools[key].cbill) >= parseInt(pools[key].tbill))) {
        pools[key].tdescription = "互助结束"
        pools[key].btnStyle = "color:white;background:#e60012;border-radius:15px;margin-right:10px"
        pools[key].btnText = "点击查看"
      } else {
        pools[key].tdescription = "距离结束:" + C.DescriptionTime(less);
        pools[key].btnStyle = "color:white;background:#e9ba65;border-radius:15px;margin-right:10px;margin-right:10px"
        pools[key].btnText = "参与互助"
      }
    }
    return pools
  },
  pushToDreamPoolsList: function (pools) {
    var that = this;
    var indexPool = this.indexPool
    for (var key in pools) {
      var billResult = C.BillExchange(parseInt(pools[key].cbill));
      pools[key].realBill = billResult.value;
      pools[key].unit = billResult.unit;
      pools[key].percent = Math.ceil(pools[key].cbill / pools[key].tbill * 100)
      var less = (parseInt(pools[key].ptime) + parseInt(pools[key].duration)) - C.PRCTIME()
      if (less < 0) {
        pools[key].tdescription = "互助结束"
        pools[key].btnStyle = "color:white;background:#e60012;border-radius:15px;margin-right:10px"
        pools[key].btnText = "点击查看"
      } else {
        pools[key].tdescription = "距离结束:" + C.DescriptionTime(less);
        pools[key].btnStyle = "color:white;background:#e9ba65;border-radius:15px;margin-right:10px;margin-right:10px"
        pools[key].btnText = "参与互助"
      }
      switch (pools[key].ustatus) {
        case "NONE":
          //console.log(that.running.indexOf(pools[key]))
          if (that.running.indexOf(pools[key]) == -1)
            that.running.push(pools[key])
          break;
        case "JOIN":
          if (that.joining.indexOf(pools[key]) == -1)
            that.joining.push(pools[key])
          that.joining.push(pools[key])
          break;
        case "JOIN|AWARD":
          if (that.history.indexOf(pools[key]) == -1)
            that.history.push(pools[key])
          that.joining.push(pools[key])
          break;
        case "JOIN|NOTAWARD":
          //that.joining.push(pools[key])
          if (that.history.indexOf(pools[key]) == -1)
            that.history.push(pools[key])
          that.joining.push(pools[key])
          break;
        case "NONE|NOTAWARD":
          if (that.history.indexOf(pools[key]) == -1)
            that.history.push(pools[key])
          break;
        default:
          break;
      }
      indexPool[pools[key].pid] = pools[key]

    }
    this.indexPool = indexPool
    console.log(this.indexPool)
    var targetList = [];
    switch (that.data.type.selection) {
      case "running":
        targetList = that.running
        break;
      case "joined":
        targetList = that.joining
        break;
      case "history":
        targetList = that.history
        break;
      default:
        targetList = that.history
        console.log("default:", that.data)
        break;
    }

    console.log(targetList)
    that.setData({
      showingPool: targetList, //默认显示正在进行中
      runningPool: that.running,
      joinedPool: that.joining,
      historyPool: that.history
    });
  },
  onPageIntend: function () {
    //console.log("OnPageIntentd")
    var page = this;

    /*this.onTypeRunningLaunch(true,function(object){
      showingPool:object.poolData
    });*/
    /*C.GetPageIntendDataDync('jinxing', function (res) {
      page.pushToDreamPoolsList(res.data);
    });*/
  },
  //切换类别
  switchType: function (type) {
    console.log(type)
    if (this.data.type.selection == type.currentTarget.id) {
      return;
    }
    this.data.type.selection = type.currentTarget.id;
    var page = this;
    console.log(type.currentTarget.id);
    this.setData({
      status: type.currentTarget.id
    })
    switch (type.currentTarget.id) {
      case "running":
        page.onTypeRunningLaunch(true, function (object) {
          console.log("running", object)
          page.setData({
            showingPool: object.poolData,
            type: {
              selection: type.currentTarget.id,
              running: "active",
              joined: "",
              history: "",
            }
          })
        });

        break;
      case "joined":
        page.onTypeJoinedLaunch(true, function (object) {
          page.setData({
            showingPool: object.poolData,
            type: {
              selection: type.currentTarget.id,
              running: "",
              joined: "active",
              history: "",
            }
          })
        })

        break;
      case "history":

        page.onTypeFinishedLaunch(true, function (object) {
          console.log(object)
          page.setData({
            showingPool: object.poolData,
            type: {
              selection: type.currentTarget.id,
              running: "",
              joined: "",
              history: "active",
            }
          })
        })

        break;
    }
    //this.drawPoolsCircle()
  },
  //新的部分
  runningObject: {
    seek: 0,
    size: 5,
    total: 0,
    poolData: []
  },
  finishedObject: {
    seek: 0,
    size: 5,
    total: 0,
    poolData: []
  },
  joinedObject: {
    seek: 0,
    size: 5,
    total: 0,
    poolData: []
  },
  selectedObject: null,
  onTypeRunningLaunch: function (init, success) {
    if (init) {
      this.runningObject.seek = 0
      this.runningObject.poolData = []
    }
    var page = this
    this.selectedObject = this.runningObject
    //http://localhost:8003/?ds=plistj&uid=23150634&seek=2&count=3
    if (this.selectedObject.total == 0) {
      wx.showToast({
        title: '暂无该类型的梦想池',
        icon: 'none'
      })
      if (success)
        success(page.runningObject)
      return;
    }
    if (this.selectedObject.seek >= this.selectedObject.total) {
      wx.showToast({
        title: '已经全部加载',
        icon: 'none'
      })
      if (success)
        success(page.runningObject)
      return;
    }
    C.TDRequest('ds', 'plistr', {
      seek: page.runningObject.seek,
      count: page.runningObject.size
    },
      function (code, data) {
        //数据处理
        console.log("onTypeRunningPe", data.Pools)
        var cPool = page.poolDataUpgraded(data.Pools)

        for (var key in cPool) {
          page.runningObject.poolData.push(C.DreamPoolAnalysis(cPool[key]))
        }
        console.log("DreamPoolAnalysis", page.runningObject.poolData)

        page.runningObject.seek += page.runningObject.size
        if (success)
          success(page.runningObject)
      },
      function (code, data) {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
      }
    )
  },
  onTypeFinishedLaunch: function (init, success) {
    if (init) {
      console.log("onTypeFinishedLaunch ini")
      this.finishedObject.seek = 0
      this.finishedObject.poolData = []
    }
    var page = this
    this.selectedObject = this.finishedObject

    if (this.selectedObject.total == 0) {
      wx.showToast({
        title: '暂无该类型的梦想池',
        icon: 'none'
      })
      if (success)
        success(page.finishedObject)
      return;
    }
    if (this.selectedObject.seek >= this.selectedObject.total) {
      wx.showToast({
        title: '已经全部加载',
        icon: 'none'
      })
      if (success)
        success(page.finishedObject)
      return;
    }
    C.TDRequest('ds', 'plistf', {
      seek: page.finishedObject.seek,
      count: page.finishedObject.size
    },
      function (code, data) {
        console.log("onTypeFinishedLaunch", data)
        //数据处理
        console.log(data.Pools)
        var cPool = page.poolDataUpgraded(data.Pools)
        console.log(cPool)
        for (var key in cPool) {
          page.finishedObject.poolData.push(C.DreamPoolAnalysis(cPool[key]))
        }
        page.finishedObject.seek += page.finishedObject.size
        if (success)
          success(page.finishedObject)
      },
      function (code, data) {
        console.log("onTypeFinishedLaunch", data)
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
      }
    )
  },
  onTypeJoinedLaunch: function (init, success) {
    if (init) {
      this.joinedObject.seek = 0
      this.joinedObject.poolData = []
    }
    var page = this

    this.selectedObject = this.joinedObject

    if (this.selectedObject.total == 0) {
      wx.showToast({
        title: '暂无该类型的梦想池',
        icon: 'none'
      })
      if (success)
        success(page.joinedObject)
      return;
    }
    if (this.selectedObject.seek >= this.selectedObject.total) {
      wx.showToast({
        title: '已经全部加载',
        icon: 'none'
      })
      if (success)
        success(page.joinedObject)
      return;
    }
    C.TDRequest('ds', 'plistj', {
      uid: app.globalData.openid,
      seek: page.joinedObject.seek,
      count: page.joinedObject.size
    },
      function (code, data) {
        console.log("onTypeRunningLaunch", data)
        //数据处理
        var cPool = page.poolDataUpgraded(data.Pools)
        /**/
        console.log(cPool)
        for (var key in cPool) {
          page.joinedObject.poolData.push(C.DreamPoolAnalysis(cPool[key]))
        }

        page.joinedObject.poolData.sort(function (a, b) {
          if(a.state == 'FINISHED' && b.state!='FINISHED'){
            return 1;
          } else if (b.state == 'FINISHED' && a.state != 'FINISHED'){
            return -1;
          } else {
            return b.ptime - a.ptime;
          }
        })

        page.joinedObject.seek += page.joinedObject.size
        if (success)
          success(page.joinedObject)
      },
      function (code, data) {
        console.log("onTypeRunningLaunch", data)
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
      }
    )
  }
})