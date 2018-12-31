// pages/calc/calc.js
const app = getApp()
var C = app.lib
Page({

    /**
     * 页面的初始数据
     */
    data: {
      except:0,
      code:0,
      pid:0,
      pcount:0,
      step01Result:0,
      step02Result: 0,
      finalresult:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var page = this
        console.log(options)
        C.TDRequest('aw','calc',{pid:options.pid},
        function(code,data){
          var step01 = parseInt(data.awardInfo.expect) + parseInt(data.awardInfo.code) + parseInt(data.awardInfo.pid)
          var step02 = step01 % parseInt(data.awardInfo.pcount)
          var final = step02+10000000
          page.setData({
            except: data.awardInfo.expect,
            code: data.awardInfo.code,
            pid: data.awardInfo.pid,
            pcount: data.awardInfo.pcount, 
            step01Result: step01,
            step02Result: step02,
            finalresult: final,
          })
          console.log(data)
        },
        function(code,data){

        });
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})