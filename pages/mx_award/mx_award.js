// pages/award/award.js

const app = getApp()
var C = app.lib

var LINE_UNACTIVE = "line"
var STEP_UNACITVE = "index"
var LINE_ACTIVE = "line activeLine"
var STEP_ACITVE = "index active"
var PROCESS_PAID = "award_info Issued"
var PROCESS_SUBMIT = "award_info"
  //< !--view class='award_info Issued'-- >
  //      < !--view class='award_info audit'-- >
  //<view class='award_info'>
Page({

    /**
     * 页面的初始数据
     */
    data: {
        stateInfo:{
            processClass: PROCESS_SUBMIT,
            title:"",
            hint:"",
            stateInfo:"",
            steps:{
              submit:{
                stepClass: STEP_UNACITVE
              },
              verify: {
                stepClass: STEP_UNACITVE,
                lineClass: LINE_UNACTIVE,
              },
              success: {
                stepClass: STEP_UNACITVE,
                lineClass: LINE_UNACTIVE,
              },
              paid: {
                stepClass: STEP_UNACITVE,
                lineClass: LINE_UNACTIVE,
              }
            }
        }


    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var page = this;
      if (options.hasOwnProperty('id')) {
        C.TDRequest('dr', 'gdream', { uid: app.globalData.openid, did: options.id, state: 'all' },
          function (code, data) {
            page.initStateInfo(data.dream);
          },
          function (code, data) {
            console.log(data)
            wx.showToast({
              title: data.context,
            })
          })
      }


    },
    initStateInfo : function(dream){
        console.log('init:',dream);
        dream.state;//'SUBMIT','DOING','VERIFY','FAILED','SUCCESS'
        dream.payment;// 0 1
        switch(dream.state){
          case "DOING":
            this.setData({
              stateInfo: {
                processClass: PROCESS_SUBMIT,
                title: "完善梦想",
                hint: "小梦想 —— 幸运梦想 —— 完善梦想即可",
                stateInfo: "等待完善",
                steps: {
                  submit: {
                    stepClass: STEP_ACITVE
                  },
                  verify: {
                    stepClass: STEP_UNACITVE,
                    lineClass: LINE_UNACTIVE,
                  },
                  success: {
                    stepClass: STEP_UNACITVE,
                    lineClass: LINE_UNACTIVE,
                  },
                  paid: {
                    stepClass: STEP_UNACITVE,
                    lineClass: LINE_UNACTIVE,
                  }
                }
              }
            })
            break;
          case "VERIFY":
            this.setData({
              stateInfo: {
                processClass: PROCESS_SUBMIT,
                title: "资料审核",
                hint: "资料审核1——2个工作日",
                stateInfo: "审核中",
                steps: {
                  submit: {
                    stepClass: STEP_ACITVE
                  },
                  verify: {
                    stepClass: STEP_ACITVE,
                    lineClass: LINE_ACTIVE,
                  },
                  success: {
                    stepClass: STEP_UNACITVE,
                    lineClass: LINE_UNACTIVE,
                  },
                  paid: {
                    stepClass: STEP_UNACITVE,
                    lineClass: LINE_UNACTIVE,
                  }
                }
              }
            })
            break;
          case "SUCCESS":
            if (dream.payment == 0) {
              this.setData({
                stateInfo: {
                  processClass: PROCESS_SUBMIT,
                  title: "等待打款",
                  hint: "3个工作日内打款",
                  stateInfo: "审核通过",
                  steps: {
                    submit: {
                      stepClass: STEP_ACITVE
                    },
                    verify: {
                      stepClass: STEP_ACITVE,
                      lineClass: LINE_ACTIVE,
                    },
                    success: {
                      stepClass: STEP_ACITVE,
                      lineClass: LINE_ACTIVE,
                    },
                    paid: {
                      stepClass: STEP_UNACITVE,
                      lineClass: LINE_UNACTIVE,
                    }
                  }
                }
              })
            } else {
              this.setData({
                stateInfo: {
                  processClass: PROCESS_PAID,
                  title: "互助金颁发",
                  hint: "互助金已颁发",
                  stateInfo: "",
                  steps: {
                    submit: {
                      stepClass: STEP_ACITVE
                    },
                    verify: {
                      stepClass: STEP_ACITVE,
                      lineClass: LINE_ACTIVE,
                    },
                    success: {
                      stepClass: STEP_ACITVE,
                      lineClass: LINE_ACTIVE,
                    },
                    paid: {
                      stepClass: STEP_ACITVE,
                      lineClass: LINE_ACTIVE,
                    }
                  }
                }
              })
            }
            break;
          default:
            wx.showToast({
              title: '梦想状态不符合要求',
            })
            break;
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