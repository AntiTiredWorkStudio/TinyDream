var C = require("lib.js")
//app.js
App({
  onLaunch: function () {
    var app = this
    C.app = app
    this.lib = C
    wx.login({//微信登录
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.code){
          wx.request({//获取用户的openid
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + C.conf.appid + '&secret=' + C.conf.secret+'&js_code='+res.code+'&grant_type=authorization_code',
            success:function(res){
              app.globalData.openid = res.data.openid;
              if (app.currentPage && app.currentPage.onLogin){
                app.currentPage.onLogin(res.data.openid)//调用【当登录】事件
              }
              return;
            }
          })
        }
      }
    })
  },
  onLoadPage:function(page){
    this.currentPage = page;
    if (this.currentPage && this.currentPage.onPageIntend) {
      this.currentPage.onPageIntend();
    }
  },
  doFirstAction:function(){
    if (Object.keys(this.actionList).length>0){
      var key = Object.keys(this.actionList)[0]
      console.log(this.actionList[key])
      //this.doAction(this.actionList[0])
      if (this.actionRegisted.hasOwnProperty(key)) {
        this.actionRegisted[key](this.actionList[key])
        wx.showToast({
          title:"有未完成动作，不可退出",
          icon:"none"
        })
      }
    }
  },
  doAction:function(actions){
   // console.log("do action:", Object.keys(actions)[0])
    this.actionList = actions;
    //console.log("do action:", actions)
    if (this.actionRegisted.hasOwnProperty(Object.keys(actions)[0])){
      this.actionRegisted[Object.keys(actions)[0]](actions[Object.keys(actions)[0]]);
    }else{
      console.log("没有 动作");
    }
  },
  actionList : {},//动作列表
  actionRegisted :{
    editdream:function(data){
      console.log("editdream:", data)
      C.Intend("../mx_xieyi/mx_xieyi",true)
    },
    selectdream: function (data) {
      console.log("selectdream:", data)
      //C.Intend("../mx_naicha/mx_naicha", true);
    },
    buy: function (data) {
      console.log("buy:", data)
    },
    pay: function (data) {
      console.log("pay:", data)
    }
  },//注册的动作
  registAction : function(id,func){//注册动作
    actionRegisted[id]=func
  },
  onPageExit:function(){
//    console.log("onPageExit")
    this.doFirstAction()
  },
  currentPage:null,
  lib:null,
  globalData: {
    openid:null,
    nickname:null,
    headicon:null,
  }
})