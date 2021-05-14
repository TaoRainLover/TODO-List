// pages/idea_detail/idea.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageH: '',
    // 按钮按下样式：
    className: '',
    title: '',
    content: '',
    time: '',
    id: '',
    type: '',
    
  },

  //添加操作 获取输入的标题：
  getTitle: function(e){
    this.setData({
      title: e.detail.value,
    })
  },
  //添加操作 获取输入的内容：
  getContent: function(e){
    this.setData({
      content: e.detail.value,
    })
  } ,
  // 添加操作
  submit: function(e){
    if(this.data.type == 'add'){
      console.log('添加操作',e)
      console.log(this.data.className, this.data.title, this.data.content);
      if(this.data.title == ''){
        wx.showToast({
          title: '请先起个标题',
          icon: 'none',
        })
      }else{
        wx.cloud.callFunction({
          name: 'addNewPassItem',
          data: {
            className: this.data.className,
            title: this.data.title,
            content: this.data.content
          }
        }).then(res => {
          console.log(res.result);
          wx.navigateBack({
            delta: 1,
          })
        })
      }
    }else if(this.data.type == 'update'){
      console.log('更新操作！',e);
      console.log( this.data.className,this.data.id, this.data.title, this.data.content);
      // 标题不能为空
      if(this.data.title == ''){
        wx.showToast({
          title: '请输入标题',
          icon: 'none'
        })
      }else{
        wx.cloud.callFunction({
          name: 'updatePassContent',
          data: {
            className: this.data.className,
            id: this.data.id,
            title: this.data.title,
            content: this.data.content
          }
        }).then(res => {
          console.log(res);
          wx.navigateBack({
            delta: 1,
          })
        })
      }
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(e);
    this.setData({
      className: e.className,
      title: e.title,
      content: e.content,
      type: e.type,
      id: e.id,
      time: e.time,
    })
    // 设置页面高度
    this.setData({
      pageH: app.globalData.pageHeight,
    })
    // 设置显示内容
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