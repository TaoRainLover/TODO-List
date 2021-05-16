// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let db = cloud.database()
  const _ = db.command

  let now = new Date()
  var yy = now.getFullYear(); //获取time1中的年份
  var mm = now.getMonth() + 1; //获取月份，getMonth()得到的是0~11
  var dd = now.getDate(); //获取日期
  let startTime = yy + "-" + mm + "-" + dd + " " + "00:00:00" //当天起始时间
  let endTime = yy + "-" + mm + "-" + dd + " " + "23:59:59" //当天终止时间
  startTime = new Date(startTime)
  endTime = new Date(endTime)

  //数据库查询操作
  let res0 = await db.collection('Todo')
    .where({
      _openid: event.userInfo.openId,
      time: _.gte(startTime).and(_.lte(endTime)),
      isDelete: false
    })
    .count();
  let res1 = await db.collection('Todo')
    .where({
      _openid: event.userInfo.openId,
      time: _.gte(startTime).and(_.lte(endTime)),
      status: true,
      isDelete: false
    })
    .count();

  return {
    total: res0,
    finished: res1,
  };
}