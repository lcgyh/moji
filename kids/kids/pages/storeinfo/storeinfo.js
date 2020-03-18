// pages/storeinfo/storeinfo.js
const app = getApp()
const WXAPI = require('../../utils/request')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopHeadPic: '',
    createTime: '',
    shopAddress: '',
    shopMobile: '',
    shoperName: '',
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '门店信息', //导航栏 中间的标题
    },
    height: app.globalData.statusBarHeight * 2 + 20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserStore()
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

  },
  //查询该用户的门店信息
  getUserStore: function () {
    const _this =this 
    WXAPI.getStoreInfo().then(function(res){
      if (res.code == '0'){
        const resData = res.data || {}
        _this.setData({
          shopHeadPic: resData.shopHeadPic,
          createTime: resData.createTime,
          shopAddress: resData.shopAddress,
          shopMobile: resData.shopMobile,
          shoperName: resData.shoperName,
          shopName: resData.shopName,
        })
      }else{

      }
    })
  }
})