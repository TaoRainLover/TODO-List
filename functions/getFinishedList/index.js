// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let db = cloud.database()
  const _ = db.command

  if (event.type == 'todo') {
    let res = await db.collection('Todo')
      .where({
        _openid: event.userInfo.openId,
        status: true,
        isDelete: false
      })
      .orderBy('time', 'desc')
      .get();
    return res;
  } else if (event.type == 'reminder') {
    let res = await db.collection('Reminder')
      .where({
        _openid: event.userInfo.openId,
        status: true,
        isDelete: false
      })
      .orderBy('time', 'desc')
      .get();
    return res;
  } else if (event.type == 'event') {
    let res = await db.collection('Events')
      .where({
        _openid: event.userInfo.openId,
        belongto: event.className,
        status: true,
        isDelete: false
      })
      .orderBy('time', 'desc')
      .get();
    return res;
  } else {
    return false;
  }
}