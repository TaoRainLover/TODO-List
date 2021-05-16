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
    .count();
  let todo1 = await db.collection('Todo')
    .where({
      _openid: _.eq(event.userInfo.openId),
      status: true
    }).count();

  let flag0 = await db.collection('Flag')
    .where({
      _openid: _.eq(event.userInfo.openId)
    })
    .count();
  let flag1 = await db.collection('Flag')
    .where({
      _openid: _.eq(event.userInfo.openId),
      status: true
    }).count();

  let reminder0 = await db.collection('Reminder')
    .where({
      _openid: _.eq(event.userInfo.openId)
    })
    .count();
  let reminder1 = await db.collection('Reminder')
    .where({
      _openid: _.eq(event.userInfo.openId),
      status: true
    }).count();

  let events0 = await db.collection('Events')
    .where({
      _openid: _.eq(event.userInfo.openId)
    })
    .count();
  let events1 = await db.collection('Events')
    .where({
      _openid: _.eq(event.userInfo.openId),
      status: true
    })
    .count();

  return [{
    todo: todo0,
    flag: flag0,
    reminder: reminder0,
    customEve: events0,

  }, {
    todo: todo1,
    flag: flag1,
    reminder: reminder1,
    customEve: events1,
  },];
}