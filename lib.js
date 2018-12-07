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
              //console.log("do action!")
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

module.exports.strIsNull = function( str ){
  if ( str == "" ) return true;
  var regu = "^[ ]+$";
  var re = new RegExp(regu);
  return re.test(str);
}

//分析梦想池
module.exports.DreamPoolAnalysis = function(pool){

  var billResult = module.exports.BillExchange(pool.cbill);
  pool.realBill = billResult.value;
  pool.unit = billResult.unit;
  pool.percentVal = Math.floor((pool.cbill / pool.tbill) * 10000) / 100
  pool.rubill = pool.ubill*0.01
  pool.day = Math.floor(pool.duration / 86400)
  pool.rtbill = module.exports.BillExchange(pool.tbill)
  /*console.log("billResult:", billResult);
  this.setData({
    mainpool: pool
  })*/
  return pool
}


module.exports.Intend = function (tUrl, redict = false, onsuccess = null){
  //var self = this;
  if(!redict){
    
    wx.navigateTo({
      url: tUrl,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
      success: function (res) {
        if(onsuccess)
        onsuccess(res)
        //console.log("跳转:", res);
       },        //成功后的回调；
       fail:function(res){
         //console.log("跳转:", res);
       }
    })
  } else {
    wx.redirectTo({
      url: tUrl,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
      success: function () {

       },        //成功后的回调；
    })
  }
}

module.exports.PRCTIME = function(){
  var date = new Date(); 
  return Math.floor(date.getTime() *0.001)
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

function encodeUTF8(s) {
  var i, r = [], c, x;
  for (i = 0; i < s.length; i++)
    if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
    else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
    else {
      if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
        c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
          r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
      else r.push(0xE0 + (c >> 12 & 0xF));
      r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
    };
  return r;
};

module.exports.sha1 = function (s) {
  var data = new Uint8Array(encodeUTF8(s))
  var i, j, t;
  var l = ((data.length + 8) >>> 6 << 4) + 16, s = new Uint8Array(l << 2);
  s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
  for (t = new DataView(s.buffer), i = 0; i < l; i++)s[i] = t.getUint32(i << 2);
  s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
  s[l - 1] = data.length << 3;
  var w = [], f = [
    function () { return m[1] & m[2] | ~m[1] & m[3]; },
    function () { return m[1] ^ m[2] ^ m[3]; },
    function () { return m[1] & m[2] | m[1] & m[3] | m[2] & m[3]; },
    function () { return m[1] ^ m[2] ^ m[3]; }
  ], rol = function (n, c) { return n << c | n >>> (32 - c); },
    k = [1518500249, 1859775393, -1894007588, -899497514],
    m = [1732584193, -271733879, null, null, -1009589776];
  m[2] = ~m[0], m[3] = ~m[1];
  for (i = 0; i < s.length; i += 16) {
    var o = m.slice(0);
    for (j = 0; j < 80; j++)
      w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
        t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
        m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
    for (j = 0; j < 5; j++)m[j] = m[j] + o[j] | 0;
  };
  t = new DataView(new Uint32Array(m).buffer);
  for (var i = 0; i < 5; i++)m[i] = t.getUint32(i << 2);

  var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
    return (e < 16 ? "0" : "") + e.toString(16);
  }).join("");

  return hex;
};