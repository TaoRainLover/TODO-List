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
    _openid:event.userInfo.openId,
    "classList.listName":event.ItemClass
  })
  .update({
    data:{
      "classList.$.numItems":_.inc(1)
    }
  })

  if (event.ItemType == "todo") {
    let now = new Date()
    let yy = now.getFullYear(); //获取time1中的年份
    let mm = now.getMonth() + 1; //获取月份，getMonth()得到的是0~11
    let dd = now.getDate(); //获取日期
    let startTime = yy + "-" + mm + "-" + (dd) + " " + "00:00:00" //当天起始时间
    startTime = new Date(startTime)
    db.collection('Todo')
      .add({
        data: {
          _openid: event.userInfo.openId,
          content: event.ItemContent,
          isDelete: false,
          status: false,
          time: startTime
        }
      })
    return true;
  } else if (event.ItemType == "reminder") {
    db.collection('Reminder')
      .add({
        data: {
          _openid: event.userInfo.openId,
          content: event.ItemContent,
          isDelete: false,
          status: false,
          time: time
        }
      })
    return true;
  } else if (event.ItemType == "flag") {
    db.collection('Flag')
      .add({
        data: {
          _openid: event.userInfo.openId,
          content: event.ItemContent,
          isDelete: false,
          status: false,
          time: time
        }
      })
    return true;
  } else if (event.ItemType == "idea") {
    db.collection('Idea')
      .add({
        data: {
          _openid: event.userInfo.openId,
          title: event.ItemContent,
          content: '',
          isDelete: false,
          time: time
        }
      })
    return true;
  } else if (event.ItemType == "event") {
    db.collection('Events')
      .add({
        data: {
          _openid: event.userInfo.openId,
          belongto: event.ItemClass,
          content: event.ItemContent,
          isDelete: false,
          status: false,
          time: time
        }
      })
    return true;
  } else if (event.ItemType == "pass") {
    db.collection('Passages')
      .add({
        data: {
          _openid: event.userInfo.openId,
          belongto: event.ItemClass,
          title: event.ItemContent,
          isDelete: false,
          time: time,
          content: ""
        }
      })
    return true;
  } else {
    return false
  }
}