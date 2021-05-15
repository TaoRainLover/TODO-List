// pages/remind_doing/remind.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 添加新的todo内容
    newInfo: '',
    inputContent: '',

    title: '',
    type: '',
    onlist: [],
    finishedList:[],
    showDoing:false,
    showDone:true,
    noOperation:true,
    style_doing:"font-weight: bolder;",
    style_done:"color:rgba(213, 213, 213, 1)",
    // 长按获得焦点项id
    longPressItemid: '',
    // 底部菜单栏设置
    showActionsheet: false,
    groups: [
        // { text: '修改内容', value: "alter" },
        // { text: '完成任务', value: "finish" },
        { text: '删除任务', type: 'warn', value: "delete" }
    ]
  },
  moreOperation:function(){
    var isHidden = this.data.noOperation;
    if(isHidden==true){
      this.setData({
        noOperation:false,
      })
    }
    else{
      this.setData({
        noOperation:true,
      })
    }
  },
  // 进行项和完成项切换
  navigateTo:function(e){
    let type = e.target.id;
    if(type=="doing"){
      this.getOnLineList();
      this.setData({
        showDoing:false,
        showDone:true,
        style_doing:"font-weight: bolder;",
        style_done:"color:rgba(213, 213, 213, 1)",
      })
    }
    else if(type=="done"){
      this.getFinishedList();
      this.setData({
      showDone:false,
      showDoing:true,
      style_doing:"color:rgba(213, 213, 213, 1)",
      style_done:"font-weight: bolder;",
      })
    }
  },

  // 获取创建新输入框内容：
  getNewEveInfo: function(e){
    this.setData({
      newInfo: e.detail.value,
    })
  },
  // 添加新的事项
  addNewEvent: function(){
    let content = this.data.newInfo;
    if(content != ''){
      // 本地添加
      let newItem = {id:1,
        content:content,
        status:false,
        time:'0',
      }
      this.data.onlist.push(newItem);
      this.setData({
        onlist: this.data.onlist,
        newInfo: ''
      })
      // 数据库添加
      wx.cloud.callFunction({
        name: 'addNewListItem',
        data: {ItemClass: this.data.title, ItemType: this.data.type, ItemContent: content}
      }).then(res => {
        // console.log(res);
        if(res.result == true){
          // 2.更新正在进行列表
          this.getOnLineList();
        }else{
          // 则移除刚刚添加的本地数据
          console.log(err);
          wx.showToast({
            title: '网络异常',
            icon: 'none'
          })
          this.data.onlist.pop();
          this.setData({
            onlist: this.data.onlist
          })
        }
      }).catch(err => {
        // 则移除刚刚添加的本地数据
        console.log(err);
        wx.showToast({
          title: '网络异常',
          icon: 'none'
        })
        this.data.onlist.pop();
        this.setData({
          onlist: this.data.onlist
        })
      })
    }
  },
  // 获取列表数据
  getOnLineList: function(){
    // 获取列表数据
    let className = this.data.title;
    let type = this.data.type;
    console.log("当前的页面是：",className, type);
    wx.cloud.callFunction({
      name:'getOnLineList',
      data: {
        className: className,
        type: type,
      }
    }).then(res => {
      // console.log(res.result);
      this.setData({
        onlist: res.result.data
      });
    });
  },
  getFinishedList: function(){
    let className = this.data.title;
    let type = this.data.type;
    wx.cloud.callFunction({
      name: 'getFinishedList',
      data: {
        className: className,
        type: type,
      }
    }).then(res => {
      console.log(res.result.data);
      this.setData({
        finishedList: res.result.data,
      })
    })
  },
  // 切换状态：
  changeStatus: function(e){
    console.log(e);
    let index = e.currentTarget.id;
    let type = this.data.type;
    let item;
    let status;
    if(this.data.showDoing == false){
      item = this.data.onlist[index];
      status = item.status;
      let itemStatus = 'onlist['+index+'].status';
      this.setData({
        [itemStatus]: (!status),
      })
    }else if(this.data.showDone == false){
      item = this.data.finishedList[index];
      status = item.status;
      let itemStatus = 'finishedList['+index+'].status';
      this.setData({
        [itemStatus]: (!status),
      })
    }
    wx.cloud.callFunction({
      name: 'updateStatus',
      data: {type: type, id:item._id ,status: status}
    }).then(res =>{
      console.log(res);
      if(res.result == true){
        // 更新列表
        if(this.data.showDoing == false){
          this.getOnLineList();
        }else{
          this.getFinishedList();
        }
      }else{
        wx.showToast({
          title: '网络错误，请稍后再试！',
        })
      }
    })
  },

  // 键盘点击完成-->提交
  updataItemInfo: function(e){
    let index = e.currentTarget.id;
    let content= e.detail.value;
    let id;
    let itemContent;
    if(this.data.showDoing == false){
      id = this.data.onlist[index]._id
      // 本地更新
      itemContent = 'onlist['+index+'].content';
    }else if(this.data.showDone == false){
      id = this.data.finishedList[index]._id;
      itemContent = 'finishedList['+index+'].content';

    }
    this.setData({
      itemContent: content,
    });
    // 获取页面type
    let type = 'Reminder';
    if(this.data.type == 'event'){
      type = "Event";
    }
    console.log('提交',id, content);
    // 本地更新？
    // 数据库更新
    wx.cloud.callFunction({
      name: 'updateEventContent',
      data: {
        className: type,
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
  // 监听长按：
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
      let item = this.data.onlist[index];
      if(this.data.showDoing == false){
        // 本地删除：删除指定下标下的数据
        this.data.onlist.splice(index,1); 
        this.setData({
          onlist: this.data.onlist
        })
        
      }else if(this.data.showDone == false){
        item = this.data.finishedList[index];
        // 本地删除：删除指定下标下的数据
        this.data.finishedList.splice(index,1); 
        this.setData({
          finishedList: this.data.finishedList
        })
      }
      // 数据库删除
      wx.cloud.callFunction({
        name: 'deleteItem',
        data: {
          className: this.data.title,
          type: this.data.type,
          id: item._id,
        }
      }).then(res => {
        if(res.result == true){
          if(this.data.showDoing == false){
            this.getOnLineList();
          }else if(this.data.showDone == false){
            this.getFinishedList();
          }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    //设置页面高度和页面属性
    this.setData({
      pageH: app.globalData.pageHeight,
      viewOpeH: 112+app.globalData.navBarHeight*2 + 'rpx',
      title: options.name,
      type: options.type,
    })

    this.getOnLineList();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getOnLineList();
    this.getFinishedList();
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