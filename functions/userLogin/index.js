// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let time = new Date(Date.now() + (8 * 60 * 60 * 1000))
  let db = cloud.database()
  const _ = db.command
  let accessToken = await db.collection('User')
    .where({
      _openid: _.eq(event.userInfo.openId)
    })
    .get();
  if (accessToken.data.length == 0) {
    db.collection('User')
      .add({
        data: {
          _openid: event.userInfo.openId,
          registerDate: time
        }
      })
    db.collection('DetailsOfAllLists')
      .add({
        data: {
          _openid: event.userInfo.openId,
          classList: [{
            listColor: "rgba(0,111,255,1)",
            listName: "待办",
            listType: "todo",
            numItems: 0
          }, {
            listColor: "rgba(141, 10, 255, 1)",
            listName: "提醒",
            listType: "reminder",
            numItems: 0
          }, {
            listColor: "rgba(255, 173, 10, 1)",
            listName: "想法",
            listType: "idea",
            numItems: 0
          }, {
            listColor: "rgba(255, 80, 80, 1)",
            listName: "Flag",
            listType: "flag",
            numItems: 0
          }]
        }
      })
    return "Xx";
  } else if (accessToken.data[0]._openid != null) {
    return true;
  } else {
    return false;
  }
}