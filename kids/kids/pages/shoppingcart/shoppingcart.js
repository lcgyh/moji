// pages/shoppingcart/shoppingcart.js
// const NP = require('number-precision')
const WXAPI = require('../../utils/request')
const { accAdd, accMul } = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    spinShow:false,
    cartInStocks: [],
    cartSellOut: {},
    visible: false,
    modelType: '2',  //单个按钮的 ‘2’两个按钮的
    modeltitle: '提示',
    modeldes: '超出10分钟付款时间，订单取消～',
    btntext: '我知道了',
    btntext1: '取消',
    btntext2: '确定',
    cartId: null,
    parentIndes: null,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '购物车', //导航栏 中间的标题
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
    const spinShow = true
    this.loadingView(spinShow)
    this.reqCar()
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
    const spinShow = true
    this.loadingView(spinShow)
    this.reqCar()
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
  //购物车查询
  reqCar: function () {
    const _this = this
    WXAPI.getCarList().then(function (res) {
      setTimeout(function () {
        _this.loadingView(false)
      }, 500)

      if (res.code == '0') {
        const resData = res.data || {}
        const cartInStocks = resData.cartInStocks || []
        const cartSellOut = resData.cartSellOut || {}
        for (var i = 0; i < cartInStocks.length; i++) {
          if (cartInStocks[i].skus) {
            //根据当前的skus添加isSelect
            for (var j = 0; j < cartInStocks[i].skus.length; j++) {
              cartInStocks[i].skus[j].isSelect = true
            }
          }
        }
        _this.setData({
          cartInStocks: _this.getSelectGoodsInfo(cartInStocks),
          cartSellOut: cartSellOut
        })

      } else {

      }
    })
  },

  //删除购物车
  deqCar: function (e) {
    const _this = this
    const cartId = e.currentTarget.dataset.cartid
    const parentIndes = e.currentTarget.dataset.parentindes
    console.log('e', e)
    _this.setData({
      cartId: cartId,
      parentIndes: parentIndes
    })

    const data = {
      visible: true,
      modelType: '2',  //单个按钮的 ‘2’两个按钮的
      modeltitle: '提示',
      modeldes: '确认要删除此商品吗',
      btntext1: '取消',
      btntext2: '确认'
    }
    _this.setPop(data)
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
  //pop 确认按钮
  handleSure: function () {
    const _this = this
    const cartId = _this.data.cartId
    const parentIndes = _this.data.parentIndes
    console.log('cartId', cartId)
    WXAPI.deleteCar(cartId).then(function (res) {
      if (res.code == '0') {
        _this.closePop()
        _this.reqCar()
      } else {

      }
    })
  },
  // 前端点击按钮库存校验
  isHasInv: function (list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].qty > list[i].inventory) {
        return false
      }
    }
    return true
  },



  //品牌结算
  brandPaying: function (e) {
    const _this = this
    if (_this.data.hasUserInfo){
      //先根据购物车id去更新信息，然后跳转到提单页
      const cartindex = e.currentTarget.dataset.cartindex
      const cartInStocks = this.data.cartInStocks
      console.log('cartindex', cartindex)
      console.log('cartInStocks', cartInStocks)
      if (cartInStocks[cartindex].qtySum > 0 && cartInStocks[cartindex].qtySum >= cartInStocks[cartindex].limitQty) {
        const canisHasInv = _this.isHasInv(cartInStocks[cartindex].skus)
        console.log('canisHasInv', canisHasInv)
        if (!canisHasInv) {
          const data = {
            visible: true,
            modelType: '1',  //单个按钮的 ‘2’两个按钮的
            modeltitle: '提示',
            modeldes: `商品剩余库存不足`,
            btntext: '我知道啦',
          }
          _this.setPop(data)
        } else {
          //后端库存校验
          WXAPI.getSureInv(cartInStocks[cartindex]).then(res => {
            if (res.code == '0') {
              //跳转
              wx.navigateTo({
                url: `../ordersure/ordersure?cartindex=${cartindex}&pageFrom=1`
              })
            } else {
              //弹窗
              const data = {
                visible: true,
                modelType: '1',  //单个按钮的 ‘2’两个按钮的
                modeltitle: '提示',
                modeldes: `商品剩余库存不足`,
                btntext: '我知道啦',
              }
              _this.setPop(data)
            }
          })
        }
      } else {
        //弹窗
        const data = {
          visible: true,
          modelType: '1',  //单个按钮的 ‘2’两个按钮的
          modeltitle: '提示',
          modeldes: `商品需要满${cartInStocks[cartindex].limitQty}件才可以购买哦～`,
          btntext: '我知道啦',
        }
        _this.setPop(data)
      }
    }else{
      _this.goUser()
    }
  },
  //选中与非选中change
  changeSelect: function (e) {
    const _this = this
    console.log(e)
    const isSelect = e.currentTarget.dataset.select
    const parentIndes = e.currentTarget.dataset.parentindes
    const childidx = e.currentTarget.dataset.index
    const cartInStocks = _this.data.cartInStocks
    console.log(cartInStocks)
    console.log(parentIndes)
    console.log(childidx)
    cartInStocks[parentIndes].skus[childidx].isSelect = !isSelect
    this.setData({
      cartInStocks: _this.getSelectGoodsInfo(cartInStocks)
    })
  },
  //计算选中商品总数量以及总价格
  getSelectGoodsInfo: function (list) {
    for (var z = 0; z < list.length; z++) {
      list[z].amountSum = 0
      list[z].qtySum = 0
      for (var m = 0; m < list[z].skus.length; m++) {
        if (list[z].skus[m].isSelect) {
          // list[z].amountSum = list[z].amountSum + (list[z].skus[m].qty * list[z].skus[m].skuRetailPrice)
          list[z].amountSum = accAdd(list[z].amountSum, accMul(list[z].skus[m].qty, list[z].skus[m].skuRetailPrice))
          list[z].qtySum = accAdd(list[z].qtySum, list[z].skus[m].qty)
        }
      }
    }
    app.globalData.carData = list
    console.log('111',app.globalData.carData)
    return list
  },
  //qty change
  handleChange(e) {
    console.log(123)
    const _this = this
    const value = e.detail.value
    const cartInStocks = _this.data.cartInStocks
    const parentIndes = e.currentTarget.dataset.parentindes
    const childidx = e.currentTarget.dataset.index
    const data = {
      cartId: cartInStocks[parentIndes].skus[childidx].cartId,
      qtyChange: value
    }
    WXAPI.editNumCar(data).then(function (res) {
      if (res.code == '0') {
        cartInStocks[parentIndes].skus[childidx].qty = e.detail.value
        _this.setData({
          cartInStocks: _this.getSelectGoodsInfo(cartInStocks)
        })
      } else {

      }
    })
  },

  //控制loading
  loadingView: function (spinShow) {
    this.setData({
      spinShow: spinShow
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
  goUser:function(){
    wx.switchTab({
      url: '../user/user'
    })
  },
  // onPageScroll: function (t) {
  //   const e = t.scrollTop;
  //   console.log('eee', e)
  //   console.log('this.data.systemInfo', this.data.systemInfo)
  //   if (e < this.data.systemInfo.statusBarHeight) {
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


