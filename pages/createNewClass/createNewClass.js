// pages/createNewClass/createNewClass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 输入标题，15字符内
    newListTitle: '',
    // 输入框的文本颜色, 默认为第一个红色，然后根据用户点击颜色列表进行动态修改
    inputColor: 'rgba(255, 65, 65, 1)',
    // 内容格式，默认为空
    contentType: '',
    // 颜色列表
    colorList:{
    list1: [{
      id: 1,
      bColor: 'rgba(255, 65, 65, 1)',
      clickColor: 'background: white;',
      },{
        id: 2,
        bColor: 'rgba(98, 237, 255, 1)',
        clickColor: '',
      },
      {
        id: 3,
        bColor: 'rgba(116, 65, 255, 1)',
        clickColor: '',
      },{
        id: 4,
        bColor: 'rgba(255, 218, 65, 1)',
        clickColor: '',
      },{
        id: 5,
        bColor: 'rgba(65, 255, 109, 1)',
        clickColor: '',
      },{
        id: 6,
        bColor: 'rgba(255, 65, 255, 1)',
        clickColor: '',
      }],
    list2:[
      {
        id: 7,
        bColor: 'rgba(154, 154, 154, 1)',
        clickColor: 'white',
      },{
        id: 8,
        bColor: 'rgba(77, 138, 145, 1)',
        clickColor: 'white',
      },{
        id: 9,
        bColor: 'rgba(163, 71, 110, 1)',
        clickColor: 'white',
      },{
        id: 10,
        bColor: 'rgba(89, 121, 81, 1)',
        clickColor: 'white',
      },{
        id: 11,
        bColor: 'rgba(57, 26, 116, 1)',
        clickColor: 'white',
      },{
        id: 12,
        bColor: 'rgba(147, 102, 102, 1)',
        clickColor: 'white',
      }]
    },
    // type是否被选择
    eventIconStatus: 'Un',
    passIconStatus: 'Un',
    // 提交按钮样式
    buttonBg: 'rgba(234, 234, 234, 1)',
    buttonCr: 'black',
  },

  // 获取文本输入内容
  getInputContent: function(e){
    let title = e.detail.value;
    this.setData({
      newListTitle: title
    })
    console.log('标题是',title);
    this.setButtonSyle(title);
  },
// 动态设置按钮样式
  setButtonSyle: function(){
    let title = this.data.newListTitle;
    let color = this.data.inputColor;
    let type = this.data.contentType;

    console.log('-----------分割线')
    console.log(title, color, type);
    console.log('-----------')

    if(title !='' && color != '' && type != ''){
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
  
  // 点击颜色切换按钮
  changeColor: function(cur){
    // 获取点击项 的 id
    let id = cur.target.id;
    console.log('当前点击颜色id',id);
    // 首先循环遍历将每个item的clickColor清除
    for(let i = 0; i < 6; i++){
      let color1ClickColor = "colorList.list1["+ i+ "].clickColor";
      let color2CLickColor = "colorList.list2["+ i+ "].clickColor";
      this.setData({
        [color1ClickColor]: '',
        [color2CLickColor]: '',
      })

    }
    // 然后修改点中项的clickColor为白色
    if (id > 0 && id <=6 ) {
      let clickedItemColor = "colorList.list1["+ (id-1) +"].clickColor";
      this.setData({
        [clickedItemColor]: 'background: white'
      })

      // 修改输入框文本颜色
      let inputColor = this.data.colorList.list1[id-1].bColor;
      this.setData({
        inputColor: inputColor
      })
    }
    else if(id > 6 && id <=12){
      let clickedItemColor = "colorList.list2["+ (id-7) +"].clickColor";
      this.setData({
        [clickedItemColor]: 'background: white'
      })
      // 修改输入框文本颜色
      let inputColor = this.data.colorList.list2[id-7].bColor;
      this.setData({
        inputColor: inputColor
      })
    }
    else{
      console.log(id);
      console.log('id 不正确！')
    }

    
  },

  //内容格式切换
  selectContentType: function(typeobj){
    console.log('选择类型', typeobj.target.id)
    // 获取id
    let id = typeobj.target.id;
    // 修改内容格式和图标
    if(id == 'type1'){
      this.setData({
        eventIconStatus: '',
        passIconStatus: 'Un',
        contentType: 'event',
      })
    }else{
      this.setData({
        eventIconStatus: 'Un',
        passIconStatus: '',
        contentType: 'pass',
      })
    }
    this.setButtonSyle();

  },

  // 点击完成提交按钮
  /**
   * 1.获取输入标题文本框和内容格式是否为空，并判断是否为空
   * 2.为空弹出消息提示框
   * 3.不为空，则提交 标题、文本颜色、内容格式到后台，成功提交后弹窗提示，并返回主页。
   */
  submit: function(){
    let className = this.data.newListTitle;
    let color = this.data.inputColor;
    let type = this.data.contentType;
    if(className == ''){
      wx.showToast({
        title: '请输入标题',
        icon: 'none',
        duration: 1500,
        mask:true
    })}else if(type == ''){
      wx.showToast({
        title: '请选择内容格式',
        icon: 'none',
        duration: 1500,
        mask:true
    })
    }else{
      console.log('内容提交！');
      console.log(className, color, type)
      wx.cloud.callFunction({
        name: 'addNewClass',
        data:{
          name: className,
          color: color,
          type: type,
        }
      }).then(res => {
        console.log('添加新的分类结果',res);
        if(res.result == false){
          wx.showToast({
            title: '重名了，请换个名字吧！',
            icon: 'none'
          })
        }else{
          wx.showToast({
            title: '添加成功！',
            success: function(){
              wx.navigateBack({
                delta: 1,
              })
            }
          })
        }
 
      }).catch(err => {
        console.log('添加新的分类失败',err);
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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