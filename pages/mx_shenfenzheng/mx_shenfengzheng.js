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
    hintStyle:"color:black"
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