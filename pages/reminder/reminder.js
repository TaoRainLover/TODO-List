const app = getApp();
Page({
    data: {
      pageTitle: '',
      // 屏幕高度和宽
      widheight: '0',
      widwidth: '0',
      // 页面高度
      pageHeight: '0',


      // 长按获得焦点项id
      longPressItemid: '',
      // 底部菜单栏设置
      showActionsheet: false,
      groups: [
        { text: '删除任务', type: 'warn', value: "delete" }
      ]
    },
    
    onLoad(options) {
      console.log(options);
      this.setData({
        pageTitle: options.name,
        type: options.type,
        viewOpeH: 112+app.globalData.navBarHeight*2 + 'rpx',

      })
        let that = this;
        // console.log(app.globalData.navBarHeight);
        wx.getSystemInfo({
            success: function (res) {
            console.log(res.screenHeight)

              that.setData({
                widheight: res.screenHeight,
                widwidth: res.screenWidth,
                // 页面高度等于屏幕高度减去导航条高度
                pageHeight: (res.screenHeight - app.globalData.navBarHeight) + 'px',
              });
            }
          });
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
      wx.cloud.callFunction({

      })

    }
    // 关闭底部菜单
    this.close()
  },
})