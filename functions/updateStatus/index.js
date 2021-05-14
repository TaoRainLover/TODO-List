// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})


// 云函数入口函数
exports.main = async (event, context) => {
  let db = cloud.database()
  const _ = db.command
  let bol = event.status
  bol = !bol

  if (event.type == 'todo') {
    db.collection('Todo')
      .doc(event.id)
      .update({
        data: {
          status: bol
        }
      })
    return true;
  } else if (event.type == 'reminder') {
    db.collection('Reminder')
      .doc(event.id)
      .update({
        data: {
          status: bol
        }
      })
    return true;
  } else if (event.type == 'flag') {
    db.collection('Flag')
      .doc(event.id)
      .update({
        data: {
          status: bol
        }
      })
    return true;
  } else {
    db.collection('Events')
      .doc(event.id)
      .update({
        data: {
          status: bol
        }
      })
    return true;
  }
}