var md5 = require('../../utils/md5-min.js');
var request = require('../../api/request.js');
var wait = 60;
var vcode = '1';
var pass = false;
var vcodePass = false;
var registered, openId, mobile, deviceId, depositStatus, verifyCode;
const app = getApp();
Page({
  data: {
    vcode: '发送验证码',
    phoneNum: '',
    login_dis: true,
    vcode_error_dis: true,
    error_detail: '',
    isCountdown: false
  },
  onLoad(options) {
    // 获取位置信息
    openId = options.id;
    app.globalData.openId = openId;
    app.getCityCode();
  },
  // 手机号检测
  // checkPhone: function (e) {
  //   this.setData({
  //     mobile: e.detail.value
  //   })

  // },
  // 一键删除手机号
  del: function () {
    this.setData({
      phoneNum: '',
    });
  },
  // 获取验证码

  vcode: function () {
    if (this.data.isCountdown) {
      return;
    } else {
      var that = this;
      mobile = that.data.phoneNum;
      var phone = /^1[34578]\d{9}$/;
      if (phone.test(mobile)) {
        pass = true;
      } else {
        pass = false;
      }
      if (pass) {
        deviceId = (Math.random() * 10000).toFixed(0);
        var parm = {
          'mobile': mobile,
          'deviceId': deviceId,
          'flag': 3
        };
        request.sendVerifyCode(
          parm,
          function (res) {
            console.log(res);
            var code = JSON.parse(res.data);
          },
          function (res) {
            wx.showModal({
              content: res,
             
            })
          },
        )
        if (wait == 60) {
          that.countdown();
        }
      } else {
        wx.showToast({
          title: '手机号错误',// 文字内容
          //icon: 'success',
          //duration: 2000
          image:'../../images/error.png'
        });
        this.setData({
          phoneNum: '',
        });
      }
    }


  },
  // 验证码检测
  vcodeInput: function (e) {
    var that = this;
    var code = e.detail.value;
    console.log(code.length);
    if (code.length == 4) {
      verifyCode = md5.hex_md5(e.detail.value)
      //verifyCode = e.detail.value;
      vcodePass = true;
      that.setData({
        login_dis: false,
        vcode_error_dis: true
      })
    } else {
      vcodePass = false;

      this.setData({
        login_dis: true,
        vcode_error_dis: false
      });
    }
  },
  // 
  phoneInput: function (e) {
    var num;
    var that = this;
    var phone_len = e.detail.value.length;

    if (phone_len <= 11) {
      num = e.detail.value;
      that.setData({
        phoneNum: e.detail.value,
      });
    } else if (phone_len > 11) {
      num = e.detail.value;

      that.setData({
        phoneNum: num,
      });
    }
  },
  // 登录
  login: function () {
    if (pass) {
      if (vcodePass) {
        var da = {
          'mobile': mobile,
          'deviceId': deviceId,
          'verifyCode': verifyCode,
          'loginType': 1,
          'city': app.globalData.cityCode,
          'longitude': app.globalData.longitude,
          'latitude': app.globalData.latitude,
        };
        request.login(
          da,
          (res) => {
            var code = JSON.parse(res.data);
            console.log(code);

            if (code.errorCode == 0) {
              //app.globalData.openId = code.data.token;
              //wx.setStorageSync('openId', code.data.token);
              // wx.setStorage({
              //   key: 'userInfo2',
              //   data: code.data,
              // });
              //app.globalData.openId = code.data.openId;
              // wx.setStorage({
              //   key: 'openId',
              //   data: code.data.openId,
              // });
             // wx.setStorageSync('userInfo', code.data);
             // wx.setStorageSync('openId', openId);

             //存一个变量 是否登录
             wx.setStorageSync('isLogin', true);  
               
             //app.globalData.isLogin = true;

              if (code.data.depositStatus == 1) {
                // 1已交押金
                if (code.data.authStatus == 1) {
                  //已交押金且实名认证
                  setTimeout(function () {
                    if (code.data.firstAuth == 1) {
                      app.globalData.voucher = code.data.voucher;
                      wx.redirectTo({
                        url: '../pay/pay',
                      });
                    } else {
                      wx.navigateBack({
                        delta: 99
                      })
                    }
                  }, 100);

                } else {
                  //未实名认证
                  wx.redirectTo({
                    url: '../realname/realname',
                  });
                }
              }
              else {
                // 0未交押金  
                wx.redirectTo({
                  url: '../deposit/deposit',
                });
              }
            } else {
              this.setData({
                error_detail: code.errorMsg,
                vcode_error_dis: false,
              })
            }
          },
        )
        //app.globalData.isLogin = true;
      } else {
        this.setData({
          // error_detail:'验证码已过期',
          error_detail: '请输入正确的验证码',
          vcode_error_dis: false,
        })
      }
    }
  },
  countdown: function () {
    var that = this;
    if (wait == 0) {
      this.setData({
        vcode: '发送验证码',
        isCountdown: false,
      })
      wait = 60;
    } else {
      this.setData({
        vcode: wait + 's',
        isCountdown: true,
      })
      wait--;
      setTimeout(function () {
        that.countdown();
      }, 1000);
    }
  }
});