//app.js
const app = getApp();
var request = require('./api/request.js');
App({
  onLaunch: function () {
    var that = this;
    
  },

  getUserInfo: function (callback) {
    var that = this;
    wx.login({
      success: function (authcode) {
        if (authcode.code) {
          //发起网络请求
          callback&&callback(authcode.code)
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  getCityCode: function (callback) {
    var that = this;
    wx.getLocation({
      success: function (res) {
       //获取到位置信息  存放在全局中
        that.globalData.longitude = res.longitude;
        that.globalData.latitude = res.latitude;
        // todo 定位失败处理
        if (callback) {
          callback()
        }
        
      }
    })
  },
  makePhoneCall:function() {
    wx.makePhoneCall({
      //phoneNumber: '4008003898', //拨打电话
      phoneNumber: '4008003898',
     
    })
  },
  globalData: {
    isLogin: false,
    isDeposit: false,
    isAuth:false,
    coupon: null,
    openId: '',
    userInfo: null,
    amount: null,
    price: null,
    voucherId: null,
    unlockCode: '',
    voucher: null,
    FORCE_STATUS:{
      FORCE_IN:1,
      FORCE_OUT:0
    },
    PAY_PAGE_STATUS:{
      REALNAME_SUCCESS:1
    }
  },
})
