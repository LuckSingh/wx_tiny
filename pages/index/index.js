var request = require('../../api/request.js');
const app = getApp();
Page({
  data: {
    isLogin: false,//是否登录成功
  },
  onLoad: function (options) {
    app.getCityCode();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {

    // 页面显示
    var that = this;
    var isLoginState = wx.getStorageSync('isLogin');
    if (isLoginState){
      that.setData({
        isLogin: true
      })
    }else{
      //没有登录时候拉userInfo
      app.getUserInfo((res) => {
        //gainOpenId
        var parm = {
          "code": res,
          "type": 1
        }
        // request.gainOpenId(parm,function(result){
        //   var resultData = JSON.parse(result.data);   
        //   if(resultData.errorCode == 0){
        //     var openId = resultData.data.openId;
        //     app.globalData.openId = resultData.data.openId;
        //     console.log("存下来的openId"+app.globalData.openId);
        //     wx.setStorageSync('openId', resultData.data.openId);
        //     that.getUser(openId);
        //   }else{
        //     wx.showModal({
        //       content: resultData.errorMsg,
        //     })
        //   }
        // })
        that.getUser(res);
      });
    }
    that.state();
    // wx.getStorage({
    //   key: 'isLogin',
    //   success: function (res) {
    //     if (res.data) {
    //       that.setData({
    //         isLogin: true
    //       })
    //     }
    //     that.state();
    //   }
    // })

  },
  //没有登录
  login: function () {
    //var that = this;
    wx.navigateTo({
      url: '../login/login',
    })
    
  },
  getUser: function (res) {
    var that = this;
    var h = {
      "code": res,
    }

    request.userInfo(h, function (result) {
      var resultData = JSON.parse(result.data);
      

      switch (resultData.errorCode) {
        case 0:
          
          //存下openID
          // app.globalData.openId = resultData.data.openId;
          wx.setStorageSync('openId', resultData.data.openId);
          // if (resultData.data.depositStatus == 1) {
          //   //已经交纳押金
          //   if (resultData.data.authStatus == 1) {
          //     //交纳押金并且实名认证了
          //     wx.navigateTo({
          //       url: '../login/login?id=' + resultData.data.openId,
          //     });

          //   } else {
          //     // 没有实名认证
          //     wx.navigateTo({
          //       url: '../realname/realname',
          //     })
          //     that.setData({
          //       isLogin: false
          //     })
          //   }
          // } else {
          //   //没有交纳押金
          //   wx.navigateTo({
          //     url: '../deposit/deposit',
          //   })
          //   that.setData({
          //     isLogin: false
          //   })
          // }

          break;
        case 1001:
          //跳转到登录
          //存下openID
          //app.globalData.openId = resultData.data.openId;
          wx.setStorageSync('openId', resultData.data.openId);
          // wx.navigateTo({
          //   url: '../login/login?id=' + resultData.data.openId,
          // });
          break;
      }
    })
  },
  // 解锁轮询
  state: function () {
    var that = this;
    var da = {};
    request.state(
      da,
      (res) => {
        var result = JSON.parse(res.data);
           
        if (result.errorCode == 0) {
          // 0 闲置 1 已经预约在寻车中 2解锁中 3骑行中 4落锁中 5临时停车中 6已结束用车但还没有支付	
          switch (result.data.type) {
            // 用车中
            case 3:
              wx.showModal({
                content: '您有正在使用的单车', // alert 框的标题
                confirmText:"知道了",
                showCancel:false,
                success: function (res) {
                  wx.navigateTo({
                    url: '../using/using', // 需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数。参数与路径之间使用
                  });
                },
              });
              break;
            // 结束用车但还没有支付	
            case 6:
              wx.showModal({
                content: '您有未支付的订单，请支付后再用车',
                confirmText: "立即支付",
                success: function (res) {
                  if (res.confirm) {
                    //点击支付
                    wx.navigateTo({
                      url: '../cost/cost?id=' + result.data.info.orderId,
                    })
                  } else if (res.cancel) {
                    //点击取消
                    // wx.navigateBack({
                    //   delta: 1
                    // })
                  }
                }
              })
              break;
          }
        }
      },
    )
  },
  //已经登录了 扫码用车
  goScanCode: function () {
    //console.log(navigator.userAgent)
    var that = this;
    // var result = 'https://www.bluegogo.com/qrcode.html?no=755500143';

    // wx.navigateTo({
    //   url: '../unlock/unlock?no=' + result.split("no=")[1]+'&url='+result,
    // })
    //扫码时候在更改回来
    wx.scanCode({
      success: function (res) {

        wx.navigateTo({
          url: '../unlock/unlock?no=' + res.result.split("no=")[1] + '&url=' + res.result,
        })
      }
    })
  },
  my: function () {
    var that = this;
    wx.navigateTo({
      url: '../deposit/deposit',
    })
  },
  //联系客服
  makePhoneCall: function () {
    app.makePhoneCall()
  }
})