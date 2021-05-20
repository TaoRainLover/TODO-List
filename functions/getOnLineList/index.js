// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let db = cloud.database()
  const _ = db.command
  const MAX_LIMIT = 100

  if (event.type == 'reminder') {
    // 先取出集合记录总数
    const countResult = await db.collection('Reminder')
      .where({
        _openid: event.userInfo.openId,
        status: false,
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
        const promise = db.collection('Reminder').skip(i * MAX_LIMIT).limit(MAX_LIMIT)
          .where({
            _openid: event.userInfo.openId,
            status: false,
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
  } else if (event.type == 'event') {
    // 先取出集合记录总数
    const countResult = await db.collection('Events')
      .where({
        _openid: event.userInfo.openId,
        belongto: event.className,
        status: false,
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
        const promise = db.collection('Events').skip(i * MAX_LIMIT).limit(MAX_LIMIT)
          .where({
            _openid: event.userInfo.openId,
            belongto: event.className,
            status: false,
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
  } else {
    return false;
  }
}