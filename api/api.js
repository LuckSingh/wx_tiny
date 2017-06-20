// 主地址
const api = 'https://wxtiny.bluegogo.com/bluegogo_backend_http/h5/';
//const api = 'https://api.bluegogo.com/bluegogo_backend_http/h5/';

// 获取订单详情
const gainOpenIdUrl = 'account/gainOpenId';
function gainOpenId() {
  return api + gainOpenIdUrl;
};
// 获取订单详情
const orderDetailUrl = 'account/orderDetail';
function orderDetail() {
  return api + orderDetailUrl;
};
//查看手机号是否注册
const checkMobileUrl = 'account/checkMobile';
function checkMobile() {
  return api + checkMobileUrl;
};

//发送验证码
const sendVerifyCodeUrl= 'account/sendVerifyCode';
function sendVerifyCode() {
  return api + sendVerifyCodeUrl;
};
// 支付
const payUrl = 'order/pay';
function pay() {
  return api + payUrl;
};
// 支付押金
const depositUrl = 'account/deposit';
function deposit() {
  return api + depositUrl;
};

//登录
const loginUrl = 'account/login';
function login() {
  return api + loginUrl;
}

//获取用户信息
const userInfoUrl = 'account/userInfo';
function getUserInfo() {
  return api + userInfoUrl;
}
//智能解锁
const unlockUrl = 'useBike/unlock';
function unlockBike(){
  return api + unlockUrl;
}
// 启动状态刷新
const stateUrl = 'useBike/state';
function state() {
  return api + stateUrl;
};

// 优惠券列表
const v3 = 'account/voucherList';
function voucherList() {
  return api + v3;
};

// 获取认证状态
const v5 = 'account/authStatus';
function authStatus() {
  return api + v5;
};
// 认证姓名及身份证号码
const v6 = 'account/auth';
function auth() {
  return api + v6;
};


// 扫码／输入车号解锁
const v9 = 'useBike/unlock';
function unlock() {
  return api + v9;
};
// 获取简骑版车的解锁码
const v10 = 'useBike/unlockBikeBrief';
function unlockBikeBrief() {
  return api + v10;
};
// 简骑版结束用车
const v11 = 'useBike/lockBikeBrief';
function lockBikeBrief() {
  return api + v11;
};
// 芝麻信用免押金
const v12 = 'h5/alipay/zmxyDeposit';
function zmxyDeposit() {
  return api + v12;
};

module.exports = {
  'gainOpenId': gainOpenId,
   'state': state,
   'unlockBike': unlockBike,
   'getUserInfo': getUserInfo,
   'login': login,
   'sendVerifyCode': sendVerifyCode,
   'checkMobile': checkMobile,

   'voucherList': voucherList,
   'orderDetail': orderDetail,
   'authStatus': authStatus,
   'auth': auth,
   'pay': pay,
   'deposit': deposit,
   'unlock': unlock,
   'unlockBikeBrief': unlockBikeBrief,
   'lockBikeBrief': lockBikeBrief,
   'zmxyDeposit': zmxyDeposit
 };