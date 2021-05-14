// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let db = cloud.database()
  const _ = db.command
  const $ = _.aggregate

  let now = new Date()
  var yy = now.getFullYear(); //获取time1中的年份
  var mm = now.getMonth() + 1; //获取月份，getMonth()得到的是0~11
  var dd = now.getDate(); //获取日期
  let startTime = yy + "-" + mm + "-" + dd + " " + "00:00:00" //当天起始时间
  startTime = new Date(startTime)

  let res = db.collection('Todo')
    .aggregate()
    .match({
      _openid: event.userInfo.openId,
      time: _.lt(startTime),
      isDelete: false
    })
    .sort({
      time: 1
    })
    .group({
      _id: '$time',
      list: $.push({
        _id: '$_id',
        _openid: '$_openid',
        content: '$content',
        isDelete: '$isDelete',
        status: '$status'
      })
    })
    .end();

  return res;
}