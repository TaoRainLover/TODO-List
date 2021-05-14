// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let db = cloud.database()
  const _ = db.command
  db.collection('DetailsOfAllLists')
    .where({
      _openid: event.userInfo.openId,
      "classList.listName": event.className
    })
    .update({
      data: {
        "classList.$.numItems": _.inc(-1)
      }
    })
  if (event.type == "todo") {
    db.collection('Todo')
      .doc(event.id)
      .update({
        data: {
          isDelete: true
        }
      })
    return true;
  } else if (event.type == "reminder") {
    db.collection('Reminder')
      .doc(event.id)
      .update({
        data: {
          isDelete: true
        }
      })
    return true;
  } else if (event.type == "idea") {
    db.collection('Idea')
      .doc(event.id)
      .update({
        data: {
          isDelete: true
        }
      })
    return true;
  } else if (event.type == "flag") {
    db.collection('Flag')
      .doc(event.id)
      .update({
        data: {
          isDelete: true
        }
      })
    return true;
  } else if (event.type == "event") {
    db.collection('Events')
      .doc(event.id)
      .update({
        data: {
          isDelete: true
        }
      })
    return true;
  } else if (event.type == "pass") {
    db.collection('Passages')
      .doc(event.id)
      .update({
        data: {
          isDelete: true
        }
      })
    return true;
  } else {
    return false;
  }
}