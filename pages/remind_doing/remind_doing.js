// pages/remind_doing/remind.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenH: '',
    title: '',
    type: '',
    // 是否隐藏更多操作界面
    hiddenOperation: true,
    // 重命名输入框内容
    renameContent: '',
    // 是否隐藏重命名界面
    hiddenRenameToast: true,
    // 重命名修改名称
    reNameInfo: '',

    // 添加新的todo内容
    newInfo: '',
    inputContent: '',
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
      { text: '删除任务', type: 'warn', value: "delete" }
    ]
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
    let className = this.data.title;
    let type = this.data.type;
    let listOption;
    if(!that.data.showDoing){
      listOption = 'online'
    }else if(!that.data.showDone){
      listOption = 'finished'
    }
    console.log('你将清除的列表是',className, type, listOption);

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
              listOption: listOption
            }
          }).then(res => {
            if(res.result){
              wx.showToast({
                title: '清除成功！',
              })
              // 2.刷新页面
              if(!that.data.showDoing){
                that.getOnLineList();
              }else if(!that.data.showDone){
                that.getFinishedList();
              }
            }else{
              wx.showToast({
                title: '网络异常',
                icon: 'none',
              })
            }
          }).catch(err => {
            wx.showToast({
              title: '网络异常',
              icon: 'none',
            })
          })
          
        } else {
          //这里是点击了取消以后 ---> 无操作
          console.log('清除列表取消！');
        }
      }
    })
  },
  // 点击操作区重命名按钮
  rename: function(){
    // 判断该页面是否为自定义列表，否则不能进行重命名
    let type = this.data.type;
    if(type == 'reminder'){
      wx.showToast({
        title: '抱歉，此列表为系统创建，不能重命名',
        icon: 'none',
        duration: 2000
      })
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
    let className = this.data.title;
    let type = this.data.type;
    let listName = this.data.reNameInfo;
    if(listName == ''){
      wx.showToast({
        title: '列表名为空',
        icon: 'none',
      })
    }else if(listName == className){
      wx.showToast({
        title: '列表名未改动',
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
            title: listName,
          })
          // 隐藏操作界面
          that.hiddenOperation();
          that.setData({
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