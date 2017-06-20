// 获取应用实例
var request = require('../../api/request.js');
const app = getApp();
var id;
Page({
  data: {
    'type': 'free',
    'error': '',
    'cost': 0,
    'kcal': 0,
    'time': 0,
    'carbon': 0,
    'list': {
      'calorie': 0,
      'carbon': 0,
      'actualPrice': 0,
      'privilegeOrder': 0
    }
  },
  onLoad(options) {
    id = options.id;
  },
  onShow() {
    var that = this;
    var da = {
      'isForce': 0,
      'orderId': id,
    };
    request.orderDetail(
      da,
      (res) => {
        var result = JSON.parse(res.data);
        var time = (Math.floor((result.data.order.useTime) / 60))+1
        
        var calorie = result.data.order.calorie;
        if (calorie < 1000){
           calorie = Math.round(calorie);
        }else{
          calorie = Math.round(calorie/1000);
        }
        //calorie < 1000 ? Math.random(calorie) : Math.random(calorie/1000);
        that.setData({
          list: result.data.order,
          time: time,
          "calorie": calorie
        })
        var calorie = that.data.list.calorie;
      },
    )
  }
});
