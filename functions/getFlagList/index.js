// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let db = cloud.database()
  const _ = db.command

  let res = await db.collection('Flag')
    .where({
      _openid: event.userInfo.openId,
      isDelete: false
    })
    .orderBy('time', 'desc')
    .get();
  return res;
}