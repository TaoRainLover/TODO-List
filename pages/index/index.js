// pages/flags/flags.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件参数设置，传递到组件
    defaultData: {
      title: "首页", // 导航栏标题
    },
    // 页面高度，控制滚动列表在页面底
    pageH: app.globalData.pageHeight,
    // 用户列表 ， 页面加载函数中初始化, id使用数据库自动创建id
    userLists: [],
    // 今日待办统计
    todo_today:{
      num_finished: 0,
      num_total: 0,
      fontsize: "88rpx",
      deg1: 0,
      deg2: 0,
    },

    // 长按获得焦点项id
    longPressItemid: '',
    // 底部菜单栏设置
    showActionsheet: false,
    groups: [
        { text: '删除列表', type: 'warn', value: "delete" }
    ]
  },

  // 设置今日事项圆形进度条字体大小和百分比
  setCircle: function(){
    // 设置字体大小
    let fontsize = 'todo_today.fontsize';
    // console.log(parseInt(this.data.todo_today.num_total / 10));
    if(parseInt(this.data.todo_today.num_total / 10) != 0){
      this.setData({
        [fontsize]: '52rpx',
      })
    }else{
      this.setData({
        [fontsize]: '88rpx',
      })
    }
    // 设置进度条
    let deg = (this.data.todo_today.num_finished/this.data.todo_today.num_total) * 360;
    let deg1 = 'todo_today.deg1';
    let deg2 = 'todo_today.deg2';
    let deg1_num = 0;
    let deg2_num = 0;
    if(deg >= 180){ 
      deg1_num = 180;
      deg2_num = deg - 180;
    }else if(deg < 180){
      deg1_num = deg;
    }
    this.setData({
      [deg1]: deg1_num,
      [deg2]: deg2_num,
    })
  },

  // switchToContent：跳转到内容详情页
  // 1.获取点击项的id
  // 2.通过id到userLists寻找对应项的type值和listName值，
  // 3，根据type值listName值条件判断跳转
  switchToContent: function(eve){
    // 1.获取点击项的id
    let id = eve.target.id;
    // 2.通过id到userLists寻找对应项的type值和listName值，
    let type = this.data.userLists[id].listType;
    let listName = this.data.userLists[id].listName;
    // console.log('你所点击的项目是',type, listName);
    let targetUrl = '';
    if(type == 'todo'){
      targetUrl = '../todos/todos?name=待办&type=todo';
    }else if(type == 'flag'){
      targetUrl = '../flags/flags?name=Flag&type=flag';
    }else if(type == 'idea'){
      targetUrl = '../idea-pan/idea-pan?name=想法&type=idea';
    }else if(type == 'reminder'){
      targetUrl = '../remind_doing/remind_doing?name=提醒&type=reminder';
    }else if(type == "event"){
      // 如果点击项是自创建事项列表, 需要将listName传递过去
      targetUrl = '../remind_doing/remind_doing?name='+listName+'&type=event';
    }else if(type == 'pass'){
      // 如果点击项是自创建事项列表, 需要将listName传递过去
      targetUrl = '../idea-pan/idea-pan?name='+listName+'&type=pass';
       
    }else{
      console.log('出错！！');
    }
    // 使用navigateTo方法不关闭上一页，可以实现通过左滑返回上一页
    // 而redictTo方法会关闭上一页，则不能左滑返回
    wx.navigateTo({
      url: targetUrl,
    })
  },
  navigateTodo: function(){
    wx.navigateTo({
      url: '../todos/todos',
    })
  },

  // 获取用户列表
  getUserLists: function(){
    wx.cloud.callFunction({
      name: 'getUserList',
    }).then(res => {
      // console.log('查询用户列表',res);
      this.setData({
        userLists: res.result,
      })
    }).catch(err => {
      console.log("查询用户列表失败！",err);
    })
  },
  // 获取今日待办统计并设置
  statisticsOfTodaysItems: function(){
    wx.cloud.callFunction({
      name: 'statisticsOfTodaysItems'
    }).then(res=>{
      // console.log('查询今日待办统计成功！', res.result);
      let num_total = 'todo_today.num_total';
      let num_finished = 'todo_today.num_finished';
      this.setData({
        [num_total]: res.result.total.total,
        [num_finished]: res.result.finished.total,
      })
      // 设置今日待办统计字体大小
      this.setCircle();
    }).catch(err => {
      console.log("获取用户今日待办统计失败",err);
    })
  },


  // 监听事项长按：
  longPressItem:function(eve){
    console.log('长按！', eve.currentTarget.id);
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
      let item = this.data.userLists[index];
      let listName = item.listName;
      let type = item.listType;
      if(type=='event' || type=='pass'){
        console.log("将删除如下列表", listName, type);
        // 本地删除
        this.data.userLists.splice(index,1);
        this.setData({
          userLists: this.data.userLists
        })
        // 数据库删除
        wx.cloud.callFunction({
          name: 'deleteClass',
          data: {
            className: listName,
            type: type,
          }
        }).then(res => {
          console.log(res.result);
          if(res.result == true){
            wx.showToast({
              title: '删除成功！',
            })
          }else{
            wx.showToast({
              title: '网络错误 w(ﾟДﾟ)w',
              icon: 'loading',
            })
          }
        }).catch(err => {
          wx.showToast({
              title: '网络错误 w(ﾟДﾟ)w',
              icon: 'loading',
            })
        })
      }else{
        wx.showToast({
          title: '该列表为系统创建，不可删除！',
          icon: 'none',
          duration: 2000,
        })
      }
    }
    // 关闭底部菜单
    this.close()
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 用户登录
    wx.cloud.callFunction({
      name: 'userLogin',
        data: {
        }
    }).then(res => {
      console.log('登陆成功！', res.result)
    })
    .catch(err => {
      console.log('登陆失败！', err);
    })

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
    // 获取用户列表
    this.getUserLists();
    // 获取用户今日待办信息
    this.statisticsOfTodaysItems();
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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