// pages/todo_overdue/todo.js
let app =getApp();
let Time = require("../../funTools/time");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // operation固定条高度设置
    viewOpeH:'',
    // 是否隐藏更多操作界面
    hiddenOperation: true,

    // 添加新的todo内容
    newTodoInfo: '',
    todoContent: '',
    // 列表数据
    tdlist: [
    ],
    beforeLi: [
    ],
    finishedLi:[],
    // 切换列表设置
    showoverdue:true,
    showtoday:false,
    showdone:true,
    noOperation:true,
    style_today:"font-weight: bolder;",
    style_overdue:"color:rgba(213, 213, 213, 1)",
    style_complete:"color:rgba(213, 213, 213, 1)",

    // 长按获得焦点项id
    longPressItemid: '',
    // 底部菜单栏设置
    showActionsheet: false,
    groups: [
        { text: '删除任务', type: 'warn', value: "delete" }
    ]
  },
  // 列表切换
  navigateTo:function(e){
    let type = e.target.id;
    if(type=="today"){
      this.getTodayTodo();
      this.setData({
        showtoday:false,
        showoverdue:true,
        showdone:true,
        style_today:"font-weight: bolder;",
        style_overdue:"color:rgba(213, 213, 213, 1)",
        style_complete:"color:rgba(213, 213, 213, 1)",
      })
    }
    else if(type=="overdue"){
      this.getBeforeList();
      this.setData({
      showoverdue:false,
      showtoday:true,
      showdone:true,
      style_today:"color:rgba(213, 213, 213, 1)",
      style_overdue:"font-weight: bolder;",
      style_complete:"color:rgba(213, 213, 213, 1)",
      })
    }
    else if(type=="complete"){
      this.getFinishedList();
      this.setData({
        showoverdue:true,
        showtoday:true,
        showdone:false,
        style_today:"color:rgba(213, 213, 213, 1)",
        style_overdue:"color:rgba(213, 213, 213, 1)",
        style_complete:"font-weight: bolder;",
      })
    }
  },

  // 这里是更多操作设置
  // 点击operation按钮
  clickOperation:function(){
    let that = this;
    var ishidden = this.data.hiddenOperation;
    if(ishidden == true){
      this.setData({
        hiddenOperation: false
      })
    }else if(ishidden == ''){
      that.setData({
        hiddenOperation: true
      })
    }
  },
  // 隐藏更多操作界面啊
  hiddenOperation: function(){
    this.setData({
      hiddenOperation: true
    })
  },
  // 点击操作区删除按钮 -- 未完成
  delete: function(){
    let that = this;
    console.log("即将清除此列表");
    let type = 'todo';
    let listOption;
    if(this.data.showtoday == false){
      listOption = 'today';
    }else if(this.data.showoverdue == false){
      listOption = 'before';
    }else if(this.data.showdone == false){
      listOption = 'finished';
    }
    // 弹出确认
    wx.showModal({
      title: '你确认要清除这个列表吗',
      success: function (res) {
        if (res.confirm) {
          //点击了确定以后
          console.log('删除信息','Todo', type, listOption)
          // 1.提交删除操作
          wx.cloud.callFunction({
            name: 'clearLists',
            data: {
              className: '待办',
              type: 'todo',
              listOption: listOption,
            }
          }).then(res => {
            if(res.result){
              wx.showToast({
                title: '清除成功！',
              })
              // 关闭操作界面
              that.hiddenOperation();
              // 2.刷新页面
              if(!that.data.showtoday){
                that.getTodayTodo();
              }else if(!that.data.showoverdue){
                that.getBeforeList();
              }else if(!that.data.showdone){
                that.getFinishedList();
              }
            }else{
              wx.showToast({
                title: '网络异常',
                icon: 'none',
              })
              that.hiddenOperation();

            }
          }).catch(err => {
            wx.showToast({
              title: '网络异常',
              icon: 'none',
            })
            that.hiddenOperation();

          })
          
        } else {
          //这里是点击了取消以后 ---> 无操作
          console.log('清除列表取消！');
          that.hiddenOperation();

        }
      }
    })
  },

  // 点击操作区重命名按钮
  rename: function(){
    wx.showToast({
      title: '抱歉，此列表为系统创建，不能重命名',
      icon: 'none',
      duration: 2000
    })
    this.hiddenOperation();
  },


  // 获取创建新的待办输入框内容：
  getNewTodoInfo: function(e){
    this.setData({
      newTodoInfo: e.detail.value,
    })
  },
  // 添加新的todo
  addNewTodo: function(){
    let content = this.data.newTodoInfo;
    if(content != ''){
      // 本地添加
      let newItem = {id:1,
        content:content,
        status:false,
        time:'0',
      }
      this.data.tdlist.push(newItem);
      this.setData({
        tdlist: this.data.tdlist,
        newTodoInfo: ''
      });
      // 数据库添加
      wx.cloud.callFunction({
        name: 'addNewListItem',
        data: {ItemClass: '待办', ItemType: 'todo', ItemContent: content}
      }).then(res => {
        if(res.result == true){
          // 更新今天列表
          this.getTodayTodo();
        }else{
          // 数据库添加失败
          wx.showToast({
            title: '网络异常',
            icon: 'none'
          })
          this.data.tdlist.pop();
          this.setData({
            tdlist: this.data.tdlist
          })
        }
      }).catch(err=>{
        // 则移除刚刚添加的本地数据
        console.log(err);
        wx.showToast({
          title: '网络异常',
          icon: 'none'
        })
        this.data.tdlist.pop();
        this.setData({
          tdlist: this.data.tdlist
        })
      })
    }
    
  },
  // 获取待办列表数据： 
  getTodayTodo: function(){
    wx.cloud.callFunction({
      name: 'getTodayTodo',
    }).then(res => {
      this.setData({
        tdlist: res.result.data,
      });
    });
  },
  // 获取待办完成事项
  getFinishedList: function(){
    wx.cloud.callFunction({
      name: 'getFinishedList',
      data: {className: '待办', type: 'todo'}
    }).then(res => {
      // console.log(res.result.data);
      this.setData({
        finishedLi: res.result.data,
      })
    })
  },
  //获取除今天的列表（更早）
  getBeforeList: function(){
    wx.cloud.callFunction({
      name: 'getbeforeTodo'
    }).then(res => {
      let beLi = res.result.list;
      // console.log(beLi);
      // 将时间转换为本地时间
      for(let i = 0; i < beLi.length; i++){
        beLi[i]._id = Time.serveDateToLocalDate(beLi[i]._id);
      }
      this.setData({
        beforeLi: beLi,
      })
    })
  },

  // 修改点击项状态
  changeStatus: function(e){
    // console.log(e.currentTarget.id);
    // console.log(e);
    let id = e.currentTarget.id;
    // 获取点击项的列信息：
    let item;
    if(this.data.showtoday == false){
      item = this.data.tdlist[id];
      let itemStatus = 'tdlist['+id+'].status';
      this.setData({
        [itemStatus]: (!item.status)
      })
    }else if(this.data.showoverdue == false){
      var arr = id.split("/");
      let day = arr[0];
      let index = arr[1];
      item = this.data.beforeLi[day].list[index];
      let itemStatus = 'beforeLi['+day+'].list['+index+'].status';
      // 更新
      this.setData({
        [itemStatus]: (!item.status)
      })
      console.log(item.content);
    }else if(this.data.showdone == false){
      item = this.data.finishedLi[id];
      // 更新
      let itemStatus = 'finishedLi['+id+'].status';
      this.setData({
        [itemStatus]: (!item.status)
      })
    }
    // console.log(item._id, item.status, item.content);
    // 调用云函数修改数据库数据
    wx.cloud.callFunction({
      name: 'updateStatus',
      data: {
        type: 'todo',
        id: item._id,
        // 由于先对页内数据进行了取反操作,所以需要再次取反获取之前的状态提交到数据库
        status: (!item.status)
      }
    }).then(res => {
      // console.log(res);
      if(res.result == true){
        // console.log('修改状态成功！')
        // 进行列表刷新
        if(this.data.showtoday == false){
          // this.getTodayTodo();
        }else if(this.data.showoverdue == false){
          // this.getBeforeList();
        }else if(this.data.showdone == false){
          this.getFinishedList();
        }
      }else{
        wx.showToast({
          title: '网络错误，请稍后再试',
          icon: 'loading',
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '网络错误，请稍后重试！',
        icon: 'loading',
      })
    })
  },
  // 键盘点击完成-->提交
  updataItemInfo: function(e){
    let index = e.currentTarget.id;
    let content= e.detail.value;
    let id;
    if(this.data.showtoday == false){
      id = this.data.tdlist[index]._id;
      // 本地更新
      let itemContent = 'tdlist['+index+'].content'
      this.setData({
        [itemContent]: content,
      })
    }else if(this.data.showoverdue == false){
      let arr = index.split("/");
      let day = arr[0];
      let i = arr[1];
      id = this.data.beforeLi[day].list[i]._id;
      // 本地更新
      let itemContent = 'beforeLi['+day+'].list['+i+'].content';
      this.setData({
        [itemContent]: content,
      })
    }else if(this.data.showdone == false){
      id = this.data.finishedLi[index]._id;
      // 本地更新
      let itemContent = 'finishedLi['+index+'].content'
      this.setData({
        [itemContent]: content,
      })
    }
    // console.log('提交',id, content);
    // 数据库更新
    wx.cloud.callFunction({
      name: 'updateEventContent',
      data: {
        className: 'Todo',
        id: id,
        content: content
      }
    }).then(res => {
      console.log(res.result);
      if(res.result == true){
        console.log('更新成功！');
      }
    }).catch(err => {
      console.log('更改失败！');
    })
  },

  // 监听事项长按：
  longPressItem:function(eve){
    console.log('长按！', eve.currentTarget.id);
    // 震动
    // wx.vibrateShort();
    this.setData({
      showActionsheet: true,
      longPressItemid: eve.currentTarget.id,
    })
  },
  // 关闭底部栏
  close: function () {
    this.setData({
        showActionsheet: false
    })
  },
  // 点击底部栏选项
  btnClick(e) {
    console.log("你选择的是：",e.detail.value);
    // 获取用户选择类型
    let id = this.data.longPressItemid;
    console.log('你进行操作的项是：',id);
    let type = e.detail.value;
    if(type == 'delete'){
      console.log('删除操作！');
      // 删除操作
      let index = this.data.longPressItemid;
      let item = this.data.tdlist[index];
      if(this.data.showtoday == false){
        // 本地删除：删除指定下标下的数据
        this.data.tdlist.splice(index,1); 
        this.setData({
          tdlist: this.data.tdlist
        })
        
      }else if(this.data.showoverdue == false){
        var arr = id.split("/");
        let day = arr[0];
        let index = arr[1];
        // console.log(day, index);
        item = this.data.beforeLi[day].list[index];
        console.log(item._id,item.content)
        // 本地删除：删除指定下标下的数据
        this.data.beforeLi[day].list.splice(index,1); 
        this.setData({
          beforeLi: this.data.beforeLi
        })
      }else if(this.data.showdone == false){
        item = this.data.finishedLi[index];
        // 本地删除：删除指定下标下的数据
        this.data.finishedLi.splice(index,1); 
        this.setData({
          finishedLi: this.data.finishedLi
        })
      }
      // 数据库删除
      wx.cloud.callFunction({
        name: 'deleteItem',
        data: {
          className: '待办',
          type: 'todo',
          id: item._id,
        }
      }).then(res => {
        if(res.result == true){
          if(this.data.showtoday == false){
            this.getTodayTodo();
          }else if(this.data.showoverdue == false){
            this.getBeforeList();
          }else if(this.data.showdone == false){
            this.getFinishedList();
          }
        }else{
          wx.showToast({
            title: '网络错误，请稍后再试！',
          })
        }
      })
    }else if(type =='alter'){
      // 修改内容操作
      // console.log('修改操作！');
      // for(let i = 0; i < this.data.flagList.length; i++){
      //   if(id == this.data.flagList[i].id){
      //     // 设置选中项为聚焦状态
      //     let focusItem = "flagList["+i+"].isfocus";
      //     this.setData({
      //       [focusItem]: 'true'
      //     })
      //     break;
      //   }
        
      // }
    }else if(type == 'finish'){
      // 完成事项操作
      
    }
    // 关闭底部菜单
    this.close()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置页面高度
    this.setData({
      pageH: app.globalData.pageHeight,
      viewOpeH: 112+app.globalData.navBarHeight*2 + 'rpx',
    })
    // 
    this.getBeforeList();
    this.getTodayTodo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getTodayTodo();
    let finished;
    // 进入页面后两秒后获取已完成待办；
    Time.setCountdown(finished, 2, this.getFinishedList)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // clearInterval(finished)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // clearInterval(finished)

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})