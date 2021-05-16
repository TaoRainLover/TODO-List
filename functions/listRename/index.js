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
      _openid: event.userInfo.openId,
    })
    .get();
  accessToken = accessToken.data[0].classList
  let flag = false;
  for (let i = 0; i < accessToken.length; i++) {
    if (event.listName == accessToken[i].listName) {
      flag = true;
      break;
    }
  }

  if (flag == false) {
    db.collection('DetailsOfAllLists')
      .where({
        _openid: event.userInfo.openId,
        "classList.listName": event.className
      })
      .update({
        data: {
          "classList.$.listName": event.listName
        }
      })

    if (event.type == 'event') {
      db.collection('Events')
        .where({
          _openid: event.userInfo.openId,
          belongto: event.className
        })
        .update({
          data: {
            belongto: event.listName
          }
        })

      return true;
    } else if (event.type == 'pass') {
      db.collection('Passages')
        .where({
          _openid: event.userInfo.openId,
          belongto: event.className
        })
        .update({
          data: {
            belongto: event.listName
          }
        })

      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}