// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let db = cloud.database()
  const _ = db.command

  let accessToken = await db.collection('User')
    .where({
      _openid: _.eq(event.userInfo.openId)
    })
    .get();
  let registerTime = accessToken.data[0].registerDate;
  registerTime = Date.parse(registerTime)
  let now = new Date()
  now = Date.parse(now)
  daysOfRegister = parseInt((now - registerTime) / (24 * 60 * 60 * 1000))
  return daysOfRegister;
}