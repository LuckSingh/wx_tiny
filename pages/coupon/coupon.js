// 获取应用实例
var request = require('../../api/request.js');
const app = getApp();
var id;
Page({
  data: {
    act: 'null',
    list: []
  },
  onLoad:function(options) {
    id = options.orderId;
  },
  onShow:function() {
    var that = this;
    var parm = {
      'orderId': id,
    };
    request.voucherList(
      parm,
      (res) => {
        var result = JSON.parse(res.data);
        for (let i = 0; i < result.data.voucherList.length; i++) {
          // 毫秒数转换为xxxx年xx月xx日格式
          var date = result.data.voucherList[i].invalidDate;
          
          result.data.voucherList[i].invalidDate = new Date(date * 1000).getFullYear() + "年" + (new Date(date * 1000).getMonth() + 1) + "月" + (new Date(date * 1000).getDate() + "日");
        }
        
        console.log(result.data);
        that.setData({
          list: result.data.voucherList,
        })
      },
    )
  },
  select(e) {
    app.globalData.coupon = {
      voucherId: e.currentTarget.dataset.id,
      amount: (e.currentTarget.dataset.amount)/100,
      title: e.currentTarget.dataset.title,
    };
   
    this.setData({
      act: e.currentTarget.dataset.index
    });
    
    wx.navigateBack({
      delta: 1
    });
  },
  goBack() {
    app.globalData.coupon = {
      voucherId: '0',
      amount: 0,
      title: '不使用优惠券',
    };
    wx.navigateBack({
      delta: 1
    });
    this.setData({
      act: 'null'
    });
  }
});
