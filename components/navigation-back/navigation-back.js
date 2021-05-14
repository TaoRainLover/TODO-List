const app = getApp()
// pages/flags/flags.js


Component({
    properties: {
        // defaultData（父页面传递的数据-就是引用组件的页面）
        Title: {
            type: String,
            
            value: 'title',
            observer: function(newVal, oldVal) {}
        }
    },
    data: {
        navBarHeight: app.globalData.navBarHeight,
        menuRight: app.globalData.menuRight,
        menuBotton: app.globalData.menuBotton,
        menuHeight: app.globalData.menuHeight,
    },
    
    attached: function() {},
    methods: {
      clickCancel: function(){
        wx.navigateBack({
          delta: 1,
        })
      }
    }
})