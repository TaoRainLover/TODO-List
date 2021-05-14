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


  db.collection('DetailsOfAllLists')
    .where({
      _openid: event.userInfo.openId,
      "classList.listName": event.className
    })
    .update({
      data: {
        "classList.$.numItems": _.inc(1)
      }
    })

  if (event.className == '想法') {
    db.collection('Idea')
      .add({
        data: {
          _openid: event.userInfo.openId,
          content: event.content,
          isDelete: false,
          time: time,
          title: event.title
        }
      })
    return true;
  } else {
    db.collection('Passages')
      .add({
        data: {
          _openid: event.userInfo.openId,
          belongto: event.className,
          content: event.content,
          isDelete: false,
          time: time,
          title: event.title
        }
      })
    return true;
  }
}