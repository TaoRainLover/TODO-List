// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let db = cloud.database()
  const _ = db.command

  if (event.className == "想法") {
    db.collection('Idea')
      .doc(event.id)
      .update({
        data: {
          title: event.title,
          content: event.content
        }
      })
    return true;
  } else {
    db.collection('Passages')
      .doc(event.id)
      .update({
        data: {
          title: event.title,
          content: event.content
        }
      })
    return true;
  }
}