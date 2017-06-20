var request = require('../../api/request.js');
const app = getApp();
Page({
  data: {
    voucher: {
      'voucherId': '0',
      'amount': '0',
      'title': '恭喜你获得新人券',
      'desc': '描述',
      'invalidDate': '2017年10月09日',
      'validDate': '2017年10月01日',
    },
    'yuan': '0',
    'time': '2017年10月01日',
    'isCoupon': false
    
  },
  layoutClose: function () {
    //点击关闭红包的按钮
    this.setData({
      isCoupon: false
    })
  },
  //去用车
  goUsingBike: function () {
   wx.navigateBack({
     delta:99
   })
  },
  onLoad: function (options) {
  },
  onShow: function () {
   
    var that = this;
    // 页面显示
    // 初始状态为未实名认证且未交押金

    var fen = ((app.globalData.voucher.amount / 100).toFixed(2)).split(".")[1];
    // 毫秒数转换为xxxx年xx月xx日格式
    var date = app.globalData.voucher.invalidDate;
    app.globalData.voucher.invalidDate = new Date(date * 1000).getFullYear() + "年" + (new Date(date * 1000).getMonth() + 1) + "月" + (new Date(date * 1000).getDate() + "日");
   
    that.setData({
      'voucher': app.globalData.voucher,
      'yuan': Math.floor(app.globalData.voucher.amount / 100),
      'fen': fen
    })
   
      that.setData({
        isCoupon: true
      })
   
  },

})