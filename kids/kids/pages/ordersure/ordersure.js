// pages/ordersure/ordersure.js
const app = getApp()
const WXAPI = require('../../utils/request')
let timer = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    sureList: {},
    hasAddress: false,
    addressInfo: {},
    visible: false,
    modelType: '2',  //单个按钮的 ‘2’两个按钮的
    modeltitle: '提示',
    modeldes: '超出10分钟付款时间，订单取消～',
    btntext: '我知道了',
    btntext1: '取消',
    btntext2: '确定',
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '订单确认', //导航栏 中间的标题
    },
    height: app.globalData.statusBarHeight * 2 + 20,
    systemInfo:{},
    isIphoneX:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const systemInfo = wx.getSystemInfoSync()
    console.log('systemInfo', systemInfo)
    const isIphoneX = systemInfo.model.search("iPhone X") != -1
    const carData = app.globalData.carData || []
    const cartindex = options.cartindex
    this.getAddress()
    this.getLoginState()
    this.setData({
      sureList: carData[cartindex],
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
    this.getLoginState()
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
  //调微信收货地址
  getWxAddress: function () {
    const _this = this
    console.log('123')
    wx.chooseAddress({
      success(res) {
        console.log(res)
        const addressInfo = {
          userName: res.userName,
          telNumber: res.telNumber,
          provinceName: res.provinceName,
          cityName: res.cityName,
          countyName: res.countyName,
          detailInfo: res.detailInfo,
          newaddress: res.provinceName + res.cityName + res.countyName + res.detailInfo
        }
        _this.setData({
          hasAddress: addressInfo.newaddress ? true : false,
          addressInfo: addressInfo
        })
      },
      fail(err) {
        console.log('err', err)
        wx.getSetting({
          success(res) {
            console.log(res)
            if (!res.authSetting['scope.address']) {
              console.log(res)
              wx.openSetting({})
            }
          }
        })
      }
    })
  },

  throttle: function (delay) {
    let last = Date.now();
    if (!timer) {
      timer = last
      return true
    }
    if (last - timer > delay) {
      timer = Date.now();
      return true
    } else {
      return false
    }
  },


  //提交订单
  sumbmitOrder: function () {
    const _this =this
    if (_this.data.hasUserInfo){
      const res = _this.throttle(1500)
      console.log('res', res)
      if (res) {
        _this.newsumbmitOrder()
      }
    }else{
      _this.goUser()
    }
  },

  newsumbmitOrder: function () {
    const _this = this
    if (!_this.data.addressInfo || !_this.data.addressInfo.telNumber ||
      !_this.data.addressInfo.newaddress || !_this.data.hasUserInfo) {
      return
    }
    const cartIds = []
    const sureList = _this.data.sureList
    for (var i = 0; i < sureList.skus.length; i++) {
      if (sureList.skus[i].isSelect) {
        cartIds.push(sureList.skus[i].cartId)
      }
    }
    const data = {
      cartIds: cartIds,
      orderAddress: _this.data.addressInfo.newaddress,
      orderMobile: _this.data.addressInfo.telNumber,
      orderName: _this.data.addressInfo.userName,
    }

    WXAPI.submitOrder(data).then(function (res) {
      if (res.code == '0') {
        const orderId = res.data
        _this.payState(orderId)
      } else {
        const data = {
          visible: true,
          modelType: '2',  //单个按钮的 ‘2’两个按钮的
          modeltitle: '提交失败',
          modeldes: res.msg,
          btntext1: '返回首页',
          btntext2: '返回购物车'
        }
        _this.setPop(data)
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
        console.log('resData', resData)
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
    console.log('data---', data)
    const newdata = {
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
    }
    console.log('newdata', newdata)
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
            wx.navigateTo({
              url: `../orderinfo/orderinfo?orderId=${orderId}`
            })
          }
        })
      },
      fail(res) {
        console.log('patres', res)
        wx.navigateTo({
          url: `../orderinfo/orderinfo?orderId=${orderId}`
        })
      }
    })
  },


  //打开弹窗
  setPop: function (data) {
    const _this = this
    _this.setData({
      visible: true,
      modelType: data.modelType,  //单个按钮的 ‘2’两个按钮的
      modeltitle: data.modeltitle,
      modeldes: data.modeldes,
      btntext: data.btntext,
      btntext1: data.btntext1,
      btntext2: data.btntext2
    })
  },
  //关闭弹窗
  closePop: function () {
    const _this = this
    _this.setData({
      visible: false,
    })
  },
  //右边按钮
  handleSure: function () {
    const _this = this
    wx.switchTab({
      url: '../shoppingcart/shoppingcart'
    })

  },
  //左边按钮
  leftBtn: function () {
    const _this = this
    wx.switchTab({
      url: '../index/index'
    })
  },
  getAddress: function () {
    const _this = this
    WXAPI.getAddress().then(function (res) {
      if (res.code == '0') {
        const resData = res.data || []
        if (resData.length > 0) {
          const addressInfo = {}
          addressInfo.userName = resData[resData.length - 1].recName
          addressInfo.telNumber = resData[resData.length - 1].recMobile
          addressInfo.newaddress = resData[resData.length - 1].recAddress
          _this.setData({
            hasAddress: true,
            addressInfo: addressInfo
          })
        } else {
          _this.setData({
            hasAddress: false,
            addressInfo: {}
          })
        }

      } else {

      }
    })
  },
  getLoginState: function () {
    const _this = this
    if (app.globalData.hasUserInfo) {
      _this.setData({
        hasUserInfo: true
      })
    } else {
      _this.setData({
        hasUserInfo: false
      })
    }
  },
  goUser: function () {
    wx.switchTab({
      url: '../user/user'
    })
  }



})