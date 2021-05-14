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
    if (event.name == accessToken[i].listName) {
      flag = true;
      break;
    }
  }

  if (flag == false) {
    let classListObject = {
      listColor: event.color,
      listName: event.name,
      listType: event.type,
      numItems: 0
    }
    let res = await db.collection('DetailsOfAllLists')
      .where({
        _openid: event.userInfo.openId
      })
      .update({
        data: {
          "classList": _.push(classListObject)
        }
      });
    return true;
  } else {
    return false;
  }
}