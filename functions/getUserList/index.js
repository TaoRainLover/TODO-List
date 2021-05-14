// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let db = cloud.database()
  const _ = db.command
  let accessToken = await db.collection('DetailsOfAllLists')
    .where({
      _openid: _.eq(event.userInfo.openId),
    })
    .get();
  accessToken = accessToken.data[0].classList
  return accessToken;
}