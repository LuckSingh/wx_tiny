// 获取应用实例
var request = require('../../api/request.js');
const app = getApp();
var id;
Page({
  data: {
    'list.actualPrice': 0,
    'totalCnt': 0,
    'timeStr': 0,
    'activityPriceP': 0,
    'privilegeDiscount': 0,
    'amount': 0,
    'activityTime': 0
  },
  onLoad: function (options) {
    id = options.id;
    this.orderDetail(0);
  },
  onShow: function () {
    var that = this;
   
    // if (app.globalData.coupon != null) {
     
    //   var order = that.data.list
    //   var amount = (app.globalData.coupon.amount * 1)/100;
    //   var totalCnt = (order.voucher ? order.actualPrice - amount * 100 <= 0 ? 0 : (order.actualPrice - amount * 100) / 100 : order.actualPrice / 100).toFixed(2);

      
    //   this.setData({
    //     'list.voucher.voucherId': app.globalData.coupon.voucherId,
    //     'amount': app.globalData.coupon.amount * 1,
    //     'list.voucher.title': app.globalData.coupon.title,
    //     'totalCnt': totalCnt
    //   });
      
    // } else {
     
    //   that.orderDetail(0);
    // }
    if (app.globalData.coupon != null) {
     
      this.setData({
        'list.voucher.voucherId': app.globalData.coupon.voucherId,
        amount: app.globalData.coupon.amount,
        'list.voucher.title': app.globalData.coupon.title
      })
      var totalCnt = (app.globalData.coupon ? that.data.list.actualPrice - app.globalData.coupon.amount * 100 <= 0 ? 0 : (that.data.list.actualPrice - app.globalData.coupon.amount * 100) / 100 : that.data.list.actualPrice / 100).toFixed(2);
      if (totalCnt + '' == 'NaN') {
        totalCnt = '0.00';
      }
      that.setData({
        totalCnt: totalCnt,
      });
      
    } else {
      that.orderDetail(0);
    }
  },
  coupon: function () {
    var that = this;
    if (that.data.list.voucher == undefined){
      return;
    }else{
      app.globalData.coupon = null;
      wx.navigateTo({
        url: '../coupon/coupon?orderId=' + id,
      });
    }
    // app.globalData.coupon = null;
    // wx.navigateTo({
    //   url: '../coupon/coupon?orderId=' + id,
    // });
   
  },
  // 支付
  pay() {
    var that = this;
    var channel;
    if (Number(that.data.totalCnt) == 0) {
      channel = 2;
    } else {
      channel = 10;
    }
    var da = {
      'voucherId': (that.data.list.voucher ? that.data.list.voucher.voucherId : ''),
      'orderId': id,
      'channel': channel,
    };
    request.pay(
      da,
      (res) => {
        var that = this;
        var result = JSON.parse(res.data);
        console.log(result.errorCode);
        if (channel == 10 && result.errorCode == '0') {
          var orderStr = JSON.parse(result.data.charge);

          wx.requestPayment({
            'appId': orderStr.appId,
            'timeStamp': orderStr.timeStamp,
            'nonceStr': orderStr.nonceStr,
            'package': orderStr.package,
            'signType': orderStr.signType,
            'paySign': orderStr.paySign,
            'success': (res) => {
              //强刷状态选择进入的页面
              // that.isForce();
              //isForce = 1;
              that.orderDetail(1);
              wx.na
              wx.redirectTo({
                url: '../final/final?id=' + id,
              });
            }
          })
        } else if ((channel == 2 && result.errorCode == '0') || (result.errorCode == '1029')) {
          wx.redirectTo({
            url: '../final/final?id=' + id,
          });
        } else if (result.errorCode == '1034') {
          //重新来
          //先跳过去
          // that.orderDetail(1);
          // wx.redirectTo({
          //   url: '../final/final?id=' + id,
          // });
          //后面在更改
          request.pay(da,(res)=>{
            var result = JSON.parse(res.data);
            console.log('result='+result.data);
            var orderStr = JSON.parse(result.data.charge);
            wx.requestPayment({
              'appId': orderStr.appId,
              'timeStamp': orderStr.timeStamp,
              'nonceStr': orderStr.nonceStr,
              'package': orderStr.package,
              'signType': orderStr.signType,
              'paySign': orderStr.paySign,
              'success': (res) => {
                //强刷状态选择进入的页面
                //isForce = 1;
                that.orderDetail(1);
                //that.isForce();
                wx.redirectTo({
                  url: '../final/final?id=' + id,
                });
              }
            });
          })
          
        } else {
          wx.showModal({
            content: result.errorMsg, // alert 框的标题
          });
        }
      },
    )
  },
  service(){
    app.makePhoneCall();
  },
  orderDetail: function (isForce) {
    var that = this;
    var parm = {
      'isForce': isForce,
      'orderId': id,
    };
    request.orderDetail(
      parm,

      function (res) {
        
        var result = JSON.parse(res.data);
        console.log(result);
        var order = result.data.order;
        var time = order.useTime;
        if (app.globalData.amount == null) {
          app.globalData.amount = order.voucher ? order.voucherAmount ? order.voucherAmount : (order.voucher.amount / 100) : '0';
        } 
        if (app.globalData.voucherId == null) {
          app.globalData.voucherId = order.voucher ? ((order.voucherId == '0')) ? order.voucher.voucherId : order.voucherId : 0;
        }

        var useTime = order.useTime,
          usePrice = order.rawPrice;
        if (order.activityOrder) {
          useTime = order.activityNormalTime;
          usePrice = order.activityNormalPrice;
        }
        let useMinute = Math.ceil(useTime / 60);
        let useHours = parseInt(useMinute / 60);

        let timeStr = useHours > 0 ? (useHours + '小时' + Math.ceil(useMinute % 60) + '分钟') : (Math.ceil(useMinute) + '分钟');
        let amount = Number(order.voucher ? order.voucherAmount ? order.voucherAmount : (order.voucher.amount / 100) : 0);
        let privilegeDiscount = Number(order.isPrivilege ? (order.privilegeDiscount / 100).toFixed(2) : 0);
        let activityPriceP = Number(order.activityOrder ? order.activityBenefit / 100 : 0);
        var totalCnt = (order.voucher ? order.actualPrice - amount * 100 <= 0 ? 0 : (order.actualPrice - amount * 100) / 100 : order.actualPrice / 100).toFixed(2);
        console.log(totalCnt);
        if (totalCnt + '' == 'NaN') {
          totalCnt = '0.00';
        }
        // 活动时长
        var activityTime = order.activityOrder ? parseInt(order.activityTime / 3600) > 0 ? (parseInt(order.activityTime / 3600) + '小时' + parseInt(order.activityTime % 3600 / 60) + '分钟') : (Math.ceil(order.activityTime / 60) + '分钟') : 0 + '+' + order.activityOrder ? order.activityPriceRules : 0;
         //标准计费 金额格式化
        var activityNormalPrice = (order.activityNormalPrice / 100).toFixed(2);
        //标准计费 金额格式化
        var rawPrice = (order.rawPrice / 100).toFixed(2);
        //标准计费 金额格式化
        var activityPrice = (order.activityPrice / 100).toFixed(2);
        //特权卡 金额格式化
        var privilege = (order.privilegeDiscount / 100).toFixed(2);

        that.setData({
          list: order,
          activityNormalPrice: activityNormalPrice,
          rawPrice:rawPrice,
          totalCnt: totalCnt,
          activityPrice: activityPrice,
          timeStr: timeStr,
          activityPriceP: activityPriceP,
          privilegeDiscount: privilegeDiscount,
          privilege: privilege,
          amount: amount,
          activityTime: activityTime,
          usePrice: usePrice
        });
        
      },
    )
  }
});
