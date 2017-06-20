//const app = getApp();
var api = require('./api.js');
/**
 * 网络请求方法
 * @param url {string} 请求url
 * @param method {string} 参数 "POST" 默认 "GET"
 * @param data {object} 参数
 * @param successCallback {function} 成功回调函数
 * @param errorCallback {function} 失败回调函数
 * @param completeCallback {function} 完成回调函数
 * @returns {void}
 */

function requestData(url, method, data0, successCallback, errorCallback) {
//测试身份正好 130826199103252815
  var openId =  wx.getStorageSync('openId');
  wx.request({
    url: url, //仅为示例，并非真实的接口地址wxTiny
    method:method,
    dataType:"text/plain",
    data: {
      'data': JSON.stringify({
        'clientInfo': '14100,wxTiny,2,0',
        //'clientInfo': '10000,alipay,2,a',
        'version': '1',
        'openId': openId,
        // 'openId':'ofrsI0TiFXmc-nfvY-tWsh0k0_no',
        'data': data0
      })
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
      //'content-type': 'text/plain'
      
    },
    success: function (res) {
      successCallback && successCallback(res);
     
    },
    error:function(res){
      errorCallback && errorCallback(res);
    }
  });
  
}
//调用gainOpenId

function gainOpenId(data0, successCallback, errorCallback) {
  requestData(api.gainOpenId(), "POST", data0, successCallback, errorCallback);
}

// 获取订单详情
function orderDetail(data0, successCallback, errorCallback) {
  requestData(api.orderDetail(), "POST", data0, successCallback, errorCallback);
}

//查看手机号码
function checkMobile(data0, successCallback, errorCallback) {
  requestData(api.checkMobile(),"POST", data0, successCallback, errorCallback);
}


//发送验证码
function sendVerifyCode(data0, successCallback, errorCallback) {
  requestData(api.sendVerifyCode(),"POST", data0, successCallback, errorCallback);
}

// 支付
function pay(data0, successCallback, errorCallback) {
  requestData(api.pay(), "POST", data0, successCallback, errorCallback);
}
// 支付押金
function deposit(data0, successCallback, errorCallback) {
  requestData(api.deposit(), "POST", data0, successCallback, errorCallback);
}
//登录
function login(data0, successCallback, errorCallback) {
  requestData(api.login(), "POST", data0, successCallback, errorCallback);
}
//获取用户信息
function userInfo(data0, successCallback, errorCallback) {
  requestData(api.getUserInfo(), "POST", data0, successCallback, errorCallback);
}
//智能解锁
function unlockBike(data0, successCallback, errorCallback) {
  requestData(api.unlockBike(), "POST", data0, successCallback, errorCallback);
}
// 启动状态刷新
function state(data0, successCallback, errorCallback) {
  requestData(api.state(), "POST", data0, successCallback, errorCallback);
}

// 优惠券列表
function voucherList(data0, successCallback, errorCallback) {
  requestData(api.voucherList(), "POST", data0, successCallback, errorCallback);
}

// 获取认证状态
function authStatus(data0, successCallback, errorCallback) {
  requestData(api.authStatus(),"POST", data0, successCallback, errorCallback);
}
// 认证姓名及身份证号码
function auth(data0, successCallback, errorCallback) {
  requestData(api.auth(), "POST", data0, successCallback, errorCallback);
}


// 扫码／输入车号解锁
function unlock(data0, successCallback, errorCallback) {
  requestData(api.unlock(), "POST", data0, successCallback, errorCallback);
}
// 获取简骑版车的解锁码
function unlockBikeBrief(data0, successCallback, errorCallback) {
  requestData(api.unlockBikeBrief(), "POST", data0, successCallback, errorCallback);
}
// 简骑版结束用车
function lockBikeBrief(data0, successCallback, errorCallback) {
  requestData(api.lockBikeBrief(), "POST", data0, successCallback, errorCallback);
}
// 芝麻信用免押金
function zmxyDeposit(data0, successCallback, errorCallback) {
  requestData(api.zmxyDeposit(), "POST", data0, successCallback, errorCallback);
}

 module.exports = {
   'gainOpenId':gainOpenId,
   'state': state,
   'unlockBike': unlockBike,
   'userInfo': userInfo,
   'login': login,
   'pay': pay,
   'sendVerifyCode': sendVerifyCode,
   'checkMobile': checkMobile,

   'voucherList': voucherList,
   'orderDetail': orderDetail,
   'authStatus': authStatus,
   'auth': auth,
   'deposit': deposit,
   'unlock': unlock,
   'unlockBikeBrief': unlockBikeBrief,
   'lockBikeBrief': lockBikeBrief,
   'zmxyDeposit': zmxyDeposit
 };
