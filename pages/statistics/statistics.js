// pages/statistics/statistics.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户个人统计信息
    userInfo: {
      createInfo:{
        flag: 0,
        todo: 0,
        // idea: 52,
        reminder: 0,
        customEve: 0,
      },
      finishInfo: {
        flag: 0,
        todo: 0,
        // idea: 32,
        reminder: 0,
        customEve: 0,
      }
    },
    pageH: '',
    // 注册天数：
    registerTime: '',

    // 显示页面, false表示还未创建任何事项，显示第二页，true表示已经有事项被创建，显示第一页。
    isCreated: true,
  },


  // 获取用户统计信息
  getUserStatisticInfo: function(){
    // 初始化用户信息
    let that = this;
    wx.cloud.callFunction({
      name: 'getUserEventInfo',
      success: function(res){
        let totalInfo = 'userInfo.createInfo';
        let finishedInfo = 'userInfo.finishInfo';
        that.setData({
          [totalInfo]: res.result[0],
          [finishedInfo]: res.result[1],
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    // 设置页面高度
    let totalInfo = 'userInfo.createInfo';
    let finishedInfo = 'userInfo.finishInfo';
    this.setData({
      pageH: app.globalData.pageHeight,
      [totalInfo]: app.globalData.userInfo.createInfo,
      [finishedInfo]: app.globalData.userInfo.finishInfo,
      registerTime: app.globalData.registerTime,
    })
  },

  createNewOne: function(){
    console.log("创建新的事项");
    wx.navigateTo({
      url: '../addNewEvent/addNewEvent',
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
    console.log('统计页');
    // 更新用户数据
    // app.getUseTime();
    this.getUserStatisticInfo();
    
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