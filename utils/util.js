//格式化日期
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//toast
function showToast(toast){
  wx.showToast({
    title: toast.title,
    icon: toast.icon,
    duration: toast.duration || 1500,
    mask: toast.mask || false,
    success: function (res) { 
      toast.fnsucc && toast.fnsucc(res);
    },
    fail: function (res) {
      toast.fnsucc && toast.fnsucc(res);
     },
    complete: function (res) { 
      toast.fnsucc && toast.fnsucc(res);
    },
  })
}

module.exports = {
  formatTime: formatTime,
  showToast: showToast
}

