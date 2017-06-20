var request = require('../../api/request.js');
var hour = 0, minute = 0, second = 0;
var no, force = 0;;
var timeoutHandle = null;
var hideUnlock = 1;
const app = getApp();
Page({
  data:{
    'number': '0000000',
    'time': '00:00',
    'cost': '0.0',
    'isUnlock': false,
    'hideUnlock': true,
    'code': 9999,
    'priceDesc': '',
    'showEndCost':false
  },
  
  onLoad:function(options){
    //no = '755000006'
    no = options.no;
    app.getCityCode();
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    var that = this;
    that.state();
    
  },
  toDou:function(n){
    if (n < 10) {
      n = '0' + n;
    } else {
      n = n;
    }

    return n;
  },
  state:function() {
    var that = this;
    request.state(
      {},
      function(res) {
        var result = JSON.parse(res.data);
        if (result.errorCode == 0) {
          // 0 闲置 1 已经预约在寻车中 2解锁中 3骑行中 4落锁中 5临时停车中 6已结束用车但还没有支付	
          switch (result.data.type) {
            // 闲置
            case 0:
              // 订单自动支付
              if (1 == 1) {
                wx.redirectTo({
                  url: '../final/final',
                });
              } else {
                wx.navigateBack({
                  delta:99
                })
              }
              break;
            // 用车中
            case 3:
              if (result.data.info.bike.unlockCode) {
                var code = result.data.info.bike.unlockCode.split('');
                if (hideUnlock = 1) {
                  that.setData({
                    'isUnlock': true,
                    'code': result.data.info.bike.unlockCode,
                    'code1': code[0],
                    'code2': code[1],
                    'code3': code[2],
                    'code4': code[3],
                  })
                  hideUnlock--;
                } else {
                  that.setData({
                    'code': result.data.info.bike.unlockCode,
                  })
                }
              }
              // 格式化时间
             
              //result.data.info.useTime = 0;
              var time = Number(result.data.info.useTime)+60;
             
              var hour = 0;
              var min = 0;
              var s = 0;
              if (time >= 0) {
                hour = Math.floor(time / 60 / 60 % 24);
                min = Math.floor(time / 60 % 60);
                s = Math.floor(time % 60);

                time = that.toDou(hour)+':'+that.toDou(min);
              }

              // var time = Math.floor(result.data.info.useTime / 60) < 60 ? '00:' + (Math.floor(result.data.info.useTime / 60) < 10 ? '0' + Math.floor(result.data.info.useTime / 60) : Math.floor(result.data.info.useTime / 60)) : (Math.floor(Math.floor(result.data.info.useTime / 60) / 60) < 10 ? '0' + Math.floor(Math.floor(result.data.info.useTime / 60) / 60) : Math.floor(Math.floor(result.data.info.useTime / 60) / 60)) + ':' + (Math.floor(Math.floor(result.data.info.useTime / 60) % 60) < 10 ? '0' + Math.floor(Math.floor(result.data.info.useTime / 60) % 60) : (Math.floor(Math.floor(result.data.info.useTime / 60) % 60)));
              
              //console.log(result.data.info.useTime);
             // console.log(result.data.info.cost);


              that.setData({
                'number': result.data.info.bike.no,
                'cost': (result.data.info.cost / 100).toFixed(2),
                'priceDesc': (result.data.info.bike.priceDesc ? result.data.info.bike.priceDesc : ''),
                'time': time
              })
              timeoutHandle = setTimeout(function () {
                that.state();
              }, 10000);
              break;
            // 待支付
            case 6:
              wx.redirectTo({
                url: '../cost/cost?id=' + result.data.info.orderId,
              });
              break;
            // 其他状态
            default:
              wx.navigateBack({
                delta: 99
              })
              break;
          }
        }
      },
    )
  },
  // 返回首页
  goBack:function() {
    app.globalData.isDeposit = 'true';
    console.log("go_back");
    wx.navigateBack({
      delta: 99
    })
  },
  // 机械锁弹窗隐藏
  hideUnlock:function() {
    this.setData({
      'hideUnlock': false, 
    })
  },
  // 结束用车
  finish() {
    var that = this;
    wx.showModal({
      content: '请确认已手动落锁并已复位密码？', // confirm 框的标题
      success: function (res) {
        if (res.confirm) {
          that.confirmFinish();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    });
  },
  confirmFinish() {
    
    var that = this;
    app.getCityCode(() => {
      request.lockBikeBrief(
        {
          'bikeNo': that.data.number,
          'longitude': app.globalData.longitude,
          'latitude': app.globalData.latitude,
          'force': force,
        },
        (res) => {
          console.log("dsadas"+res);
          var result = JSON.parse(res.data);
          if (result.errorCode == 0) {
            if (result.data.order.status == 0) {
              wx.redirectTo({
                url: '../final/final?id=' + result.data.order.orderId,
              });
            } else {
              wx.redirectTo({
                url: '../cost/cost?id=' + result.data.order.orderId,
              });
            }
          } else if (result.errorCode == 1011) {
            var scdStr = result.errorMsg.split('<xml>')[1].split('</xml>')[0];
            wx.showModal({
              content: scdStr, // confirm 框的标题
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  force = 1;
                  that.confirmFinish();
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              },
            });
          }
        },
      )
    });
  },
  // 落锁不结费
  service() {
    app.makePhoneCall();
  },
  onUnload:function(){
    // 页面关闭
    if (timeoutHandle != null) {

      clearTimeout(timeoutHandle);
    }
  }
})