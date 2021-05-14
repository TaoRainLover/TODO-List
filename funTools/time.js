// 服务器时间转换为本地时间
function serveDateToLocalDate (serveD){
  let dateDue = Date.parse(serveD);
  var newDate = new Date(dateDue-28800000);  
  var localD = newDate.toLocaleDateString();
  return localD;
}

function setCountdown(interval, count, fun) {
  //因为interval函数中的this域不一样了，需要把页面的this提取出来
  // var _this = this;  
  var countDown = count;
  interval = setInterval(function () {
    countDown--;
    if (countDown <= 0) {
      // 当倒计时处于负数时，我们就停止倒计时函数
      clearInterval(interval);
      // 执行回调函数
      fun();
    }
  }, 1000)
}
// 暴露函数
module.exports = {
	serveDateToLocalDate: serveDateToLocalDate,
	setCountdown: setCountdown
}
