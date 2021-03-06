//注册配置文件
var conf = require('conf.js')
module.exports.conf = conf
module.exports.app = {}
module.exports.catchDreamTitle = function(text){
  return text.substring(0, 5)
}
module.exports.isEmpty=function (obj) {
  if (obj === null) return true;
  if (typeof obj === 'undefined') {
    return true;
  }
  if (typeof obj === 'string') {
    if (obj === "") {
      return true;
    }
    var reg = new RegExp("^([ ]+)|([　]+)$");
    return reg.test(obj);
  }
  return false;
}

module.exports.GetSignalString = function (secret, timeStamp, requestArray) {
  var requestString = '';
  for (var key in requestArray) {
    requestString = requestString + key + "=" + requestArray[key] + "&";
  }
  return this.sha1(requestString.substring(0, requestString.length - 1) + "&secret=" + secret + "&time=" + timeStamp);
}

module.exports.CheckAndSetAuthInfo = function (requestData) {
  if (requestData.hasOwnProperty('auth') && requestData.hasOwnProperty("openid")) {
    var authData = requestData.auth;
    authData.openid = requestData.openid;
    this.app.globalData.auth = JSON.stringify(authData);
  }
}
//默认请求模板
module.exports.TDRequest = function(module, action, data, success, failed) {
  //  var postdata = data
  //  
  var postdata = {};
  var self = this;

  postdata[module] = action
  for (var key in data) {
    postdata[key] = data[key]
  }
  postdata[module] = action

  if(self.app.globalData.auth != null){
    var auth = JSON.parse(self.app.globalData.auth);
    var secret = auth.secret;
    var openid = auth.openid;
    var timeStamp = auth.timeStamp;
    if (!postdata.hasOwnProperty('uid')) {
      postdata['openid'] = openid;
    }
    var signal = this.GetSignalString(secret, timeStamp, postdata);
    postdata['signal'] = signal;
  }

  //console.log(postdata)
  wx.request({
    url: conf.url,
    data: postdata,
    method: "POST",
    header: { //请求头
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function(res) {
      self.CheckAndSetAuthInfo(res.data);
      if (res.data.code == "0") {
        if (res.data.actions) {
          if (self.app != null && self.app.doAction) {
            //console.log("do action!")
            self.app.doAction(res.data.actions)
          }
        }
        success(res.data.code, res.data);
        //console.log("success:" + JSON.stringify(res.data));
      } else {
        failed(res.data.code, res.data);
        //console.log("fail:" + JSON.stringify(res.data));
      }
    },
    fail: function(res) {
      failed(-1, res.data);
    }
  })
}

module.exports.TDRequestUrl = function(url, data, success, failed) {

}

//页面交互参数
module.exports.SetPageIntendData = function(tkey, tdata) {
  console.log("SetPageIntendData:" + tkey, tdata)
  wx.clearStorage();
  wx.setStorage({
    key: tkey,
    data: tdata,
  })
}

module.exports.ExistIntendData = function(tkey){
  return wx.getStorageSync(tkey) != null && wx.getStorageSync(tkey) != "";
}

module.exports.RemoveIntendData = function (tkey) {
  return wx.removeStorageSync(tkey)
}

module.exports.GetAndRemoveIntentData = function (tkey) {
    var result = wx.getStorageSync(tkey);
    wx.removeStorageSync(tkey)
    return result
}


module.exports.GetPageIntendData = function(tkey) {
  //console.log("get storage:"+tkey);

  return wx.getStorageSync(tkey);
}
module.exports.GetPageIntendDataDync = function(tkey, callback) {

  return wx.getStorage({
    key: tkey,
    success: callback
  });
}

module.exports.strIsNull = function(str) {
  if (str == "") return true;
  var regu = "^[ ]+$";
  var re = new RegExp(regu);
  return re.test(str);
}

//分析梦想池
module.exports.DreamPoolAnalysis = function(pool) {

  var billResult = module.exports.BillExchange(pool.cbill);
  pool.realBill = billResult.value;
  pool.unit = billResult.unit;
  pool.percentVal = Math.floor((pool.cbill / pool.tbill) * 10000) / 100
  pool.rubill = pool.ubill * 0.01
  pool.day = Math.floor(pool.duration / 86400)
  pool.rtbill = module.exports.BillExchange(pool.tbill)
  pool.rduration = module.exports.DescriptionTime(pool.duration)
  if(pool.ubill >0){
    pool.joincount = pool.cbill / pool.ubill
  }else{
    pool.joincount = pool.pcount
  }
  if (pool.state == 'RUNNING') {
    pool.billHint = "目前互助金"
  } else if (pool.state == 'FINISHED') {
    pool.billHint = "最终互助金"
  }
  /*console.log("billResult:", billResult);
  this.setData({
    mainpool: pool
  })*/
  return pool
}

module.exports.ReloadTabPage = function(){
  var pages = getCurrentPages();
  //console.log(pages);
  if (pages[0] && pages[0].onLoad && pages[0].loadTimes && pages[0].loadTimes > 1) {
    pages[0].onLoad();
  } else {
    pages[0].loadTimes++;
  }
}


module.exports.ReloadPage = function () {
  var pages = getCurrentPages();
  if (pages[0] && pages[0].onLoad) {
    pages[0].onLoad();
  }
}

module.exports.Intend = function(tUrl, redict = false, onsuccess = null) {
  //var self = this;
  if (!redict) {

    wx.navigateTo({
      url: tUrl, //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
      success: function(res) {
        if (onsuccess)
          onsuccess(res)
        console.log("跳转:", res);
        //var page = getCurrentPages().pop();
        //if (page == undefined || page == null) return;
        //page.onLoad();
      }, //成功后的回调；
      fail: function(res) {
        //console.log("跳转:", res);
      }
    })
  } else {
    wx.reLaunch({
      url: tUrl, //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
      success: function () {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }, //成功后的回调；
    })
  }
}

module.exports.PRCTIME = function() {
  var date = new Date();
  return Math.floor(date.getTime() * 0.001)
}

module.exports.DescriptionTime = function(sec) {
  if (sec < 60) {
    return sec + "秒";
  }
  if (sec < 3600) {
    return Math.floor(sec / 60) + "分钟";
  }
  if (sec < 86400) {
    return Math.floor(sec / 3600) + "小时";
  }

  if (sec < 86400 * 30) {
    return Math.floor(sec / 86400) + "天";
  }
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports.GetLocalTime = function (number) {
  

  console.log(number);
  var date = new Date(number * 1000);
  //年
  var Y = date.getFullYear();
  //月
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //时
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  //分
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  //秒
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  
  return Y+"-"+M+'-'+D+ '  '+h+':'+m+':'+s ;
} 

module.exports.BillExchange = function(bill) {
  var result = {
    value: 0,
    unit: ""
  }
  
  if (bill < 1000000) {
    result.value = bill * 0.01;

    result.value = Math.floor(result.value * 100) / 100 

    result.unit = "元";
    return result;
  } else {
    result.value = bill * 0.000001;

    result.value = Math.floor(result.value * 100) / 100 

    result.unit = "万元";
    return result;
  }
  return result;
}

function encodeUTF8(s) {
  var i, r = [],
    c, x;
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

module.exports.sha1 = function(s) {
  var data = new Uint8Array(encodeUTF8(s))
  var i, j, t;
  var l = ((data.length + 8) >>> 6 << 4) + 16,
    s = new Uint8Array(l << 2);
  s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
  for (t = new DataView(s.buffer), i = 0; i < l; i++) s[i] = t.getUint32(i << 2);
  s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
  s[l - 1] = data.length << 3;
  var w = [],
    f = [
      function() {
        return m[1] & m[2] | ~m[1] & m[3];
      },
      function() {
        return m[1] ^ m[2] ^ m[3];
      },
      function() {
        return m[1] & m[2] | m[1] & m[3] | m[2] & m[3];
      },
      function() {
        return m[1] ^ m[2] ^ m[3];
      }
    ],
    rol = function(n, c) {
      return n << c | n >>> (32 - c);
    },
    k = [1518500249, 1859775393, -1894007588, -899497514],
    m = [1732584193, -271733879, null, null, -1009589776];
  m[2] = ~m[0], m[3] = ~m[1];
  for (i = 0; i < s.length; i += 16) {
    var o = m.slice(0);
    for (j = 0; j < 80; j++)
      w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
      t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
      m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
    for (j = 0; j < 5; j++) m[j] = m[j] + o[j] | 0;
  };
  t = new DataView(new Uint32Array(m).buffer);
  for (var i = 0; i < 5; i++) m[i] = t.getUint32(i << 2);

  var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function(e) {
    return (e < 16 ? "0" : "") + e.toString(16);
  }).join("");

  return hex;
};