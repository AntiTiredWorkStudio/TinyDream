//index.js

//获取应用实例
const app = getApp()
var C = app.lib

// pages/mx_xieyi/mx_xieyi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editID:"",
    titleText:"",
    contentText:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //console.log("编辑",options)
      var page = this
      this.isSubmit = false;
      if(options.hasOwnProperty('id')){
        //options.id
        var tstate = ''
        if (options.hasOwnProperty('state')){
          tstate = options.state
        }
        C.TDRequest('dr', 'gdream', { uid: app.globalData.openid, did: options.id, state: tstate},
        function(code,data){  
          console.log(data)
          page.setData({
            editID: options.id,
            titleText: data.dream.title,
            contentText: data.dream.content
          })
          page.title = data.dream.title
          page.content = data.dream.content
        },
          function (code, data) {
            console.log(data)
            wx.showToast({
              title: data.context,
            })
            wx.navigateBack()
        })
      }
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
    //console.log("on hide")
    //app.onPageExit()
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

  } ,
  title:"",
  content:"",
  agree:false,
  titleInput: function (res) {
    this.title = res.detail.value
  },
  contentInput: function (res) {
    this.content = res.detail.value
  },
  checkedEvent: function (res) {
    this.agree = Object.keys(res.detail.value).length ==1;
    console.log(this.agree)
  },
  readDetial:function(){
    C.Intend('../mx_routine/mx_routine')
  },
  downLoad:function(){
    wx.downloadFile({
      url:"https://tinydream.antit.top/小梦想互助幸运者梦想互助金申请公函.docx",
      success:function(res){
        console.log("下载完成:",res)
        const path = res.tempFilePath
        console.log(path)
        wx.openDocument({
          filePath:path,
          fileType:"docx",
          success(res) {
            console.log('打开文档成功')
          }
        })
       /* wx.saveFile({
          tempFilePath: ,
        })*/
       // wx.openDocument({
          /*res.tempFilePath,
          success:function(res){

          }*/
        //})
      }
    })
  },
  isSubmit : false,
  submitDream: function (res) {
    console.log("提交梦想")
    var page = this
    if(!this.agree){
      wx.showToast({
        title:"还未同意用户协议",
        icon:"none"
      })
      return;
    }

    if (C.strIsNull(page.title) || C.strIsNull(page.content)){     
      wx.showToast({
        title: "梦想信息填写不完整",
        icon: "none"
      })
      return;
    }
    

    //dr = dedit & uid=a01 & title=关于程序的梦想 & content=我就特么想赶紧做完这个
    if (this.isSubmit) {
      return
    }
    this.isSubmit = true

    var dataset = {
      uid: app.globalData.openid,
      title: this.title,
      content: this.content,
      //action: app.actionList
    }

    var force = false

    if(Object.keys(app.actionList).length>0){
      dataset.action = JSON.stringify(app.actionList)
      console.log(app.actionList);
      force = true
    }
    if (this.data.editID != ""){
      C.TDRequest("dr", "gedit",
        {
          uid:app.globalData.openid,
          did:page.data.editID,
          contentList:JSON.stringify(
            {
              title: page.title,
              content: page.content
            }
          )
        },
        function (code, data) {
          console.log(data)
          wx.navigateBack()
          app.currentPage.updateList()
          wx.showToast({
            title: '修改成功',
            icon:'success'
          })
        },
        function (code, data) {
          console.log(data)
          wx.showToast({
            title: data.context,
            icon: "none"
          })
        }
      )
    }else{
      C.TDRequest("dr","dedit",
        dataset, 
        function(code,data){
          //console.log(data)
          //console.log(force)
          if(!force){
            wx.navigateBack()
            app.currentPage.updateList()

            wx.showToast({
              title: '提交成功',
              icon: 'success'
            })
  //          console.log("current Page",app.currentPage)
          }
        },
        function (code, data) {
          console.log(data)
          wx.showToast({
            title:data.context,
            icon:"none"
          })
        }
      )
    }
  }
})