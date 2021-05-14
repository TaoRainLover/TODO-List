// pages/loginDemo/loginDemo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('页面加载成功！')

    // getUserInfo获取用户的信息，此方法失效，需要使用wx.getprofile方法
    // console.log('用户信息如下：');
    // wx.getUserInfo({
    //   success: res => {
    //     console.log(res)    
        
    //   }
    // })

    // 调用云函数获取用户的openid
    wx.cloud.callFunction({
      // name为调用云函数的名称
      name: 'getOpenid',
      // data 为传递给云函数的参数列表
      data:{}
    }).then(res => {
      // 打印返回结果
      console.log(res);
      // 打印openid
      console.log('用户的openid：',res.result.openid)
    }).catch( err => {
      // 失败
      
      console.log(err);
    })
  },

  getUserProfile: function (e) {
    wx.getUserProfile({
      desc: '业务需要',
      success: res => {
      	console.log(res)
      },
      fail: err => {
        console.log(err);
      }
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