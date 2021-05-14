// pages/addNewEvent/addNewEvent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    // 用户的属性列表，进入页面之后需要重新初始化此页面。
    typeList: [{
      id: 1,
      type: '待办',
      // checkStyle:''
    },{
      id: 2,
      type: 'Flag',
      // checkStyle:''

      }, {
        id: 3,
        type: '想法',
      // checkStyle:''

      },{
        id: 4,
        type: '提醒',
      // checkStyle:''
      },{
        id: 5,
        type: '胡思乱想',
      // checkStyle:''
      }, {
        id: 6,
        type: '读书随笔',
        // checkStyle:''

      }],

    // 需要提交的输入
    // 1.创建列表信息
    content : '',
    checkType: '',
    // 2.当前时间
    currentTime: '',

    // 提交按钮样式
    buttonBg: 'rgba(234, 234, 234, 1)',
    buttonCr: 'black',
  },

// 动态设置按钮样式
setButtonSyle: function(){
  let content = this.data.content;
  let type = this.data.checkType;

  if(content != '' && type != ''){
    this.setData({
      buttonBg: 'rgba(0, 111, 255, 1)',
      buttonCr: 'white',
    })
  }else{
    this.setData({
      buttonBg: 'rgba(234, 234, 234, 1)',
      buttonCr: 'black',
    })}
},


// 获取input框内容
  getInputInfo: function(e){
    let that = this;
    that.setData({
      content: e.detail.value
    })
    console.log('你输入的内容是', this.data.content);
    // 设置按钮样式
    this.setButtonSyle();
  },


  // 获取选择列表值并设置样式
  // 1.清除所有列表的背景
  // 2.在将选中的列表设置样式
  // 3.设置按钮颜色
  getEType: function(e){
    let id = e.currentTarget.id;
    console.log('当前选择的id是:', id);
    // 1.清除所有列表的背景
    let length = this.data.typeList.length;
    // console.log('列表的长度是', length);
    for(let i = 0; i < length; i++){
      let typeSy = "typeList["+ i+ "].checkStyle";
      this.setData({
        [typeSy]: ''
      })
    }
    // 2.在将选中的列表设置样式
    let checkItemSy = "typeList["+id+ "].checkStyle";
    this.setData({
      [checkItemSy]: 'background: rgba(255, 173, 10, 1); color: white',
    })
    // 获取选中列表值
    let className = this.data.typeList[id].listName;
    let type = this.data.typeList[id].listType;
    console.log('你选中的列表为：', className, type);
    this.setData({
      checkType: className,
      type: type,
    })
    // 改变按钮样式
    this.setButtonSyle();
  },
//完成创建按钮-提交事项信息 
  submitData: function(){
    let content = this.data.content;
    let className = this.data.checkType;
    let type = this.data.type;
    // let time = this.data.currentTime;
    
    if(content == ''){
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
      })
    }else if(className == ''){
      wx.showToast({
        title: '请选择所属列表',
        icon: 'none'
      })
    }else if(content != '' && className != ''){
      console.log('我已提交！', content, className, type);  
      wx.cloud.callFunction({
        name: 'addNewListItem',
        data: {
          ItemClass: className,
          ItemType: type,
          ItemContent: content,
        }
      }).then(res => {
        console.log(res);
        if(res.result == true){
          wx.showToast({
            title: '添加成功！',
            icon: 'none',
            duration: 1500,
            success: function(){
              wx.navigateBack({
                delta: 1,
              })
            }
          });
        }
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置当前时间
    let curTime = new Date();
    curTime = curTime.toLocaleDateString()
    console.log(curTime)
    this.setData({
      currentTime: curTime
    })
    // 设置列表数据
    wx.cloud.callFunction({
      name: 'getUserList',

    }).then(res => {
      // console.log(res);
      this.setData({
        typeList: res.result,
      })
    })
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