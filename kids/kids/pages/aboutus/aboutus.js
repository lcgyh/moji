// pages/aboutus/aboutus.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '关于我们', //导航栏 中间的标题
    },
    height: app.globalData.statusBarHeight * 2 + 20,
    backFirst:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const backFirst = options.backFirst
    if (backFirst){
      this.setData({
        backFirst: backFirst
      })
    }
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
    return {
      path: `/pages/aboutus/aboutus?backFirst=true`
    }
  },
  navback: function () {
    console.log('this.data.backFirst', this.data.backFirst)
    this.data.backFirst ? wx.switchTab({
      url: "../index/index"
    }) : wx.navigateBack();
  }
})