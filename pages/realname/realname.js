var request = require('../../api/request.js');
const app = getApp();
var name, idNo, auth;
Page({
  data: {
    realname: '',//认证姓名
    idno: '',//身份证号
    real_dis: true,//显示认证按钮状态
    vcode_error_dis: true,//不显示错误信息
    error_detail: '请输入正确的身份证号'//错误信息的文字

  },
 
  //姓名
  name: function (e) {
    var that = this;
    that.setData({
      vcode_error_dis: true
    });
    name = e.detail.value;
    that.setData({
      vcode_error_dis: true
    });
    this.checkInput();

  },
  //身份证号
  idNo: function (e) {
    var that = this;
    idNo = e.detail.value;
    this.checkInput();
  },
  // 检测姓名和身份证格式
  checkInput: function () {
    if (name != '' && (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(idNo)) {
      this.setData({
        real_dis: false
      })
    } else {
      this.setData({
        real_dis: true
      })
    }
  },
  // 认证姓名及身份证号码
  auth: function (e) {
    var that = this;
    if (this.data.real_dis == false) {
      var parm = {
        'name': encodeURI(name),
        'idNo': idNo
      };
      request.auth(
        parm,
        function (res) {
          var result = JSON.parse(res.data); 
         
          if (result.errorCode == 0) {
            var voucher = {
              "amount": result.data.amount,
              "voucherId": result.data.voucherId,
              "validDate": result.data.validDate,
              "title": result.data.title,
              "invalidDate": result.data.invalidDate,
              "desc": result.data.desc
            }
            //实名认证通过
            app.globalData.voucher = voucher;
            that.toComplate();
          } else {
            //没有通过实名认证
            wx.showModal({
              content: result.errorMsg,
              confirmText: '知道了',
              showCancel:false,
              success: function (res) {
                if (res.confirm) {
                  //点击知道了
                  // wx.navigateBack({
                  //   delta: 99
                  // });
                  that.setData({
                    realname: '',//认证姓名
                    idno: '',//身份证号
                  })
                }
              }
            });
          }
        })
    } else {
      that.setData({
        vcode_error_dis:false,
        error_detail:"姓名或者身份证填写不正确"
      })
      // wx.showModal({
      //   content: '姓名或者身份证填写不正确',
      // })
    }


    // app.globalData.isLogin = true;
    // app.globalData.isDeposit = true;
    // app.globalData.isRealName = true;
    // wx.navigateTo({
    //   url: '../index/index',
    // })

  },
  toComplate(){
    //type =2
    wx.redirectTo({
      url: '../complate/complate?type=2',
    })
  },
  abroad:function(){
    wx.showModal({
      content: '港澳台及海外用户请下载小蓝单车APP，登录后即可认证',
      showCancel:false,
      confirmText:'知道了'
    })
  },
  onLoad: function (options) {
    auth = options.auth;
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  }
})