// pages/orderinfo/orderinfo.js
const app = getApp()
const WXAPI = require('../../utils/request')
const { $Toast } = require('../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},
    odDetails: [],
    spAddress: {},
    orderId: null,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '订单详情', //导航栏 中间的标题
    },
    height: app.globalData.statusBarHeight * 2 + 20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const orderId = options.orderId
    this.getOderInfo(orderId)
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
  //获取订单详情接口
  getOderInfo: function (orderId) {
    const _this = this
    const data = {
      orderId: orderId
    }
    WXAPI.getOrderInfo(data).then(function (res) {
      if (res.code == '0') {
        const resData = res.data || {}
        const odDetails = resData.odDetails || []
        const spAddress = resData.spAddress || {}
        _this.setData({
          orderInfo: resData,
          odDetails: odDetails,
          spAddress: spAddress,
          orderId: orderId
        })
      }
    })
  },
  goPaying: function () {
    //去支付
    const orderId = this.data.orderId
    this.payState(orderId)

  },
  cancelPaying: function () {
    //取消订单
    const _this = this
    const orderId = _this.data.orderId
    const data = {
      orderId: orderId
    }
    WXAPI.cancelOrder(data).then(function (res) {
      if (res.code == '0') {
        _this.getOderInfo(orderId)
      } else {

      }
    })
  },
  //调后台支付接口
  payState: function (orderId) {
    const _this = this
    const data = {
      orderId: orderId
    }
    WXAPI.payAmount(data).then(function (res) {
      if (res.code == '0') {
        const resData = res.data || {}
        const wxData = {
          timeStamp: resData.timeStamp,
          nonceStr: resData.nonceStr,
          package: resData.packageValue,
          paySign: resData.paySign,
          signType: resData.signType
        }
        _this.getWxpay(wxData, orderId)
      } else {

      }
    })
  },
  //调取微信支付
  getWxpay: function (data, orderId) {
    const _this = this
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success(res) {
        const data = {
          orderId: orderId
        }
        WXAPI.updataOrderState(data).then(newres => {
          if (newres.code == '0') {
            //跳转订单详情页
            _this.getOderInfo(orderId)
          }
        })
      },
      fail(res) { }
    })
  },
  copyTBL: function () {
    const _this = this
    wx.setClipboardData({
      data: _this.data.orderInfo.orderExpressNo,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  bacKMeth: function () {
    wx.navigateTo({
      url: `../order/order?odStatus=${1}`
    })
  }

})