// 获取应用实例
const app = getApp();
var request = require('../../api/request.js');
var depositStatus = 0, authStatus=0;
Page({
  data: {
    isDeposit: false,//判断是否交纳押金
    depositNum: "0"//押金金额
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onShow: function () {
    var that = this;
    that.authState(app.globalData.FORCE_STATUS.FORCE_OUT);
  },
  wxpay: function () {
    //点击微信支付按钮
    var that = this;
    var da = {
      'channel': 10
    };
    request.deposit(
      da,
      (res) => {

        var result = JSON.parse(res.data);

        if (result.errorCode == 1029) {
          //支付成功了  不用在支付了
         
          that.setData({
            isDeposit: true,
            depositNum: result.data.depositPayable,
            realyNum: result.data.depositPaid,
            depositType: result.data.depositType

          })
          wx.redirectTo({
            url: '../realname/realname',
          })
          
        } else {
          var orderStr = JSON.parse(result.data.charge);
          var that = this;
          console.log(orderStr);
          wx.requestPayment({
            'appId': orderStr.appId,
            'timeStamp': orderStr.timeStamp,
            'nonceStr': orderStr.nonceStr,
            'package': orderStr.package,
            'signType': orderStr.signType,
            'paySign': orderStr.paySign,
            'success': (res) => {
             //强刷状态选择进入的页面
              that.isForce();
            }
          });
        }
      },
    )
  },
  authState: function (isForce) {
    var that = this;
    var da = {
      'isForce': isForce,
    };
    request.authStatus(
      da,
      (res) => {
        var result = JSON.parse(res.data);
        if (result.errorCode == 0) {
          //成功 可以取到押金状态
          var depositStatus = result.data.depositStatus;
          if (depositStatus == 0) {
            //没有交纳押金 显示没有交纳押金的状态
            that.setData({
              isDeposit: false,
              depositNum: result.data.depositPayable,
              realyNum: result.data.depositPaid,
              depositType: result.data.depositType
            })
          } else {
            
            //已经交纳押金
            that.setData({
              isDeposit: true,
              depositNum: result.data.depositPayable,
              realyNum: result.data.depositPaid,
              depositType: result.data.depositType
            })
          }
        } else {
          wx.removeStorageSync('openId');
          wx.removeStorageSync('isLogin');
          wx.showModal({
            showCancel:false,
            confirmText:'知道了',
            content: result.errorMsg,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '../index/index',
                })
              }
            }
          })
        }
      },
    )
  },
  // 状态强刷
  isForce() {
    var that = this;
    var da = {
      'isForce': 1,//强制刷新状态
    };
    request.authStatus(
      da,
      (res) => {
        console.log(res);
        var result = JSON.parse(res.data);
        switch (result.errorCode) {
          case 0:
            depositStatus = result.data.depositStatus;
            authStatus = result.data.authStatus;
            that.setData({
              depositNum: result.data.depositPayable,
              realyNum: result.data.depositPaid,
              depositType: result.data.depositType,
            })
            if (depositStatus == 1) {
              // 已交押金
              if (authStatus == 0) {
             
                wx.redirectTo({
                  url: '../realname/realname'
                })
              } else {
                // 已交押金且已实名认证

                wx.redirectTo({
                  url: '../complate/complate'
                });
              
              }
            } else if (depositStatus == 0) {
              // 未交押金
              if (authStatus == 0) {
                // 未交押金且未实名认证
                that.setData({
                  authStatus: false,
                  isDeposit: false,
                })
              } else {
                // 未交押金但已实名认证
                that.setData({
                  authStatus: true,
                  isDeposit: false
                })
              }
            }
            break;
          default:
            wx.showModal({
              content: result.errorMsg,
            })
            break;
        }
      },
    )
  }

})