//注册配置文件
var conf = require('conf.js')
module.exports.conf = conf
module.exports.app = {}

//默认请求模板
module.exports.TDRequest = function(module,action,data,success,failed){
//  var postdata = data
//  
  var postdata = {};
  var self = this;
  
  postdata[module] = action
  for(var key in data){
      postdata[key] = data[key]
  }
  postdata[module] = action
  //console.log(postdata)
  wx.request({
    url: conf.url,
    data: postdata,
    method: "POST",
    header: {//请求头
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success:function(res){
        if(res.data.code=="0"){
          if(res.data.actions){
            if (self.app!=null && self.app.doAction) {
              self.app.doAction(res.data.actions)
            }
          }
          success(res.data.code, res.data);
          //console.log("success:" + JSON.stringify(res.data));
        }else{
          failed(res.data.code, res.data);
          //console.log("fail:" + JSON.stringify(res.data));
        }
    },
    fail: function (res) {
      failed(-1, res.data);
    }
  })
}

module.exports.TDRequestUrl = function (url, data, success, failed) {

}

//页面交互参数
module.exports.SetPageIntendData=function(tkey,tdata){
  console.log("SetPageIntendData:"+tkey,tdata)
  wx.clearStorage();
  wx.setStorage({
    key: tkey,
    data: tdata,
  })
}

module.exports.GetPageIntendData = function (tkey){
  //console.log("get storage:"+tkey);
  
  return wx.getStorageSync(tkey);
}
module.exports.GetPageIntendDataDync = function (tkey,callback) {

  return wx.getStorage({
    key: tkey,
    success: callback
  });
}

module.exports.Intend = function(tUrl,redict = false){
  if(!redict){
    wx.navigateTo({
      url: tUrl,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
      success: function () { },        //成功后的回调；
    })
  } else {
    wx.redirectTo({
      url: tUrl,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
      success: function () { },        //成功后的回调；
    })
  }
}

module.exports.PRCTIME = function(){
  var date = new Date(); 
  return Math.floor(date.getTime() *0.001 +3600*8)
}

module.exports.DescriptionTime = function (sec) {
  if (sec < 60) {
    return sec+ "秒";
  }
  if(sec<3600){
    return Math.floor(sec/60) +"分钟";
  }
  if (sec < 86400) {
    return Math.floor(sec / 3600) + "小时";
  }

  if (sec < 86400*30) {
    return Math.floor(sec / 86400) + "天";
  }
}

module.exports.BillExchange = function(bill){
  var result = {
    value:0,
    unit:""
  }
  if(bill<1000000){
    result.value = bill*0.01;
    result.unit = "元";
    return result;
  }else{
    result.value = bill * 0.000001;
    result.unit = "万元";
    return result;
  }
  return result;
}