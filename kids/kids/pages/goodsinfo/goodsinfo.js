// pages/goodsinfo/goodsinfo.js
const WXAPI = require('../../utils/request')
const { $Toast } = require('../../dist/base/index');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo:false,
    visible: false,
    buyqty: 1,
    goodsInfo: {},
    spuDetail: [],
    pics: [],
    goodsId: null,
    spec1: null,
    spec2: null,
    specAttr1: [],
    specAttr2: [],
    qty: 0,
    skuPic: null,
    skuRetailPrice: 0,
    skuId: null,
    specAttrId1: null,
    specAttrId2: null,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '商品详情', //导航栏 中间的标题
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
    console.log('options', options)
    const backFirst = options.backFirst
    const goodsId = options.goodsId
    const systemInfo = wx.getSystemInfoSync()
    console.log('systemInfo', systemInfo)
    const isIphoneX = systemInfo.model.search("iPhone X") != -1
    this.setData({
      goodsId: goodsId,
      systemInfo: systemInfo,
      isIphoneX: isIphoneX,
      backFirst:backFirst
    }, function () {
      const data = {
        id: goodsId
      }
      this.getGoodsInfo(data)
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
  onShow: function (query) {
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
    const data = {
      id: this.data.goodsId
    }
    this.getGoodsInfo(data)
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
    const goodsId = this.data.goodsId
    return {
      path: `/pages/goodsinfo/goodsinfo?backFirst=true&goodsId=${goodsId}`
    }
  },
  //购物车pop关闭
  handleCancel: function () {
    this.setData({
      visible: false
    });
  },
  //库存数量输入
  handleChange({ detail }) {
    this.setData({
      buyqty: detail.value
    })
  },

  //获取商品详情
  getGoodsInfo: function (data) {
    const _this = this
    WXAPI.getGoodsInfo(data).then(res => {
      if (res.code == '0') {
        const resData = res.data || {}
        _this.setData({
          goodsInfo: resData,
          spuDetail: resData.spuDetail || [],
          pics: resData.pics || [],
          goodsId: data.id
        })
      }
    })
  },

  //加入购物车pop
  addCar: function () {
    this.getSpecs()
  },


  //获取规格信息
  getSpecs: function () {
    const _this = this
    const data = {
      spuId: _this.data.goodsId
    }
    WXAPI.getSpecsList(data).then(function (res) {
      if (res.code == '0') {
        const resData = res.data || {}
        console.log(resData)
        const specAttr1 = resData.specAttr1 || []
        const specAttr2 = resData.specAttr2 || []
        if (specAttr1.length > 0) {
          for (var i = 0; i < specAttr1.length; i++) {
            specAttr1[i].isSelect = false
          }
        }
        if (specAttr2.length > 0) {
          for (var i = 0; i < specAttr2.length; i++) {
            specAttr2[i].isSelect = false
          }
        }

        const specAttrId1 = null
        const specAttrId2 = null
        _this.setData({
          spec1: resData.spec1,
          spec2: resData.spec2,
          specAttr1: specAttr1,
          specAttr2: specAttr2,
          visible: true,
          qty: 0,
          skuPic: resData.skuPic,
          skuRetailPrice: resData.skuRetailPrice,
          skuId: null,
          specAttrId1: specAttrId1,
          specAttrId2: specAttrId2
        })

      } else {
        $Toast({
          content:res.msg
        });
      }
    })
  },



  //根据规格请求库存信息
  getInventory: function (specAttrId1, specAttrId2) {
    const _this = this
    const data = {
      specAttrId1: specAttrId1,
      specAttrId2: specAttrId2,
      spuId: _this.data.goodsId
    }
    console.log('specAttrId1--ab', specAttrId1)
    WXAPI.getInventory(data).then(function (res) {
      if (res.code == '0') {
        const resData = res.data || {}
        const specAttr1 = resData.specAttr1 || []
        const specAttr2 = resData.specAttr2 || []
        if (specAttr1.length > 0) {
          for (var i = 0; i < specAttr1.length; i++) {
            if (specAttr1[i].specAttrId == data.specAttrId1){
              specAttr1[i].isSelect = true 
            }else{
              specAttr1[i].isSelect = false
            }
          }
        }
        if (specAttr2.length > 0) {
          for (var i = 0; i < specAttr2.length; i++) {
            if (specAttr2[i].specAttrId == data.specAttrId2){
              specAttr2[i].isSelect=true
            }else{
              specAttr2[i].isSelect = false
            }
          }
        }

        const specAttrId1 = data.specAttrId1
        const specAttrId2 = data.specAttrId2

        _this.setData({
          // spec1: resData.spec1,
          // spec2: resData.spec2,
          specAttr1: specAttr1,
          specAttr2: specAttr2,
          qty: resData.qty || 0,
          skuPic: resData.skuPic,
          skuRetailPrice: resData.skuRetailPrice,
          skuId: resData.skuId,
          specAttrId1: specAttrId1,
          specAttrId2: specAttrId2
        })
      } else {

      }
    })
  },

  //加入购物车确定
  addCarSure: function () {
    const _this = this 
    const hasUserInfo = this.data.hasUserInfo
    if (hasUserInfo){
      const specAttr1 = this.data.specAttr1
      const specAttr2 = this.data.specAttr2
      const specAttrId1 = this.data.specAttrId1
      const specAttrId2 = this.data.specAttrId2


      console.log('specAttr1', specAttr1)
      console.log('specAttr2', specAttr2)
      console.log('specAttrId1', specAttrId1)
      console.log('specAttrId2', specAttrId2)
      if (specAttr1.length > 0 && !specAttrId1) {
        $Toast({
          content: '请选择商品属性'
        });
        return
      }
      if (specAttr2.length > 0 && !specAttrId2) {
        $Toast({
          content: '请选择商品属性'
        });
        return
      }

      if (_this.data.buyqty > 0) {
        const data = {
          qty: _this.data.buyqty,
          skuId: _this.data.skuId,
          spuId: _this.data.goodsId
        }
        WXAPI.addCar(data).then(function (res) {
          if (res.code == '0') {
            _this.setData({
              visible: false
            }, function () {
              $Toast({
                content: '成功加入购物车，去购物车页面结算'
              });
            })
          } else {
            $Toast({
              content: res.msg
            });
          }
        })
      } else {
        $Toast({
          content: '请输入购物数量'
        });
      }
  }else{
      $Toast({
        content: '请登录'
      });
    setTimeout(function(){
      _this.goUser()
    },2000)
  }

    
  },
  //规格选中于取消
  tabSelect: function (e) {
    console.log(e)
    const _this = this
    const isInvalid = e.currentTarget.dataset.isinvalid
    if (isInvalid == '1') {
      const specAttr = e.currentTarget.dataset.specattr
      const specAttrId = e.currentTarget.dataset.specattrid
      const specAttr1 = _this.data.specAttr1
      const specAttr2 = _this.data.specAttr2
      if (specAttr == '1') {
         //判断specAttrId当前是否已经选中
        const cliceIsselect = specAttr1.filter((item) => {
          return item.isSelect == true
        })
        const otherspecs = specAttr2.filter((item) => {
          return item.isSelect == true
        })
        const otherspecAttrId = otherspecs.length > 0 ? otherspecs[0].specAttrId : null
        console.log('cliceIsselect', cliceIsselect)
        console.log('specAttrId', specAttrId)
        if (cliceIsselect.length>0 && cliceIsselect[0].specAttrId == specAttrId){
          //当前已经选中，这里是点击取消
          _this.getInventory(null, otherspecAttrId)
        }else{
          //当前没有选中，这里是点击选中
          _this.getInventory(specAttrId, otherspecAttrId)
        }
      }
      if (specAttr == '2') {
        const cliceIsselect = specAttr2.filter((item) => {
          return item.isSelect == true
        })
        const otherspecs = specAttr1.filter((item) => {
          return item.isSelect == true
        })
        const otherspecAttrId = otherspecs.length > 0 ? otherspecs[0].specAttrId : null

        if (cliceIsselect.length > 0 && cliceIsselect[0].specAttrId == specAttrId) {
          //当前已经选中，这里是点击取消
          _this.getInventory(otherspecAttrId, null)
        } else {
          //当前没有选中，这里是点击选中
          _this.getInventory(otherspecAttrId, specAttrId)
        }
      }
    }
  },
  previewImage: function (e) {
    const index = e.currentTarget.dataset.index
    const spuDetail = this.data.spuDetail
    const newspuDetail = []
    for (var i = 0; i < spuDetail.length;i++){
      newspuDetail.push(spuDetail[i].value)
    }
    wx.previewImage({
      current: newspuDetail[index],
      urls: newspuDetail,
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
  },
  navback:function(){
    console.log('this.data.backFirst', this.data.backFirst)
    this.data.backFirst ? wx.switchTab({
      url: "../index/index"
    }) : wx.navigateBack();
  }

})