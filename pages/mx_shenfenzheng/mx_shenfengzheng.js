//index.js

//获取应用实例
const app = getApp()
var C = app.lib
// pages/mx_shenfenzheng/mx_shenfengzheng.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idfrontimg: "",
    idbackimg: "",
    cardimg:"",
    hasIdentity:"",
    idNumber:"",
    cardNumber: "",
    hint: "",
    hintStyle:"color:black",
    bankList: ["招商银行",
      "建设银行",
      "交通银行",
      "邮储银行",
      "工商银行",
      "农业银行",
      "中国银行",
      "中信银行",
      "光大银行",
      "华夏银行",
      "民生银行",
      "广发银行",
      "平安银行",
      "星展银行",
      "恒生银行",
      "渣打银行",
      "汇丰银行",
      "东亚银行",
      "花旗银行",
      "浙商银行",
      "恒丰银行",
      "浦东发展银行",
      "兴业银行",
      "齐鲁银行",
      "烟台银行",
      "淮坊银行",
      "渤海银行",
      "上海银行",
      "厦门银行",
      "北京银行",
      "福建海峡银行",
      "吉林银行",
      "宁波银行",
      "焦作市商业银行",
      "温州银行",
      "广州银行",
      "汉口银行",
      "龙江银行",
      "盛京银行",
      "洛阳银行",
      "辽阳银行",
      "大连银行",
      "苏州银行",
      "河北银行",
      "杭州银行",
      "南京银行",
      "东莞银行",
      "金华银行",
      "乌鲁木齐商业银行",
      "绍兴银行",
      "成都银行",
      "抚顺银行",
      "临商银行",
      "宜昌市商业银行",
      "葫芦岛银行",
      "郑州银行",
      "宁夏银行",
      "珠海华润银行",
      "齐商银行",
      "锦州银行",
      "徽商银行",
      "重庆银行",
      "哈尔滨银行",
      "贵阳银行",
      "西安银行",
      "无锡市商业银行",
      "丹东银行",
      "兰州银行",
      "南昌银行",
      "晋商银行",
      "青岛银行",
      "南通商业银行",
      "九江银行",
      "日照银行",
      "鞍山银行",
      "秦皇岛银行",
      "青海银行",
      "台州银行",
      "盐城银行",
      "长沙银行",
      "赣州银行",
      "泉州银行",
      "营口银行",
      "富滇银行",
      "阜新银行",
      "嘉兴银行",
      "廊坊银行",
      "泰隆商业银行",
      "内蒙古银行",
      "湖州银行",
      "沧州银行",
      "广西北部湾银行",
      "包商银行",
      "威海商业银行",
      "攀枝花市商业银行",
      "绵阳市商业银行",
      "泸州市商业银行",
      "三门峡银行",
      "邢台银行",
      "商丘市商业银行",
      "安徽省农村信用社",
      "江西省农村信用社",
      "湖南农村信用社"]
  },
  bindPickerChange:function(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  getHintInfo : function(state){

    var htext = ""
    var hstyle = ""
    switch(state){
      case "SUBMIT":
        htext = "实名认证信息已经提交"
        hstyle = "color:#e9ba65;font-weight:bold;font-size:18px"
        break;
      case "SUCCESS":
        htext = "实名认证审核通过"
        hstyle = "color:#00ff00;font-weight:bold;font-size:18px"
        break;
      case "FAILED":
        htext = "实名认证失败"
        hstyle = "color:red;font-weight:bold;font-size:18px"
        break;
      default:
        break;
    }
    return {
      text: htext,
      style: hstyle
    }
  }
  ,
  fromLuckyDream :false,
  onLoad: function (options) {
    console.log(options)

    if (options.hasOwnProperty('lucky')){
      this.fromLuckyDream = options.lucky
    }

    var page = this
    C.TDRequest('us','rnameg',{uid:app.globalData.openid},function(code,data){
      console.log(data) //已经实名认证
      var hintInfo = page.getHintInfo(data.realName[app.globalData.openid].state)
      console.log(hintInfo)
      page.setData({
        idfrontimg: data.realName[app.globalData.openid].icardfurl,
        idbackimg: data.realName[app.globalData.openid].icardburl,
        cardimg: data.realName[app.globalData.openid].ccardfurl,
        hasIdentity: true,
        idNumber: data.realName[app.globalData.openid].icardnum,
        cardNumber: data.realName[app.globalData.openid].ccardnum,
        hint: hintInfo.text,
        hintStyle: hintInfo.style
      })
    }, function (code, data) {
      console.log(data) //未实名认证
      var targetState = "NONE"
      if(data.code=="41"){
        targetState = "FAILED"   
        wx.showModal({
          title: '提示',
          content: '您提交的实名认证信息不符合规则,未通过审核,如需帮助请与客服联系',
          success:function(res){
            if (res.confirm){
              //跳转至客服页面
            }
          }
        })
      }
      var hintInfo = page.getHintInfo(targetState)
      console.log(hintInfo)
      page.setData({
        idfrontimg: "",
        idbackimg: "",
        cardimg: "",
        hasIdentity: false,
        idNumber: "身份证号",
        cardNumber: "银行卡号",
        hint: hintInfo.text,
        hintStyle: hintInfo.style
      })
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

  idNum: "",
  cardNum: "",
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }, 
  onInputIDCode: function(res){
    this.idNum = res.detail.value
    //console.log(res.detail.value)
  },
  onInputCardCode: function (res) {
    this.cardNum = res.detail.value
    //console.log(res.detail.value)
  },
  upLoadImg: function (list) {
    var that = this;
    this.upload(that, list);
  },
  chooseWxImage: function (type,icount,handle) {
    wx.chooseImage({
      count: icount,
      sizeType: ["original", "compressed"],
      sourceType: [type],
      success: function (res) {
        
        var addImg = res.tempFilePaths;
        handle(addImg[0])
      },
    })
  },
  pickImage: function (func) {
    var page = this
    wx.showActionSheet({
      itemList: ["从相册中选择", "拍照"],
      itemColor: "#5ecd98",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            page.chooseWxImage("album", 1, func);
          } else if (res.tapIndex == 1) {
            page.chooseWxImage("camera", 1, func);
          }
        }
      }
    })
  },
  pickCard: function () {
    if (this.data.hasIdentity) {
      wx.showToast({
        title: "认证信息已经提交",
        icon: "none"
      })
      return;
    }
    this.pickImage(this.uploadCard)
  },

  pickIDf: function () {
    if (this.data.hasIdentity) {
      wx.showToast({
        title: "认证信息已经提交",
        icon: "none"
      })
      return;
    }
    this.pickImage(this.uploadIDFront)
  },

  pickIDb: function () {
    if (this.data.hasIdentity){
      wx.showToast({
        title: "认证信息已经提交",
        icon: "none"
      })
      return;
    }
    this.pickImage(this.uploadIDBack)
  },
  uploadCard:function(imgUrl){
    this.setData({
      cardimg: imgUrl
    })
    //console.log(imgUrl)
    //that.upLoadImg(img);
  },
  uploadIDFront: function (imgUrl) {
    this.setData({
      idfrontimg: imgUrl
    })
  },
  uploadIDBack: function (imgUrl) {
    this.setData({
      idbackimg: imgUrl
    })
  },
  submit:function(){
    console.log("提交")
    var page =this
    /*idfrontimg: "",
      idbackimg: "",
        cardimg: ""*/
    if (this.idNum == "" || this.cardNum == "" || this.data.cardimg == "" || this.data.idfrontimg == "" || this.data.idbackimg== ""){
      wx.showToast({
        title:"信息填写不全",
        icon:"none"
      })
      return;
    }
    wx.showLoading({
      title: '正在上传',
      mask:true
    })
    //us=rnames&uid=a01
    C.TDRequest('us','rnames',{uid:app.globalData.openid},
    function(code,data){
      var token = data.uptoken
      var filenames = data.filename
      var url = data.upurl
      var timeStamp = data.timeStamp
      page.uploadAll(token, filenames, url,timeStamp)
      //page.uploadQiniu(token, page.data.idfrontimg, filenames.id_f, url)
    },
    function(code,data){
      wx.hideLoading()
      wx.showToast({
        title: data.context,
        icon: "none"
      })
    }
    )
  },
  submited: function (keyList,sign) {
    //console.log("完成上传:", keyList)
    //us = rnamef & uid=a01 & ccardnum=123 & icardnum=456 & signal=saasd
    var page =this
    
    C.TDRequest(
      'us','rnamef',
      {
        uid:app.globalData.openid,
        ccardnum: page.cardNum,
        icardnum: page.idNum,
        signal: sign,
      },
      function (code, data) {
        if (page.fromLuckyDream){
          wx.navigateBack({
            success:function(){
              wx.hideLoading()
              wx.showToast({
                title: '完成上传',
                icon: 'success'
              })
            }
          })
        }else{
          wx.hideLoading()
          wx.showToast({
            title: '完成上传',
            icon: 'success'
          })
          page.onLoad()
        }
      },
      function (code, data) {
        console.log(data)
        wx.hideLoading()
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    )
  },
  uploadAll: function (token, keys, url,tStamp) {
    var page = this
    var uploadList = [
      {
        filePath:page.data.idfrontimg,
        key:keys.id_f
      },
      {
        filePath: page.data.idbackimg,
        key: keys.id_b
      },
      {
        filePath: page.data.cardimg,
        key: keys.card_f
      }
    ]

    console.log('uploadList:',uploadList)
    var signal = C.sha1(app.globalData.openid + tStamp)
    //console.log(signal)
    var i = 0
    var keyList = []
    var loopHandle = function (t,key) {
      if(key != null){
          keyList.push(key)
      }
      
      if (t >= uploadList.length) {
        page.submited(keyList, signal)
        return;
      }
      page.uploadQiniu(token, uploadList[t].filePath, uploadList[t].key, url, loopHandle, t)
    }
    loopHandle(i)
    
  },
  uploadQiniu: function (token, filePath,key,url,callBack,i=0){
  //filePath, success, fail, options, progress, cancelTask
   //console.log(callBack)
    var formData = {
      'token': token,
      'key': key
    };
    var uploadTask = wx.uploadFile({
      url: url,
      filePath: filePath,
      name: 'file',
      formData: formData,
      success: function (res) {
        console.log(res)
        callBack(i+1,JSON.parse( res.data).key)
      },
      fail: function (error) {
        console.error(error);
        callBack(i)
      }
    })
  }
})