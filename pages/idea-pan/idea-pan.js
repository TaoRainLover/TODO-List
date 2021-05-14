// pages/idea/idea.js
const app = getApp();
var Time = require("../../funTools/time.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageTitle: '',
    pageType: '',
    className: '',
    noOperation: true,
    list: [
      
    ],
    pageH: '',
    // 按钮点击样式：
    buttonClickS: 'box-shadow: 0px 0rpx 60rpx rgba(65, 65, 65, 0.16);',
    // 长按获得焦点项id
    longPressItemid: '',
    // 底部菜单栏设置
    showActionsheet: false,
    groups: [
        
        { text: '删除任务', type: 'warn', value: "delete" }
    ]
    
  },
  // 写下新内容按钮--跳转
  addNewIdea: function(){
    console.log('我将跳转要添加页！');
    let today =new Date();
    let time = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
    wx.navigateTo({
      url: '../idea_content/idea_content?className='+this.data.pageTitle+'&id=0&title=&content=&type=add&time='+time,
    })
    
  },
  buttonTouchStyle: function(){
    this.setData({
      buttonClickS: 'box-shadow: none',
    })
  },
  buttonTouchedStyle: function(){
    this.setData({
      buttonClickS: 'box-shadow: 0px 0rpx 60rpx rgba(65, 65, 65, 0.16);',
    })
  },
  // 跳转到内容页：
  navigationToContent:function(e){
    console.log(e);
    let index = e.currentTarget.id;
    let id = this.data.list[index]._id;
    let title = this.data.list[index].title;
    let content = this.data.list[index].content;
    let time = this.data.list[index].time;
    for(let i = 0; i < this.data.list.length; i++){
      if(id == this.data.list[i]._id){
        title = this.data.list[i].title;
        content = this.data.list[i].content;
        break;
      }
    }
    console.log('你将携带如下信息跳转', id, title, content);
    // 跳转到内容页
    wx.navigateTo({
      url: '../idea_content/idea_content?className='+this.data.pageTitle+'&id='+id+'&title='+title+'&content='+content+'&type=update&time='+time,
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
    let index = this.data.longPressItemid;
    console.log('你进行操作的项是：',index);
    let type = e.detail.value;
    if(type == 'delete'){
      let item = this.data.list[index];
      // 删除操作
      // 本地删除
      this.data.list.splice(index, 1);
      this.setData({
        list: this.data.list
      })
      // 数据库删除
      wx.cloud.callFunction({
        name: 'deleteItem',
        data: {
          className: this.data.pageTitle,
          type: this.data.pageType,
          id: item._id,
        }
      }).then(res => {
        if(res.result == true){
          this.getList();
        }else{
          wx.showToast({
            title: '网络错误，请稍后再试！',
          })
        }
      })

    }
    // 关闭底部菜单
    this.close()
  },


  // 点击operation按钮
  clickOperation:function(){
    let that = this;
    var ishidden = this.data.noOperation;
    if(ishidden == true){
      console.log(ishidden);
      // console.log('隐藏了！');
      this.setData({
        noOperation: ''
      })
      // console.log('修改结束');
    }else if(ishidden == ''){
      console.log(ishidden);
      that.setData({
        noOperation: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let pageH = app.globalData.pageHeight;
    this.setData({
      pageTitle: options.name,
      pageType: options.type,
      pageH: pageH,
      viewOpeH: 112+app.globalData.navBarHeight*2 + 'rpx',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 获取列表数据：
  getList: function(){
    // 获取页面信息：
    let className = this.data.pageTitle;
    let type = this.data.pageType;
    // console.log(className, type);
    wx.cloud.callFunction({
      name: 'getList',
      data: {
        className: className,
        type:type
      }
    }).then(res => {
      console.log(res.result.data);
      let lists = res.result.data;
      for(let i = 0; i < lists.length; i++){
        lists[i].time = Time.serveDateToLocalDate(lists[i].time);
        
      }
      console.log(lists)
      this.setData({
        list: lists,
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList();
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