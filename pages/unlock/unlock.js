// 获取应用实例
var request = require('../../api/request.js');
var hour = 0, minute = 0, second = 0;
var no, url, result, parm, orderId;
const app = getApp();
Page({
  data: {
    'number': '0000102',
    'time': '00:00',
    'cost': '1.5',
    'isUnlock': true,
    'code': 9999,
    'connect': false,
    'gifStatus': 1,
    'progress': 0
  },
  onLoad(options) {
    //https://www.bluegogo.com/qrcode.html?no=010000500
    if (options.q) {
      const q = decodeURIComponent(options.q);
      no = q.split("no=")[1];
      result = q;
    } else {
      no = options.no;
      url = options.url;
      result = url + '?no=' + no;
    }
    app.getCityCode();
  },
  onShow: function () {

    // 页面显示 
    var that = this;
    that.state(true);
    //that.unlock();
    setTimeout(function () {
      that.setData({
        'gifStatus': 2
      })
    }, 800);
    setTimeout(function () {
      that.progress();
    }, 500);
    // setTimeout(function () {
    //   that.setData({
    //     'connect': true
    //   })
    // }, 2000);
  },
  // 解锁请求
  unlock: function () {
    var that = this;
    var parm = {
      "bikeNo": no,
      "method": 0,
      "longitude": app.globalData.longitude,
      "latitude": app.globalData.latitude,
      "considerActivity": "1"
    };
    request.unlockBike(
      parm,
      function (res) {
        var result = JSON.parse(res.data);
        console.log(result);
        switch (result.errorCode) {
          // 轮询
          case 0:
            that.state();
            break;
          //没有登录
          case 1001:
            wx.showModal({
              content: result.errorMsg,
              showCancel: false,
              confirmText: '知道了',
              success: function (res) {
                if (res.confirm) {
                  wx.removeStorageSync('openId');
                  wx.removeStorageSync('isLogin');
                  that.toIndex();
                }
              }
            });
            break;
          //没有实名认证
          case 1002:
            wx.showModal({
              content: result.errorMsg,
              showCancel: false,
              confirmText: '知道了',
              success: function (res) {
                if (res.confirm) {
                  that.toAuth();
                }
              }
            });
            break;
          //没有交纳押金
          case 1003:
            wx.showModal({
              content: result.errorMsg,
              showCancel: false,
              confirmText: '知道了',
              success: function (res) {
                if (res.confirm) {
                  that.toDepsit();
                }
              }
            });
            break;
          // 用车中
          case 1404:
            that.toUsing();
            break;
          // 还有没有完成的订单
          case 1405:
            that.state();
            break;
          // 其他状态
          default:
            wx.showModal({
              content: result.errorMsg,
              showCancel: false,
              confirmText: "知道了",
              success: function (res) {
                if (res.confirm) {
                  setTimeout(function () {
                    //that.unlock();
                    wx.redirectTo({
                      url: '../index/index',
                    })
                  }, 100);
                }
              }
            })
            break;
        }
      },
    )
  },
  // 获取简骑版车的解锁码
  unlockBikeBrief() {

    var that = this;
    var da = {
      "bikeNo": no,
      "method": 0,
      "longitude": app.globalData.longitude,
      "latitude": app.globalData.latitude,
    };
    request.unlockBikeBrief(
      da,
      (res) => {
        // abridge.alert({
        //   title: res.data.data, // alert 框的标题
        //   success: function (res) {

        //   },
        // });
        var resultData = JSON.parse(res.data);
        switch (resultData.errorCode) {
          // 轮询
          case 0:
            app.globalData.unlockCode = resultData.data.bike.unlockCode;
            that.toUsing();
            break;
          //登录过期
          case 1001:
            wx.showModal({
              content: resultData.errorMsg,
              showCancel: false,
              confirmText: '知道了',
              success: function (res) {
                wx.removeStorageSync('openId');
                wx.removeStorageSync('isLogin');
                if (res.confirm) {
                  that.toIndex();
                }
              }
            });
            break;
          // 没有实名认证（需要获取认证状态）
          case 1002:
            wx.showModal({
              content: resultData.errorMsg,
              showCancel: false,
              confirmText: '知道了',
              success: function (res) {
                if (res.confirm) {
                  that.toAuth();
                }
              }
            });
            break;
          //没有交纳押金
          case 1003:
            wx.showModal({
              content: resultData.errorMsg,
              showCancel: false,
              confirmText: '知道了',
              success: function (res) {
                if (res.confirm) {
                  that.toDepsit();
                }
              }
            });
            break;
          // 用车中
          case 1404:
            that.toUsing();
            break;
          // 待支付
          case 1405:
            setTimeout(function () {
              wx.redirectTo({
                url: '../cost/cost?id=' + resultData.data.orderId,
              });
            }, 100);
            break;
          // 其他状态
          default:
         
            wx.showModal({
              content: resultData.errorMsg,
              confirmText: "知道了",
              showCancel: false,
              success: function (res) {
                wx.redirectTo({
                  url: '../index/index',
                })
              },
            });
            break;
        }
      },
    )
  },
  // 解锁轮询
  state(beforeUnlocking) {
    var that = this;
    var da = {};
    request.state(
      da,
      (res) => {
        var resultData = JSON.parse(res.data);
        setTimeout(function () {
          if (resultData.errorCode == 0) {
            // 0 闲置 1 已经预约在寻车中 2解锁中 3骑行中 4落锁中 5临时停车中 6已结束用车但还没有支付	
            switch (resultData.data.type) {
              case 0:
              case 1:
                if (beforeUnlocking) {
                  var matchRet = false;
                  var tempMatchRet = false;
                  var aryObj = result.split('?');
                  if (aryObj[0]) {
                    tempMatchRet = ((aryObj[0].search('https://www.bluegogo.com') >= 0) || (aryObj[0].search('http://www.bluegogo.com') >= 0))

                    if (tempMatchRet && aryObj[1]) {
                      var params = aryObj[1].split('&')
                      for (var i = 0; i < params.length; i++) {
                        if (params[i]) {
                          var param = params[i].split('=')
                          if (param[0]) {
                            matchRet = ((param[0] == 'no') && param[1])
                            if (matchRet) {
                              no = param[1]
                              break
                            }
                          }
                        }
                      }
                    }
                  }
                  if (!matchRet) {
                    wx.showModal({
                      content: '请扫描小蓝单车二维码', // confirm 框的标题
                      confirmText: '重试',
                      success: function (res) {
                        if (res.confirm) {
                          app.globalData.isScan = true;
                          setTimeout(function () {
                            wx.navigateBack({
                              delta: 1
                            })
                          }, 100);
                        } else {
                          setTimeout(function () {
                            wx.navigateBack({
                              delta: 1
                            })
                          }, 100);
                        }
                      },
                    });
                    return;
                  }

                  if ((Number(no.slice(3)) <= 499999) && (Number(no.slice(3)) > 0)) {
                    that.unlock();
                  } else if ((Number(no.slice(3)) > 499999) && (Number(no.slice(3)) <= 989999)) {
                    that.unlockBikeBrief();
                  } else {
                    wx.showToast({
                      content: '车号不存在', // 文字内容
                      success: function (res) {

                      },
                    });
                  }
                }
                else {
                  
                  wx.showModal({
                    content: "解锁失败，请重试",
                    showCancel:false,
                    confirmText: "知道了",
                    success: function (res) {
                      if (res.confirm) {
                        wx.redirectTo({
                          url: '../index/index',
                        })
                        
                      }
                    }

                  });
                }
                break;
              // 解锁中状态
              case 2:
                setTimeout(function () {
                  that.state(false);
                }, 5000);
                break;
              // 用车中
              case 3:
                if (beforeUnlocking) {

                  wx.showModal({
                    content: '您有正在使用的单车', // alert 框的标题
                    confirmText: "知道了",
                    success: function (res) {
                      wx.redirectTo({
                        url: '../using/using', // 需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数。参数与路径之间使用
                      });
                    }
                  });

                }
                else {
                  that.toUsing();
                }
                break;
              // 结束用车但还没有支付	
              case 6:
                wx.showModal({
                  content: '您有未支付的订单，请支付后再用车',
                  confirmText: '立即支付',
                  success: function (res) {
                    if (res.confirm) {
                      wx.redirectTo({
                        url: '../cost/cost?id=' + resultData.data.info.orderId,
                      })
                    } else if (res.cancel) {
                      wx.redirectTo({
                        url: '../index/index',
                      })
                      
                    }
                  }
                })
                break;
              default:
                wx.showModal({
                  content: res.data.errorMsg,
                  confirmText: "知道了",
                  success: function (res) {
                    wx.redirectTo({
                      url: '../index/index',
                    })
                  },
                });
                break;
            }
          } else if (resultData.errorCode == 1001) {
            wx.removeStorageSync('openId');
            wx.removeStorageSync('isLogin');
            wx.redirectTo({
              url: '../index/index',
            })
          } else if (resultData.errorCode == 1012) {
            wx.showModal({
              content: resultData.errorMsg + "，请返回首页联系客服",
              showCancel: false,
              confirmText: '知道了',
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../index/index',
                  })
                }
              }
            })
          }
          else {
            wx.showModal({
              content: resultData.errorMsg,
              showCancel: false,
              confirmText: '知道了',
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../index/index',
                  })
                }
              }
            })
          }
        }, 100);
      },
    )
  },
  // 进入用车页
  toUsing() {
    wx.redirectTo({
      url: '../using/using',
    });
  },
  //进入押金页面
  toDepsit() {
    wx.redirectTo({
      url: '../deposit/deposit',
    });
  },
  //进入实名认证页面
  toAuth() {
    wx.redirectTo({
      url: '../realname/realname',
    });
  },
  //没有登录
  toIndex(){
    wx.redirectTo({
      url: '../index/index',
    });
  },

  progress: function () {
    var that = this;
    if (that.data.progress < 100) {
      that.setData({
        'progress': that.data.progress + 1
      })
      setTimeout(function () {
        that.progress();
      }, 450);
    } else if (that.data.progress == 15) {
      that.toUsing();
    }
  },
});
