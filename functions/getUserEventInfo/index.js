// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let db = cloud.database()
  const _ = db.command

  let todo0 = await db.collection('Todo')
    .where({
      _openid: _.eq(event.userInfo.openId)
    })
    .get();
  let todo1 = await db.collection('Todo')
    .where({
      _openid: _.eq(event.userInfo.openId),
      status: true
    }).get();

  let flag0 = await db.collection('Flag')
    .where({
      _openid: _.eq(event.userInfo.openId)
    })
    .get();
  let flag1 = await db.collection('Flag')
    .where({
      _openid: _.eq(event.userInfo.openId),
      status: true
    }).get();

  let reminder0 = await db.collection('Reminder')
    .where({
      _openid: _.eq(event.userInfo.openId)
    })
    .get();
  let reminder1 = await db.collection('Reminder')
    .where({
      _openid: _.eq(event.userInfo.openId),
      status: true
    }).get();

  let events0 = await db.collection('Events')
    .where({
      _openid: _.eq(event.userInfo.openId)
    })
    .get();
  let events1 = await db.collection('Events')
    .where({
      _openid: _.eq(event.userInfo.openId),
      status: true
    })
    .get();

  return [{
    todo: todo0.data.length,
    flag: flag0.data.length,
    reminder: reminder0.data.length,
    customEve: events0.data.length,

  }, {
    todo: todo1.data.length,
    flag: flag1.data.length,
    reminder: reminder1.data.length,
    customEve: events1.data.length
  },];
}