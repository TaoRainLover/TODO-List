// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let db = cloud.database()
  const _ = db.command

  if (event.className == 'Todo') {
    db.collection('Todo')
      .doc(event.id)
      .update({
        data: {
          content: event.content
        }
      })
    return true;
  } else if (event.className == 'Reminder') {
    db.collection('Reminder')
      .doc(event.id)
      .update({
        data: {
          content: event.content
        }
      })
    return true;
  } else if (event.className == 'Flag') {
    db.collection('Flag')
      .doc(event.id)
      .update({
        data: {
          content: event.content
        }
      })
    return true;
  } else {
    db.collection('Events')
      .doc(event.id)
      .update({
        data: {
          content: event.content
        }
      })
    return true;
  }
}