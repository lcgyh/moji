// pages/order/order.js
const app = getApp()
const WXAPI = require('../../utils/request')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    spinShow:false,
    current: '1',
    orderList:[],
    hasOrder:false,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的订单', //导航栏 中间的标题
    },
    height: app.globalData.statusBarHeight * 2 + 20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options)
    const odStatus = options.odStatus
    const _this = this
    if (odStatus){
      this.setData({
        current: odStatus,
        spinShow:true,
      },function(){
        _this.getOrderList(odStatus)
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('ww')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      spinShow: true
    })
    const current = this.data.current
    this.getOrderList(current)
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
  //tab change
  handleChange({ detail }) {
    const _this =this
    this.setData({
      current: detail.key,
      spinShow:true,
    },function(){
      _this.getOrderList(detail.key)
    });
  },
  //查询当前tab的信息
  getOrderList: function (odStatus){
    const _this =this
    const data = {
      odStatus: odStatus
    }
    WXAPI.getOrderlist(data).then(function(res){
      const resData = res.data || {}
      if (res.code=='0'){
        _this.setData({
          orderList: resData.list || [],
          hasOrder: resData.list.length>0 ? true:false,
          spinShow:false
        })
      }else{
        _this.setData({
          orderList: [],
          hasOrder: false,
          spinShow:false
        })
      }
    })
  },
  //点击跳转订单详情
  goOrderInfo:function(e){
    console.log('e',e)
    const orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: `../orderinfo/orderinfo?orderId=${orderId}`
    })
  },
  bacKMeth: function () {
    wx.switchTab({
      url: '../user/user'
    })
  }
})