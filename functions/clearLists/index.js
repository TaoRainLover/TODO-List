// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let db = cloud.database()
  const _ = db.command

  let now = new Date()
  let yy = now.getFullYear(); //获取time1中的年份
  let mm = now.getMonth() + 1; //获取月份，getMonth()得到的是0~11
  let dd = now.getDate(); //获取日期
  let startTime = yy + "-" + mm + "-" + dd + " " + "00:00:00" //当天起始时间
  let endTime = yy + "-" + mm + "-" + dd + " " + "23:59:59" //当天终止时间
  startTime = new Date(startTime)
  endTime = new Date(endTime)

  if (event.type == 'todo') {
    if (event.listOption == 'today') {
      let res = await db.collection('Todo')
        .where({
          _openid: event.userInfo.openId,
          time: _.gte(startTime).and(_.lte(endTime)),
          isDelete: false
        })
        .get();

      res = -(res.data.length)

      db.collection('DetailsOfAllLists')
        .where({
          _openid: event.userInfo.openId,
          "classList.listName": event.className
        })
        .update({
          data: {
            "classList.$.numItems": _.inc(res)
          }
        })

      db.collection('Todo')
        .where({
          _openid: event.userInfo.openId,
          time: _.gte(startTime).and(_.lte(endTime)),
          isDelete: false
        })
        .update({
          data: {
            isDelete: true
          }
        })
      return true;
    } else if (event.listOption == 'before') {
      let res = await db.collection('Todo')
        .where({
          _openid: event.userInfo.openId,
          time: _.lt(startTime),
          isDelete: false
        })
        .get();

      res = -(res.data.length)

      db.collection('DetailsOfAllLists')
        .where({
          _openid: event.userInfo.openId,
          "classList.listName": event.className
        })
        .update({
          data: {
            "classList.$.numItems": _.inc(res)
          }
        })

      db.collection('Todo')
        .where({
          _openid: event.userInfo.openId,
          time: _.lt(startTime),
          isDelete: false
        })
        .update({
          data: {
            isDelete: true
          }
        })
      return true;
    } else if (event.listOption == 'finished') {
      let res = await db.collection('Todo')
        .where({
          _openid: event.userInfo.openId,
          status: true,
          isDelete: false
        })
        .get();

      res = -(res.data.length)

      db.collection('DetailsOfAllLists')
        .where({
          _openid: event.userInfo.openId,
          "classList.listName": event.className
        })
        .update({
          data: {
            "classList.$.numItems": _.inc(res)
          }
        })

      db.collection('Todo')
        .where({
          _openid: event.userInfo.openId,
          status: true,
          isDelete: false
        })
        .update({
          data: {
            isDelete: true
          }
        })
      return true;
    }
  } else if (event.type == 'reminder') {
    if (event.listOption == 'online') {
      let res = await db.collection('Reminder')
        .where({
          _openid: event.userInfo.openId,
          status: false,
          isDelete: false
        })
        .get();

      res = -(res.data.length)

      db.collection('DetailsOfAllLists')
        .where({
          _openid: event.userInfo.openId,
          "classList.listName": event.className
        })
        .update({
          data: {
            "classList.$.numItems": _.inc(res)
          }
        })

      db.collection('Reminder')
        .where({
          _openid: event.userInfo.openId,
          status: false,
          isDelete: false
        })
        .update({
          data: {
            isDelete: true
          }
        })
      return true;
    } else if (event.listOption == 'finished') {
      let res = await db.collection('Reminder')
        .where({
          _openid: event.userInfo.openId,
          status: true,
          isDelete: false
        })
        .get();

      res = -(res.data.length)

      db.collection('DetailsOfAllLists')
        .where({
          _openid: event.userInfo.openId,
          "classList.listName": event.className
        })
        .update({
          data: {
            "classList.$.numItems": _.inc(res)
          }
        })

      db.collection('Reminder')
        .where({
          _openid: event.userInfo.openId,
          status: true,
          isDelete: false
        })
        .update({
          data: {
            isDelete: true
          }
        })
      return true;
    }
  } else if (event.type == 'idea') {
    let res = await db.collection('Idea')
      .where({
        _openid: event.userInfo.openId,
        isDelete: false
      })
      .get();

    res = -(res.data.length)

    db.collection('DetailsOfAllLists')
      .where({
        _openid: event.userInfo.openId,
        "classList.listName": event.className
      })
      .update({
        data: {
          "classList.$.numItems": _.inc(res)
        }
      })

    db.collection('Idea')
      .where({
        _openid: event.userInfo.openId,
        isDelete: false
      })
      .update({
        data: {
          isDelete: true
        }
      })
    return true;
  } else if (event.type == 'flag') {
    let res = await db.collection('Flag')
      .where({
        _openid: event.userInfo.openId,
        isDelete: false
      })
      .get();

    res = -(res.data.length)

    db.collection('DetailsOfAllLists')
      .where({
        _openid: event.userInfo.openId,
        "classList.listName": event.className
      })
      .update({
        data: {
          "classList.$.numItems": _.inc(res)
        }
      })

    db.collection('Flag')
      .where({
        _openid: event.userInfo.openId,
        isDelete: false
      })
      .update({
        data: {
          isDelete: true
        }
      })
    return true;
  } else if (event.type == 'event') {
    if (event.listOption == 'online') {
      let res = await db.collection('Events')
        .where({
          _openid: event.userInfo.openId,
          belongto: event.className,
          status: false,
          isDelete: false
        })
        .get();

      res = -(res.data.length)

      db.collection('DetailsOfAllLists')
        .where({
          _openid: event.userInfo.openId,
          "classList.listName": event.className
        })
        .update({
          data: {
            "classList.$.numItems": _.inc(res)
          }
        })

      db.collection('Events')
        .where({
          _openid: event.userInfo.openId,
          belongto: event.className,
          status: false,
          isDelete: false
        })
        .update({
          data: {
            isDelete: true
          }
        })
      return true;
    } else if (event.listOption == 'finished') {
      let res = await db.collection('Events')
        .where({
          _openid: event.userInfo.openId,
          belongto: event.className,
          status: true,
          isDelete: false
        })
        .get();

      res = -(res.data.length)

      db.collection('DetailsOfAllLists')
        .where({
          _openid: event.userInfo.openId,
          "classList.listName": event.className
        })
        .update({
          data: {
            "classList.$.numItems": _.inc(res)
          }
        })

      db.collection('Events')
        .where({
          _openid: event.userInfo.openId,
          belongto: event.className,
          status: true,
          isDelete: false
        })
        .update({
          data: {
            isDelete: true
          }
        })
      return true;
    }
  } else if (event.type == 'pass') {
    let res = await db.collection('Passages')
      .where({
        _openid: event.userInfo.openId,
        belongto: event.className,
        isDelete: false
      })
      .get();

    res = -(res.data.length)

    db.collection('DetailsOfAllLists')
      .where({
        _openid: event.userInfo.openId,
        "classList.listName": event.className
      })
      .update({
        data: {
          "classList.$.numItems": _.inc(res)
        }
      })

    db.collection('Passages')
      .where({
        _openid: event.userInfo.openId,
        belongto: event.className,
        isDelete: false
      })
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