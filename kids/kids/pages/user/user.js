// pages/user/user.js
const app = getApp()
const WXAPI = require('../../utils/request')
const {
  $Toast
} = require('../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    spinShow:false,
    hasUserInfo: false,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的', //导航栏 中间的标题
    },
    height: app.globalData.statusBarHeight * 2 + 20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this
    this.getLoginState()
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

 
  //查询该用户的订单信息
  getUserOrder: function () {
    const _this = this
    WXAPI.getOrderlist().then(function (res) {
      if (res.code == '0') {
        const resData = res.data || []
        _this.setData({
          orderList: resData,
        })
      } else {

      }
    })
  },
  //前往订单页
  goOrderPage: function (e) {
    console.log(e)
    if(this.data.hasUserInfo){
      const odStatus = e.currentTarget.dataset.odstatus
      wx.navigateTo({
        url: `../order/order?odStatus=${odStatus}`
      })
    }else{
      this.errMessage('请先登录')
    }

    
  },

  //前往门店页面
  goStorePage: function () {
    wx.navigateTo({
      url: `../storeinfo/storeinfo`
    })
  },

  //调收货地址  
  getWxAddress: function () {
    const _this = this
    wx.chooseAddress({
      success(res) {

      }
    })
  },


  //联系客服
  connectUs: function () {
    wx.navigateTo({
      url: `../contactus/contactus`
    })
  },
  //前往关于我们页面
  goAboutUsPage: function () {
    wx.navigateTo({
      url: `../aboutus/aboutus`
    })
  },

  bindcontact: function (e) {
    console.log(e)
  },

  //判断用户登录状态
  getLoginState: function () {
    const _this =this
    if (app.globalData.hasUserInfo) {
      _this.setData({
        hasUserInfo: true
      })
    }else{
      _this.setData({
        hasUserInfo: false
      })
    }
  },

  getPhoneNumber: function (e) {
    console.log(e)
    //把得手机号加密信息，
    // const phoneInfo=e
    if (e.detail.errMsg =='getPhoneNumber:ok'){
      let data = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      }
      this.getOpenId(data)
    }
  },
  //获取openId
  getOpenId: function (phoneInfo) {
    const _this = this
    wx.login({
      success: res => {
        // 发送 res.code到后台
        const data = {
          code: res.code,
          encryptedData: phoneInfo.encryptedData,
          iv: phoneInfo.iv
        }
        WXAPI.userLogin(data).then(function (res) {
          if (res.code == '0') {
            if (res.data) {
              wx.setStorageSync('token', res.data)
              app.globalData.hasUserInfo = true
              _this.setData({
                hasUserInfo: true
              })
            }else{
              _this.loadingView(spinShow)
              _this.errMessage(res.msg)
            }
          } else {
            const spinShow = false
            _this.loadingView(spinShow)
            _this.errMessage(res.msg)
          }
        })
      },
      fail: res => {
        const spinShow = false
        _this.loadingView(spinShow)
        _this.errMessage('登陆失败')

      }
    })
  },

  //报错提示
  errMessage: function (msg) {
    $Toast({
      content: msg,
      type: 'warning'
    });
  },
  //控制loading
  loadingView: function (spinShow) {
    this.setData({
      spinShow: spinShow
    })
  },

})
