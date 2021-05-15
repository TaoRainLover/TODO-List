// app.js
App({
  onLaunch: function(options) {
    // 初始化云开发环境
    wx.cloud.init({
      env: "todolist-7ggimpiuccef2eba",
      traceUser: true,
    })
    const that = this;
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.
    getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
    that.globalData.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + systemInfo.statusBarHeight;
    that.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    that.globalData.menuBotton = menuButtonInfo.top - systemInfo.statusBarHeight;
    that.globalData.menuHeight = menuButtonInfo.height;
    // 修改页面高度
    wx.getSystemInfo({
      success: (result) => {
        // 获取屏幕高度
        that.globalData.screenHeight = result.screenHeight;
        // pageH = screenH - navBarH
        that.globalData.pageHeight = (result.screenHeight - that.globalData.navBarHeight) + 'px';
        console.log(that.globalData.pageHeight);
      },
    });
    // 获取用户数据
    this.getUserStatisticInfo();
    this.getUseTime();
    // 佛祖保佑
    // this.BuddhaBless()
  },

  // 数据都是根据当前机型进行计算，这样的方式兼容大部分机器
  globalData: {
      //第一部分：  页面信息
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuBotton: 0, // 胶囊距底部间距（保持底部间距一致）
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      screenHeight: 0, //屏幕高度，以防后面需要
      pageHeight: 0, //设置自定义导航条之后，page高度需要重新设置（为每个页面container设置）

      //第二部分： 用户信息：
      // openid,小程序用户的唯一标识
      openid:'',
      // 用户昵称
      userName: '',
      // 用户创建事项的分类列表
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
      // 注册天数：
      registerTime: '0'
  },

  // 获取用户统计信息
  getUserStatisticInfo: function(){
    // 初始化用户信息
    let that = this;
    wx.cloud.callFunction({
      name: 'getUserEventInfo',
      success: function(res){
        that.globalData.userInfo.createInfo = res.result[0];
        that.globalData.userInfo.finishInfo = res.result[1];
      }
    })
  },
  getUseTime: function(){
    // 获取用户的使用时间
    wx.cloud.callFunction({
      name: 'getUseTime'
    }).then(res => {
      this.globalData.registerTime = res.result;
    })
  },




  // 佛祖保佑：
  BuddhaBless: function(){
    console.log([
      "////////////////////////////////////////////////////////////////////",
      "//                          _ooOoo_                               //",
      "//                         o8888888o                              //",
      "//                         88\" . \"88                              //",
      "//                         (| ^_^ |)                              //",
      "//                         O\\  =  /O                              //",
      "//                      ____/`---'\\____                           //",
      "//                    .'  \\\\|     |//  `.                         //",
      "//                   /  \\\\|||  :  |||//  \\                        //",
      "//                  /  _||||| -:- |||||-  \\                       //",
      "//                  |   | \\\\\\  -  /// |   |                       //",
      "//                  | \\_|  ''\\---/''  |   |                       //",
      "//                  \\  .-\\__  `-`  ___/-. /                       //",
      "//                ___`. .'  /--.--\\  `. . ___                     //",
      "//              .\"\"'<  `.___\\_<|>_/___.'  >'\"\".                   //",
      "//            | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |                 //",
      "//            \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /                 //",
      "//     ========`-.____`-.___\\_____/___.-`____.-'========          //",
      "//                          `=---='                               //",
      "//      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^        //",
      "//         佛祖保佑       永无BUG     永不修改                      //",
      "////////////////////////////////////////////////////////////////////",
      ].join( '\n' ));
  }
})