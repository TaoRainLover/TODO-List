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

  const MAX_LIMIT = 100
  // 先取出集合记录总数
  const countResult = await db.collection('Todo')
    .where({
      _openid: event.userInfo.openId,
      time: _.gte(startTime).and(_.lte(endTime)),
      isDelete: false
    })
    .count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  if (total != 0) {
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('Todo').skip(i * MAX_LIMIT).limit(MAX_LIMIT)
        .where({
          _openid: event.userInfo.openId,
          time: _.gte(startTime).and(_.lte(endTime)),
          isDelete: false
        })
        .orderBy('time', 'asc')
        .get()
      tasks.push(promise)
    }
    // 等待所有
    return (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    })
  } else {
    return {
      data: []
    }
  }
}