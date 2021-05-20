const app = getApp();
// 引入deleteClass外部函数
var funTools = require("../../funTools/time.js");
Page({

  data: {
    // operation固定条高度设置
    viewOpeH:'',
    // 屏幕高度：
    screenH: '',
    // 页面高度：
    pageH: '',
    // 是否隐藏更多操作界面
    hiddenOperation: true,
    // 重命名输入框内容
    renameContent: '',
    // 是否隐藏重命名界面
    hiddenRenameToast: true,
    // 重命名修改名称
    reNameInfo: 'Flag',

    // flagList
    flagList: [],
    // 长按获得焦点项id
    longPressItemid: '',
    // 底部菜单栏设置
    showActionsheet: false,
    groups: [
        { text: '删除任务', type: 'warn', value: "delete" }
    ]
  },
  getFlagList: function(){
    // 加载flag数据
    wx.cloud.callFunction({
      name: 'getFlagList'
    }).then(res => {
      console.log(res.result);
      // if(res.result.length == 0)
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
    // 1.修改view和屏幕高度
    this.setData({
      viewOpeH: app.globalData.viewOpeH,
      screenH: app.globalData.screenHeight + 'px',
      pageH: app.globalData.pageHeight,
      content: '',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  // 监听事项长按：
  longPressItem:function(eve){
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
    // 获取用户选择类型
    let id = this.data.longPressItemid;
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
    // 弹出确认
    wx.showModal({
      title: '你确认要清除这个列表吗',
      success: function (res) {
        if (res.confirm) {
          //点击了确定以后
          // 1.提交删除操作
          wx.cloud.callFunction({
            name: 'clearLists',
            data: {
              className: 'Flag',
              type: 'flag',
              listOption: 'all'
            }
          }).then(res => {
            if(res.result){
              wx.showToast({
                title: '清除成功！',
              })
              that.hiddenOperation();
              that.getFlagList();
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
          // 2.刷新页面
          
        } else {
          //这里是点击了取消以后 ---> 无操作
          that.hiddenOperation();

        }
      }
    })
  },
  // 点击操作区重命名按钮
  rename: function(){
    // 判断该页面是否为自定义列表，否则不能进行重命名
    wx.showToast({
      title: '抱歉，此列表为系统创建，不能重命名',
      icon: 'none',
      duration: 2000
    })
    this.hiddenOperation();
  },

  // 监听顶部添加flag输入框事件
  getInputInfo: function(e){
    let that = this;
    that.setData({
      content: e.detail.value
    })
  },
  // 添加新的flag项
  addNewFlag: function(){
    let that = this;
    // 获取当前时间
    let curData = new Date();
    let today  = curData.getFullYear()+'/'+(curData.getMonth()+1)+'/'+curData.getDate();
    // 获取用户输入的内容
    let content = this.data.content;
    // 类型
    if(content == ''){
      wx.showToast({
        title: '请输入Flag内容！',
        icon: "none",
      })
    }else{
      // 本地添加
      let newItem = {id:1,
        content:content,
        status:false,
        time: today,
      }
      // 向数组第一个位置添加一条数据
      that.data.flagList.unshift(newItem);
      that.setData({
        flagList: that.data.flagList,
        content: '',
      })
      // 向数据库提交添加、然后重新刷新页面
      // 刷新页面（或者更新数据）：
      wx.cloud.callFunction({
        name: 'addNewListItem',
        data: {
          ItemClass: 'Flag', ItemType: 'flag', ItemContent: content
        }
      }).then(res => {
        if(res.result){
          // 更新列表
          this.getFlagList();
        }else{
          // 数据库添加失败
          wx.showToast({
            title: '网络异常',
            icon: 'none'
          })
          this.data.flagList.shift();
          this.setData({
            flagList: this.data.flagList
          })
        }
      }).catch(err => {
        // 数据库添加失败
        wx.showToast({
          title: '网络异常',
          icon: 'none'
        })
        this.data.flagList.shift();
        this.setData({
          flagList: this.data.flagList
        })
      })
      
    }
  },

  // 修改内容-->键盘点击完成-->提交
  updataItemInfo: function(e){
    let index = e.currentTarget.id;
    let content= e.detail.value;
    let id = this.data.flagList[index]._id;
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
      if(res.result == true){
        // console.log('更新成功！');
      }
    }).catch(err => {
      // console.log('更改失败！');
    })
  },
  // 点击完成旗帜图标:
  // flagOn <--->  flagDown相互切换
  clickFlag: function(e){
    // 1.获取点击项的id
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
      }else{
        wx.showToast({
          title: '网络错误，请稍后重试！',
          icon: 'loading'
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '网络错误，请稍后重试！',
        icon: 'loading'
      })
    })
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