// pages/goodsinfo/goodsinfo.js
const WXAPI = require('../../utils/request')
const { $Toast } = require('../../dist/base/index');
const app = getApp()
const { accAdd, accMul } = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
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
      bgcolor: 'transparent',
      textcolor: 'transparent'
    },
    height: app.globalData.statusBarHeight * 2 + 20,
    systemInfo: {},
    isIphoneX: false,
    backFirst: false,
    cartNum: 0,
    submittype: '1',
    specAttrName1: null,
    specAttrName2: null,
    shareSheetShow: false,
    shareSpuPicUrl: null,
    showShareImg: false,
    product:null
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
      backFirst: backFirst
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
    this.setData({
      shareSheetShow:false
    })


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
        const product={
          item_code: data.id,
          title: resData.spuName,
          desc: resData.sellPoint,
          category_list: [resData.brandName],
          image_list: resData.pics,
          src_mini_program_path: `/pages/goodsinfo/goodsinfo?goodsId=${data.id}`,
          brand_info:{
            "name": "墨集严选",
            "logo": "http://b2c.losinx.com/index-img.png"
          },
        }
        _this.setData({
          goodsInfo: resData,
          spuDetail: resData.spuDetail || [],
          pics: resData.pics || [],
          goodsId: data.id,
          product: product
        })
      }
    })
  },

  //加入购物车pop
  addCar: function (e) {
    console.log('e', e)
    //判断是加入购物车还是立即购买
    const submittype = e.currentTarget.dataset.submit
    this.setData({
      submittype: submittype
    })
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
          content: res.msg
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
            if (specAttr1[i].specAttrId == data.specAttrId1) {
              specAttr1[i].isSelect = true
            } else {
              specAttr1[i].isSelect = false
            }
          }
        }
        if (specAttr2.length > 0) {
          for (var i = 0; i < specAttr2.length; i++) {
            if (specAttr2[i].specAttrId == data.specAttrId2) {
              specAttr2[i].isSelect = true
            } else {
              specAttr2[i].isSelect = false
            }
          }
        }

        const specAttrId1 = data.specAttrId1
        const specAttrId2 = data.specAttrId2

        console.log('specAttr1', specAttr1)
        console.log('specAttr2', specAttr2)
        const specAttrName1arr = specAttr1.filter((item) => {
          return item.specAttrId == specAttrId1
        })
        const specAttrName2arr = specAttr2.filter((item) => {
          return item.specAttrId == specAttrId2
        })
        _this.setData({
          specAttrName1: specAttrName1arr.length > 0 ? specAttrName1arr[0].specAttrName : null,
          specAttrName2: specAttrName2arr.length > 0 ? specAttrName2arr[0].specAttrName : null,
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
    const submittype = this.data.submittype
    if (hasUserInfo) {
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
        //判断是直接购买还是加入购物车
        if (submittype == '1') {
          _this.addCarReq()
        }
        if (submittype == '2') {
          //收集数据，跳转订单确认页面
          _this.onbuy()
        }
      } else {
        $Toast({
          content: '请输入购物数量'
        });
      }
    } else {
      $Toast({
        content: '请登录'
      });
      setTimeout(function () {
        _this.goUser()
      }, 2000)
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
        if (cliceIsselect.length > 0 && cliceIsselect[0].specAttrId == specAttrId) {
          //当前已经选中，这里是点击取消
          _this.getInventory(null, otherspecAttrId)
        } else {
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
    for (var i = 0; i < spuDetail.length; i++) {
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
  navback: function () {
    console.log('this.data.backFirst', this.data.backFirst)
    this.data.backFirst ? wx.switchTab({
      url: "../index/index"
    }) : wx.navigateBack();
  },
  goCartPage: function () {
    wx.switchTab({
      url: "../shoppingcart/shoppingcart"
    })
  },

  addCarReq: function () {
    const _this =this
    const data = {
      qty: _this.data.buyqty,
      skuId: _this.data.skuId,
      spuId: _this.data.goodsId
    }
    WXAPI.addCar(data).then(function (res) {
      if (res.code == '0') {
        _this.setData({
          visible: false,
          cartNum: _this.data.cartNum + _this.data.buyqty
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
  },
  //立即购买
  onbuy: function () {
    const _this = this
    const specAttrName1 = _this.data.specAttrName1
    const specAttrName2 = _this.data.specAttrName2
    const qty = _this.data.buyqty
    const skuId = _this.data.skuId
    const spuId = _this.data.goodsId
    const skuPic = _this.data.skuPic
    const spuName = _this.data.goodsInfo.spuName
    const specAttrStr = specAttrName2 ? `${specAttrName1}/${specAttrName2}` : `${specAttrName1}`
    const skuRetailPrice = _this.data.skuRetailPrice
    const amountSum = accMul(qty, skuRetailPrice)

    wx.navigateTo({
      url: `../ordersure/ordersure?pageFrom=2&qty=${qty}&skuId=${skuId}&spuId=${spuId}&skuPic=${skuPic}&spuName=${spuName}&specAttrStr=${specAttrStr}&skuRetailPrice=${skuRetailPrice}&amountSum=${amountSum}`
    })
  },
  shareButtonMethod: function () {
    console.log('123')
    this.setData({
      shareSheetShow: true
    });
  },
  getSharePic: function () {
    this.setData({
      shareSheetShow: false
    })
    if (this.data.shareSpuPicUrl) {
      this.setData({
        showShareImg: true
      })
    } else {
      this.createSharePic()
    }
  },
  createSharePic: function () {
    const _this = this
    wx.showLoading({
      title: "正在生成海报..."
    });
    //商品图
    const picitem = new Promise(function (resolve, reject) {
      console.log(_this.data.pics[0])
      wx.getImageInfo({
        src: _this.data.pics[0],
        success: function (t) {
          resolve(t);
        }
      });
    })
    //背景图
    const bgitem = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: "../../images/bgshare.png",
        success: function (e) {
          resolve(e);
        }
      });
    })
    //商品小程序码图片
    const sharecodeImg = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: "../../images/sharecode.jpeg",
        success: function (t) {
          resolve(t);
        }
      });
    });
    Promise.all([picitem, bgitem, sharecodeImg]).then(function (e) {
      console.log(e)
      const shareSpuImg = wx.createCanvasContext("shareSpuImg");
      let goodsTitle = _this.data.goodsInfo.spuName;
      let goodsdes = _this.data.goodsInfo.sellPoint
      const priceStr = _this.data.goodsInfo.priceStr
      let tagtext = ['档口爆款', '紧跟潮流']
      //图片
      shareSpuImg.drawImage("../../" + e[1].path, 0, 0, 750, 1334)
      shareSpuImg.drawImage(e[0].path, 57, 181, 636, 636)
      shareSpuImg.drawImage("../../" + e[2].path, 515, 1e3, 166, 166)
      shareSpuImg.save()


      

      //title
      shareSpuImg.setTextAlign("left"),
      shareSpuImg.setFillStyle("#484A4C")
      shareSpuImg.setFontSize(40)
      shareSpuImg.setTextBaseline("top");
      if (goodsTitle.length > 18) {
        goodsTitle = goodsTitle.substring(0, 18) + "..."
      }
      shareSpuImg.fillText(goodsTitle, 58, 855.5, 634)
      shareSpuImg.fillText(goodsTitle, 58.5, 855, 634)
      shareSpuImg.fillText(goodsTitle, 58, 855, 634)
      shareSpuImg.fillText(goodsTitle, 58, 854.5, 634)
      shareSpuImg.fillText(goodsTitle, 57.5, 855, 634)

      shareSpuImg.save()
      //des
      shareSpuImg.setFontSize(24)
      goodsdes.length < 32 ? shareSpuImg.fillText(goodsdes, 58, 915, 634) : shareSpuImg.fillText(goodsdes.substring(0, 32), 58, 915, 634)
      goodsdes.length < 64 ? shareSpuImg.fillText(goodsdes.substring(32), 58, 948, 634) : shareSpuImg.fillText(goodsdes.substring(32, 64) + "...", 58, 948, 634)
      
      //tag
      shareSpuImg.setFontSize(22)
      shareSpuImg.setFillStyle("#CA9D00")
      shareSpuImg.fillText(tagtext[0], 58, 1002, 100)
      shareSpuImg.setStrokeStyle("#161C35")
      shareSpuImg.moveTo(164, 1002)
      shareSpuImg.lineTo(164, 1024)
      shareSpuImg.fillText(tagtext[1], 180, 1002, 100)
      
      //价格
      shareSpuImg.setFillStyle("#161C35"),
      shareSpuImg.setFontSize(58);
      shareSpuImg.fillText(priceStr, 82.5, 1073, 250)

      //分享
      // const p = '墨集严选';
      // shareSpuImg.setFillStyle("#B2B2B2")
      // shareSpuImg.setFontSize(22);
      // shareSpuImg.fillText(p, 58, 1190, 400)
      shareSpuImg.stroke()
      shareSpuImg.draw()
      setTimeout(function () {
        _this.canvasToTempFile();
      }, 2000);
    })
  },

  canvasToTempFile: function () {
    var t = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 750,
      height: 1334,
      destWidth: 750,
      destHeight: 1334,
      canvasId: "shareSpuImg",
      success: function (e) {
        wx.hideLoading()
        console.log('ee', e)
        t.setData({
          shareSpuPicUrl: e.tempFilePath,
          showShareImg: !0
        });
      },
      fail: function (t) {
        wx.hideLoading()
        wx.showToast({
          title: "海报生成失败，请重试",
          icon: "none"
        });
      }
    });
  },
  saveImageToPhoto: function () {
    var t = this;
    wx.saveImageToPhotosAlbum({
      filePath: t.data.shareSpuPicUrl,
      success: function (e) {
        wx.showToast({
          title: "已保存到手机相册，赶快去分享吧~",
          icon: "none"
        }), t.setData({
          showShareImg: true
        });
      },
      fail: function (t) {
        wx.showModal({
          title: "授权提示",
          content: "保存海报到手机相册需要你的微信授权，请在设置中授权「相册」。",
          confirmColor: "#5f7fdc",
          success: function (t) {
            t.confirm && wx.openSetting();
          }
        });
      }
    });
  },
  drawText: function (t) {
    this.ctx.save(), this.ctx.setFillStyle(t.color), this.ctx.setFontSize(t.size), this.ctx.setTextAlign(t.align),
      this.ctx.setTextBaseline(t.baseline), t.bold && (this.ctx.fillText(t.text, t.x, t.y - .5),
        this.ctx.fillText(t.text, t.x - .5, t.y), this.ctx.fillText(t.text, t.x, t.y + .5),
        this.ctx.fillText(t.text, t.x + .5, t.y)), this.ctx.fillText(t.text, t.x, t.y),
      this.ctx.restore();
  },
  textWrap: function (t) {
    for (var e = Math.ceil(t.width / t.size), a = Math.ceil(t.text.length / e), s = 0; s < a; s++) {
      var o = {
        x: t.x,
        y: t.y + s * t.height,
        color: t.color,
        size: t.size,
        align: t.align,
        baseline: t.baseline,
        text: t.text.substring(s * e, (s + 1) * e),
        bold: t.bold
      };
      s < t.line && (s == t.line - 1 && (o.text = o.text.substring(0, o.text.length - 3) + "......"),
        this.drawText(o));
    }
  },
  recommendInfoCopyMethod: function () {
    var t = this;
    wx.setClipboardData({
      data: t.data.spuInfo.pdItem.pdItemInfo.description,
      success: function (t) {
        wx.showToast({
          title: "文案复制成功",
          icon: "none"
        });
      }
    });
  },
  recommendInfoCopyMethod: function () {
    var _this = this;
    wx.setClipboardData({
      data: _this.data.goodsInfo.sellPoint,
      success: function (t) {
        wx.showToast({
          title: "文案复制成功",
          icon: "none"
        });
      }
    });
  },
  shareSheetShowHandle: function () {
    this.setData({
      shareSheetShow: false
    });
  },
  onPageScroll: function (t) {
    const e = t.scrollTop;
    console.log('eee', e)
    console.log('this.data.systemInfo', this.data.systemInfo)
    if (e < this.data.systemInfo.statusBarHeight) {
      this.setData({
        nvabarData: {
          showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
          title: '商品详情', //导航栏 中间的标题
          bgcolor: 'transparent',
          textcolor: 'transparent'
        }
      })
    } else {
      this.setData({
        nvabarData: {
          showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
          title: '商品详情', //导航栏 中间的标题
          bgcolor: '#fff',
          textcolor: '#161C35'
        }
      })
    }
  },
  hideShareImg: function () {
    this.setData({
      showShareImg: false
    });
  },
})