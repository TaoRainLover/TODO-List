// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let db = cloud.database()
  const _ = db.command

  if (event.type == 'idea') {
    let res = await db.collection('Idea')
      .where({
        _openid: event.userInfo.openId,
        isDelete: false
      })
      .orderBy('time', 'desc')
      .get();
    return res;
  } else if (event.type == 'pass') {
    let res = await db.collection('Passages')
      .where({
        _openid: event.userInfo.openId,
        belongto: event.className,
        isDelete: false,
      })
      .orderBy('time', 'desc')
      .get();
    return res;
  } else {
    return false;
  }
}