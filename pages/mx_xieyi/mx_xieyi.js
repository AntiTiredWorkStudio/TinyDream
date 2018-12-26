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

    windowH: '',
    windowW: '',
    status: false,
    hide: true,
    showModalStatus: false,


    editID:"",
    titleText:"",
    contentText:"",
    verify:false
  },
  uploadInfo:null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //console.log("编辑",options)
      var page = this

      wx.getSystemInfo({
        success: function (res) {
          page.setData({
            windowH: res.windowHeight,
            windowW: res.windowWidth
          })
        },
      })
      this.isSubmit = false;
    //console.log("options",options)
      if(options.hasOwnProperty('id')){
        //options.id
        var tstate = ''
        if (options.hasOwnProperty('state')){
          tstate = options.state
          if(tstate == 'all'){
            this.setData({
              verify: true
            })
          }
        }
        C.TDRequest('dr', 'gdream', { uid: app.globalData.openid, did: options.id, state: tstate},
        function(code,data){  
          console.log(data)
          page.setData({
            editID: options.id,
            titleText: data.dream.title,
            contentText: data.dream.content
          })
          if (data.hasOwnProperty('upload')){
            page.uploadInfo = data.upload
            console.log("含有上传Token", page.uploadInfo)
          }
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
  // 公函查看
  look: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that = this;
    wx.downloadFile({
      url: 'https://tinydream.antit.top/transactionform.jpg',
      success(res) {
        var ctx = wx.createCanvasContext('look');
        ctx.setFillStyle("#fff");
        ctx.fillRect(0, 0, that.data.windowW, that.data.windowH);
        ctx.drawImage(res.tempFilePath, 0, 0, 793, 1122, 0, 0, that.data.windowW, that.data.windowH - 100)
        ctx.draw();
        that.setData({
          hide: false
        })
        wx.hideLoading();
      }
    })
  },
  // 关闭查看
  close: function () {
    console.log(1)
    this.setData({
      hide: true
    })
  },
  // 公函下载
  download: function () {
    this.setData({
      status: true
    })
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    wx.downloadFile({
      url: 'https://tinydream.antit.top/transactionform.jpg',
      success(res) {
        var ctx = wx.createCanvasContext('photo');
        ctx.drawImage(res.tempFilePath, 0, 0, 793, 1122, 0, 0, 793, 1122)
        ctx.draw();
        setTimeout(function () {
          wx.canvasToTempFilePath({
            canvasId: 'photo',
            success(res) {
              console.log(res)
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success(res) {
                  if (res.errMsg == "saveImageToPhotosAlbum:ok") {
                    wx.hideLoading();
                    wx.showToast({
                      title: '保存成功',
                      icon: 'success',
                      mask: true
                    })
                  } else {
                    wx.hideLoading();
                    wx.showToast({
                      title: '保存失败',
                      icon: 'none',
                      mask: true
                    })
                  }
                }
              })
            }
          })
        }, 1000)
      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，下载失败',
          icon: 'none',
          mask: false
        })
        return;
      }
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

          if (page.data.verify) {
            wx.showModal({
              title: '提示',
              content: '该梦想即将提交审核，请确认所有信息合法无误后点击确定!',
              success:function(res){
                console.log(res)
                if (res.confirm) {
                  C.TDRequest("ds", "sver", {
                    uid: app.globalData.openid,
                    did: page.data.editID
                  },
                    function (code, data) {
                      console.log(data)
                      wx.showToast({
                        title: '提交成功',
                        icon: 'none'
                      })
                      app.currentPage.updateList()
                    },
                    function (code, data) {
                      console.log(data)

                      wx.showToast({
                        title: data.context,
                        icon: 'none'
                      })
                      app.currentPage.updateList()
                    }
                  );
                }
              }
            })
          }
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
  },
  chooseWxImage: function (type, icount, handle) {
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
  onUploadedLetter:function(res){
    console.log(res)
    wx.showLoading({
      title: '正在上传',
      mask:true
    })
    console.log("准备上传",this.uploadInfo.uptoken, res, this.uploadInfo.fileName, this.uploadInfo.upurl)
    this.uploadQiniu(this.uploadInfo.uptoken, res,this.uploadInfo.fileName,this.uploadInfo.upurl,function(res){
      wx.hideLoading()
      wx.showToast({
        title: '上传'+(res?"成功":"失败"),
      })
    });
  },
  pickLetter:function(){
    this.pickImage(this.onUploadedLetter)
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
  uploadQiniu: function (token, filePath, key, url, callBack) {
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
        //console.log(res)
        callBack(true)
      },
      fail: function (error) {
        // console.error(error);
        callBack(false)
      }
    })
  }
})