var C = require("lib.js")
//app.js
App({
  onLaunch: function() {
    var app = this
    C.app = app
    this.lib = C
    wx.hideTabBar()
    wx.login({ //微信登录
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          var page = this;
          C.TDRequest(
            'us', 'gakt', {
              code: res.code
            },
            function(code, data) {
              app.globalData.openid = data.openid;
              app.globalData.version = true;
              console.log("gakt", data)
              page.versionControl[data.version](app,data)
              /*if (app.currentPage && app.currentPage.onLogin) {
                app.currentPage.onLogin(data.openid) //调用【当登录】事件
              }*/
            },
            function(code, data) {
              console.log("gakt", data)
            }
          )
        }
      }
    })
  },
  versionControl:{
    concise:function(app,data){
      wx.hideTabBar({})
      C.Intend("../demo_user/demo_user",true)
    },
    full: function (app,data){
      if (app.currentPage && app.currentPage.onLogin) {
        app.currentPage.onLogin(data.openid) //调用【当登录】事件
      }
    }
  },
  onLoadPage: function(page) {
    this.currentPage = page;
    if (this.currentPage && this.currentPage.onPageIntend) {
      this.currentPage.onPageIntend();
    }
  },
  doFirstAction: function() {
    if (Object.keys(this.actionList).length > 0) {
      var key = Object.keys(this.actionList)[0]
      console.log(this.actionList[key])
      //this.doAction(this.actionList[0])
      if (this.actionRegisted.hasOwnProperty(key)) {
        this.actionRegisted[key](this.actionList[key])
        wx.showToast({
          title: "有未完成动作，不可退出",
          icon: "none"
        })
      }
    }
  },
  doAction: function(actions) {
    // console.log("do action:", Object.keys(actions)[0])
    this.actionList = actions;
    //console.log("do action:", actions)
    if (this.actionRegisted.hasOwnProperty(Object.keys(actions)[0])) {
      this.actionRegisted[Object.keys(actions)[0]](actions[Object.keys(actions)[0]]);
    } else {
      console.log("没有 动作");
    }
  },
  actionList: {}, //动作列表
  actionRegisted: {
    editdream: function(data) {
      console.log("editdream:", data)
      C.Intend("../mx_xieyi/mx_xieyi", false)
    },
    selectdream: function(data) {
      console.log("selectdream:", data)
      C.Intend("../mx_tanchuang/mx_tanchuang", false)
      //C.Intend("../mx_naicha/mx_naicha", true);
    },
    buy: function(data) {
      console.log("buy:", data)
      //C.Intend("../mx_zhifu/mx_zhifu", true)
      //
      //pages/index/index

      C.Intend("../mx_zhifu/mx_zhifu", false)
      /*wx.showModal({
        title: '准备购买',
        content: '是否参与互助?',
        success: function(res) {
          //console.log()
          if (res.confirm) {
            if (getCurrentPages()[0].route == 'pages/mx_tanchuang/mx_tanchuang') {
            } else {
              C.Intend("../mx_zhifu/mx_zhifu", true)
            }
          } else {

            if (getCurrentPages()[0].route == 'pages/mx_tanchuang/mx_tanchuang') {
              C.Intend("../index/index", true)
            } else {
              C.Intend("../index/index", true)
            }
          }
        }
      })*/

    },
    pay: function(data) {
      console.log("pay:", data)
    }
  }, //注册的动作
  registAction: function(id, func) { //注册动作
    actionRegisted[id] = func
  },
  onPageExit: function() {
    //    console.log("onPageExit")
    if (Object.keys(this.actionList).length > 0)
      this.doFirstAction()
  },
  currentPage: null,
  currentTab : "",
  lib: null,
  awardHint:false,
  globalData: {
    openid: null,
    nickname: null,
    headicon: null,
    hasInfo:false,
    version:false,
  }
})