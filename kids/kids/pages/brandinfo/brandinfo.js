// pages/brandinfo/brandinfo.js
const app = getApp()
const WXAPI = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandName: '爱他美',
    brandDescPic: '',
    brandDesc: '',
    list: [],
    total: 0,
    pageSize: 10,
    pageNum: 1,
    brandId: null,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '专区介绍', //导航栏 中间的标题
      bgcolor: '#fff',
      textcolor: '#161C35'
    },
    height: app.globalData.statusBarHeight * 2 + 20,
    systemInfo:{},
    isIphoneX:false,
    backFirst:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const _this = this
    const systemInfo = wx.getSystemInfoSync()
    const isIphoneX = systemInfo.model.search("iPhone X") != -1
    const brandName = options.brandName
    const brandId = options.brandId
    const backFirst = options.backFirst
    let current = Number(this.data.pageNum)
    _this.setData({
      brandId: brandId,
      systemInfo: systemInfo,
      isIphoneX: isIphoneX,
      backFirst: backFirst
    }, function () {
      _this.getBrandInfo(brandId, current)
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
    const brandId = this.data.brandId
    this.getBrandInfo(brandId, 1)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const brandId = this.data.brandId
    let current = Number(this.data.pageNum)
    current++
    this.getBrandInfo(brandId, current)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const brandId = this.data.brandId
    return {
      path: `/pages/brandinfo/brandinfo?backFirst=true&brandId=${brandId}`
    }
  },
  getBrandInfo: function (brandId, current) {
    const _this = this
    const data = {
      pageSize: 10,
      current: current,
      brandId: brandId
    }
    WXAPI.getBrandInfo(data).then(function (res) {
      if (res.code == '0') {

        const resData = res.data || {}


        const strs = resData.brandDesc
        if (strs){
          strs.replace(/↵/g, "\n");
        }
       
        console.log('strs', strs)
        const brandDesc = strs || ''
        const brandDescPic = resData.brandDescPic
        const brandName = resData.brandName
        const pdSpus = resData.pdSpus || {}
        const list = pdSpus.list || []
        const total = pdSpus.total
        const pageSize = pdSpus.pageSize
        const pageNum = pdSpus.pageNum
        _this.setData({
          brandName,
          brandDescPic,
          brandDesc,
          list: current == '1' ? list:_this.data.list.concat(list),
          total,
          pageSize,
          pageNum
        })
      } else {

      }
    })
  },
  goInfo: function (e) {
    console.log(e)
    const goodsId = e.currentTarget.dataset.goodsid
    const issellout = e.currentTarget.dataset.issellout
    wx.navigateTo({
      url: `../goodsinfo/goodsinfo?goodsId=${goodsId}`
    })

  },
  bacKMeth: function () {
    this.data.backFirst ? wx.switchTab({
      url: `../index/index`
    }) : wx.navigateBack();
  }
})