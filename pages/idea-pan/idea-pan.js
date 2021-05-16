// pages/idea/idea.js
const app = getApp();
var Time = require("../../funTools/time.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageH: '',
    pageTitle: '',
    screenH: '',
    pageType: '',
    className: '',
    list: [],

    // 是否隐藏更多操作界面
    hiddenOperation: true,
    // 重命名输入框内容
    renameContent: '',
    // 是否隐藏重命名界面
    hiddenRenameToast: true,
    // 重命名修改名称
    reNameInfo: '',

    // 按钮点击样式：
    buttonClickS: 'box-shadow: 0px 0rpx 60rpx rgba(65, 65, 65, 0.16);',
    // 长按获得焦点项id
    longPressItemid: '',
    // 底部菜单栏设置
    showActionsheet: false,
    groups: [ { text: '删除任务', type: 'warn', value: "delete" }]
    
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
  
  // 关闭底部抽屉
  close: function () {
    this.setData({
        showActionsheet: false
    })
  },
  // 点击抽屉底部栏选项
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
  // 点击操作区删除按钮
  delete: function(){
    let that = this;
    console.log('你将清除的列表是',this.data.pageTitle, this.data.pageType);
    let className = this.data.pageTitle;
    let type = this.data.pageType;
    // 弹出确认
    wx.showModal({
      title: '你确认要清除这个列表吗',
      success: function (res) {
        if (res.confirm) {
          //点击了确定以后
          console.log('你选择了删除')
          // 1.提交删除操作
          wx.cloud.callFunction({
            name: 'clearLists',
            data: {
              className: className,
              type: type,
              listOption: 'all'
            }
          }).then(res => {
            if(res.result){
              wx.showToast({
                title: '清除成功！',
              })
              that.hiddenOperation();
              // 2.刷新页面
              that.getList();
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
    // 判断该页面是否为自定义列表，否则不能进行重命名
    let that = this;
    let className = this.data.pageTitle;
    let type = this.data.pageType;
    let listName = this.data.reNameInfo;
    if(type == 'idea'){
      wx.showToast({
        title: '抱歉，此列表为系统创建，不能重命名',
        icon: 'none',
        duration: 2000
      })
      // 隐藏操作界面
      this.hiddenOperation();
    }else{
      // 1.显示修改框
      this.setData({
        hiddenRenameToast: false
      })
      this.hiddenOperation();
    }
  },
  // 监听重命名输入框
  getRenameInfo: function(e){
    console.log(e.detail.value);
    this.setData({
      reNameInfo: e.detail.value,
    })
  },
  // 重命名取消
  cancelRename: function(){
    this.setData({
      hiddenRenameToast: true
    })
  },
  // 重命名确认
  confirmRename: function(){
    // 1.获取重命名信息：
    let that = this;
    let className = this.data.pageTitle;
    let type = this.data.pageType;
    let listName = this.data.reNameInfo;
    if(listName == '' || listName == className){
      wx.showToast({
        title: '列表名为空或未改动',
        icon: 'none',
      })
    }else{
      console.log('修改前',className, '修改后',listName);
      wx.cloud.callFunction({
        name: 'listRename',
        data: {
        className: className,
        type: type,
        listName: listName
        }
      }).then(res => {
        if(res.result){
          // 1.弹窗提示
          wx.showToast({
            title: '修改成功',
          })
          // 2.修改标题
          that.setData({
            pageTitle: listName,
            hiddenRenameToast: true,
          })
        }else{
          wx.showToast({
            title: '列表名已经存在！',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            hiddenRenameToast: true,
          })
          // 3.隐藏操作界面
          that.hiddenOperation();
      }
      }).catch(err => {
        wx.showToast({
        title: '网络异常！',
        icon: 'none',
        duration: 2000
        })
        that.setData({
          hiddenRenameToast: true,
        })
        // 3.隐藏操作界面
        that.hiddenOperation();
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
      screenH: app.globalData.screenHeight + 'px',
      
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