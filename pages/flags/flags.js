// pages/flags/flags.js
const app = getApp();
// 引入deleteClass外部函数
var funTools = require("../../funTools/time.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // operation固定条高度设置
    viewOpeH:'',
    // 屏幕高度：
    screenH: '',
    // 液面高度：
    pageH: '',
    // operation是否被点击
    noOperation: true,
    // flagList
    flagList: [
      
    ],
    // 输入框内容
    content: '',
    // 是否显示输入框
    showToast: true,

    // 长按获得焦点项id
    longPressItemid: '',
    // 重命名名称
    reNameInfo: 'Flag',
    // 底部菜单栏设置
    showActionsheet: false,
    groups: [
        // { text: '修改内容', value: "alter" },
        // { text: '完成任务', value: "finish" },
        { text: '删除任务', type: 'warn', value: "delete" }
    ]
  },


  getFlagList: function(){
    // 加载flag数据
    wx.cloud.callFunction({
      name: 'getFlagList'
    }).then(res => {
      console.log("flag:",res.result.data);
      let flagList = res.result.data;
      for(let i = 0; i < flagList.length; i++){
        flagList[i].time = funTools.serveDateToLocalDate(flagList[i].time);
      }
      this.setData({
        flagList: flagList,
      })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.globalData.navBarHeight);
    // 1.修改view和屏幕高度
    console.log("此页面已经被加载了！");
    this.setData({
      viewOpeH: 112+app.globalData.navBarHeight*2 + 'rpx',
      screenH: app.globalData.screenHeight + 'px',
      pageH: app.globalData.pageHeight,
    })
    // 2.清除输入框内容
    this.setData({
      content: '',
    })
    // 3.从数据库中获取flagList数据 --> 页面渲染成功
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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
      // 删除操作
      let index = this.data.longPressItemid;
      let item = this.data.flagList[index];
      // 本地删除：删除指定下标下的数据
      this.data.flagList.splice(index,1); 
      this.setData({
        flagList: this.data.flagList
      })
      // 数据库删除
      wx.cloud.callFunction({
        name: 'deleteItem',
        data: {
          className: 'Flag',
          type: 'flag',
          id: item._id,
        }
      }).then(res => {
        if(res.result == true){
          this.getFlagList();
        }else{
          wx.showToast({
            title: '网络错误，请稍后再试！',
          })
        }
      })
    }else if(type =='alter'){
      // 修改内容操作
      console.log('修改操作！');
      for(let i = 0; i < this.data.flagList.length; i++){
        if(id == this.data.flagList[i].id){
          // 设置选中项为聚焦状态
          let focusItem = "flagList["+i+"].isfocus";
          this.setData({
            [focusItem]: 'true'
          })
          break;
        }
        
      }
    }else if(type == 'finish'){
      // 完成事项操作
      
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

  // 监听顶部输入框事件
  getInputInfo: function(e){
    let that = this;
    that.setData({
      content: e.detail.value
    })
    console.log('你输入的内容是', this.data.content);
  },


  // 点击添加按钮
  addNewFlag: function(){
    let that = this;
    // 获取当前时间
    let curData = new Date().toLocaleDateString();
    // 获取用户输入的内容
    let content = this.data.content;
    // 类型
    let type = "flag";
    if(content == ''){
      wx.showToast({
        title: '请输入Flag内容！',
        icon: "none",
      })
    }else{
      // 向数据库提交、然后重新刷新页面
      console.log('你将提交如下内容：',type, curData, content);
      // 刷新页面（或者更新数据）：
      wx.cloud.callFunction({
        name: 'addNewListItem',
        data: {
          ItemClass: 'Flag', ItemType: 'flag', ItemContent: this.data.content
        }
      }).then(res => {
        this.getFlagList();
        this.setData({
          content: ''
        })
      })
      
    }
  },

  // // 监听点击项输入框事件
  // getFocusItemInputInfo: function(e){
  //   console.log(e.detail.value, e.currentTarget.id);
  //   let index = e.currentTarget.id;
  //   let content= e.detail.value;
  //   // wx.cloud.callFunction({
  //   //   name: '',
  //   //   data: {

  //   //   }
  //   // }).then()
  // },
  // 键盘点击完成-->提交
  updataItemInfo: function(e){
    let index = e.currentTarget.id;
    let content= e.detail.value;
    let id = this.data.flagList[index]._id;
    console.log('提交',id, content);
    // 本地更新？
    // 数据库更新
    wx.cloud.callFunction({
      name: 'updateEventContent',
      data: {
        className: 'Flag',
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
  // 点击完成旗帜图标:
  // flagOn <--->  flagDown相互切换
  clickFlag: function(e){
    // 1.获取点击项的id
    console.log("旗帜被点击了", e.target.id);
    let id = e.target.id;
    // 2.从flagList中匹配flag状态。
    let item = this.data.flagList[id];
    let status = item.status;
    let itemid = item._id;
    // 3.更新列表状态
    let clickItem = 'flagList['+id+'].status';
    this.setData({
      [clickItem] : (!status)
    })
    // 4.提交数据库修改
    wx.cloud.callFunction({
      name: 'updateStatus',
      data:{
        type: 'flag',
        id: itemid,
        status: status,
      }
    }).then(res => {
      if(res.result == true){
        // 重新获取数据
        console.log("更改成功");
        // this.getFlagList();
      }else{
        wx.showToast({
          title: '网络错误，请稍后重试！',
        })
      }
    })
    // 4.更新数据
  },
  // 点击操作区删除按钮
  delete: function(){
    console.log("此页面即将被删除");
    // operaions.deleteClass(1, 2);
    let type = 'Flag';
    // 弹出确认
    wx.showModal({
      title: '你确认要删除这个列表吗',
      // content: ,
      success: function (res) {
        if (res.confirm) {
          //点击了确定以后
          console.log('你选择了删除')
          // 1.提交删除操作
          // ....
          // 2.返回至index页面
          wx.switchTab({
            url: '../../pages/index/index',
          })
        } else {
          //这里是点击了取消以后 ---> 无操作
          console.log('你选择了取消')
        }
      }
    })
  },

  // 点击操作区重命名按钮
  rename: function(){
    // 1.显示修改框
    this.setData({
      showToast: false
    })
  },
  // 监听重命名输入框
  getRenameInfo: function(e){
    console.log(e.detail.value);
    this.setData({
      reNameInfo: e.detail.value,
    })
  },
  cancelRename: function(){
    this.setData({
      showToast: true
    })
  },
  confirmRename: function(){
    // 1.获取重命名信息：
    let name = this.data.reNameInfo;
    if(name == ''){
      wx.showToast({
        title: '请先输入',
        icon: 'none',
      })
    }else{
      // 2.提交修改到后台
      console.log("你将提交如下数据：", 'flag', 'name');
      // 3.重新刷新页面
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getFlagList();
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