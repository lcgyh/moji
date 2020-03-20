// pages/brand/brand.js
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
    brandList: [],
    spinShow: true,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '专区', //导航栏 中间的标题
      bgcolor: '#fff',
      textcolor: '#161C35'
    },
    height: app.globalData.statusBarHeight * 2 + 20, 
    showNav:true,
    systemInfo: {},
    isIphoneX: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const systemInfo = wx.getSystemInfoSync()
    const isIphoneX = systemInfo.model.search("iPhone X") != -1
    this.setData({
      systemInfo: systemInfo,
      isIphoneX: isIphoneX
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
    this.getBrandList()
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
    const spinShow = true
    this.loadingView(spinShow)
    this.getBrandList()
    wx.stopPullDownRefresh()
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
  //控制loading
  loadingView: function (spinShow) {
    this.setData({
      spinShow: spinShow
    })
  },
  //报错提示
  errMessage: function (msg) {
    $Toast({
      content: msg,
      type: 'warning'
    });
  },
  //获取品牌列表
  getBrandList: function () {
    const _this = this
    const data={
      current:1,
      pageSize:99999
    }
    WXAPI.getBrandList(data).then(function (res) {
      setTimeout(function () {
        _this.loadingView(false)
      }, 500)
      if (res.code == '0') {
        const resData = res.data || {}
        _this.setData({
          brandList: resData.list || [],
          pageNum: resData.pageNum,
          pageSize: resData.pageSize,
          total: resData.total
        })
      } else {
        _this.errMessage(res.msg)
      }
    })
  },
  goBrandInfo: function (e) {
    console.log('e',e)
    const _this = this
    const brandId = e.currentTarget.dataset.brandid
    const brandName = e.currentTarget.dataset.brandname
    wx.navigateTo({
      url: `../brandinfo/brandinfo?brandId=${brandId}&brandName=${brandName}`
    })
  },
  // onPageScroll: function (t) {
  //   const e = t.scrollTop;
  //   console.log('eee',e)
  //   console.log('this.data.systemInfo', this.data.systemInfo)
  //   if (e <  this.data.systemInfo.statusBarHeight) {
  //     this.setData({
  //       showNav: true
  //     })
  //   } else {
  //     this.setData({
  //       showNav: false
  //     })
  //   }
  // },


})