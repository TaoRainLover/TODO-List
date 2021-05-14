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
      _openid: event.userInfo.openId
    })
    .update({
      data: {
        "classList": _.pull({
          listName: _.eq(event.className),
          listType: _.eq(event.type)
        })
      }
    })

  if (event.type == "event") {
    db.collection('Events')
      .where({
        _openid: event.userInfo.openId,
        belongto: event.className
      })
      .remove()
    return true;
  } else if (event.type == "pass") {
    db.collection('Passages')
      .where({
        _openid: event.userInfo.openId,
        belongto: event.className
      })
      .remove()
    return true;
  } else {
    return false;
  }
}