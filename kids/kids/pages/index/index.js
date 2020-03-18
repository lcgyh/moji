//index.js
//获取应用实例
const app = getApp()
const WXAPI = require('../../utils/request')
const {
  $Toast
} = require('../../dist/base/index');

Page({
  data: {
    swiperCurrent: 0,
    loaded: false,
    hasUserInfo:false,
    visible: false,
    title: "",
    spinShow: false,
    bannerList: [],
    activitySkills: [],
    activityDisocunts: [],
    activityNews: [],
    activityPopulars: [],
    current: 1,
    loadMorelist: [
      {
        current: 1,
        type: '1',
        isGetAll: false,
        getMoreText: '查看更多',
        getMoreTextLoad: false,
      }, {
        current: 1,
        type: '2',
        isGetAll: false,
        getMoreText: '查看更多',
        getMoreTextLoad: false,
      }, {
        current: 1,
        type: '3',
        isGetAll: false,
        getMoreText: '查看更多',
        getMoreTextLoad: false,
      }, {
        current: 1,
        type: '4',
        isGetAll: false,
        getMoreText: '查看更多',
        getMoreTextLoad: false,
      }
    ],
    navHehght: app.globalData.statusBarHeight,
    navHehghtText: app.globalData.statusBarHeight + 12
  },
  onLoad: function (options) {
    const spinShow = true
    this.loadingView(spinShow)
    const current = this.data.current
    this.getDataReq(current)
    this.getOpenId()

  },
  onPullDownRefresh: function () {
    const spinShow = true
    this.loadingView(spinShow)
    this.setData({
      activitySkills: [],
      activityDisocunts: [],
      activityNews: [],
      activityPopulars: [],
      current: 1,
    }, function () {
      this.getDataReq(1)
      // wx.hideNavigationBarLoading();//隐藏导航条加载动画。
      wx.stopPullDownRefresh()
    })
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
  //获取banner List 
  getBannerList: function () {
    return WXAPI.getBanner()
  },
  //get goodList
  getGoodList: function (data) {
    return WXAPI.getGoodList(data)
  },
  //获取页面请求
  getDataReq: function (current) {
    const _this = this
    Promise.all([_this.getBannerList(), _this.getTypeGoods('1', 1), _this.getTypeGoods('2', 1), _this.getTypeGoods('3', 1), _this.getTypeGoods('4', 1)]).then(res => {
      setTimeout(function () {
        _this.loadingView(false)
      }, 500)
      if (res[0].code == '0' && res[1].code == '0' && res[2].code == '0' && res[3].code == '0' && res[4].code == '0') {
        const res0Data = res[0].data || []
        const bannerList = res0Data || []
        const res1Data = res[1].data || {}
        const res2Data = res[2].data || {}
        const res3Data = res[3].data || {}
        const res4Data = res[4].data || {}
        _this.setData({
          bannerList: bannerList || [],
        })
        _this.setGoodsItem('1', res1Data.list, res1Data.total, res1Data.pageNum)
        _this.setGoodsItem('2', res2Data.list, res2Data.total, res2Data.pageNum)
        _this.setGoodsItem('3', res3Data.list, res3Data.total, res3Data.pageNum)
        _this.setGoodsItem('4', res4Data.list, res4Data.total, res4Data.pageNum)
      } else {
        _this.errMessage('api err')
      }
    })
  },
  //跳转商品详情
  goGoodsInfo: function (e) {
    let goodsId
    if (e.detail && e.detail.goodsId) {
      goodsId = e.detail.goodsId
    } else {
      goodsId = e.currentTarget.dataset.goodsid
    }
    if (goodsId) {
      wx.navigateTo({
        url: `../goodsinfo/goodsinfo?goodsId=${goodsId}`
      })
    }
  },
  //查看更多文字点击
  getMore: function (e) {
    const _this = this
    const activityType = e.currentTarget.dataset.type
    const loadMorelist = _this.data.loadMorelist || []
    const itemLoadMore = loadMorelist[Number(activityType) - 1] || {}
    if (!itemLoadMore.isGetAll) {
      itemLoadMore.getMoreText = null
      itemLoadMore.getMoreTextLoad = true
      loadMorelist[Number(activityType) - 1] = itemLoadMore
      _this.setData({
        loadMorelist: loadMorelist,
      })
      const result = _this.getTypeGoods(activityType, itemLoadMore.current + 1)
      result.then(res => {
        if (res.code == '0') {
          const resData = res.data || {}
          _this.setGoodsItem(activityType, resData.list, resData.total, resData.pageNum)
        }
      })
    }
  },

  //判断当前type是否请求全部数据
  isGetAll: function (total, currentNum) {
    if (currentNum == total) {
      return true
    }
    return false
  },
  //首页商品获取
  getTypeGoods: function (type, current) {
    const _this = this
    const data = {
      current: current,
      pageSize: 10,
      type: type
    }
    const result = WXAPI.getGoodList(data)
    return result

  },
  //设计对应商品
  setGoodsItem: function (type, list, total, current) {
    const _this = this
    const loadMorelist = _this.data.loadMorelist.slice(0) || []
    if (type == '1') {
      // return 'activitySkills' 
      const activitySkills = _this.data.activitySkills.concat(list) || []
      const isGetAll = _this.isGetAll(total, activitySkills.length)
      loadMorelist[Number(type) - 1] = {
        isGetAll: isGetAll,
        getMoreText: isGetAll ? '已经到底了' : '查看更多',
        getMoreTextLoad: false,
        type: type,
        current: current
      }
      _this.setData({
        activitySkills: activitySkills,
        loadMorelist: loadMorelist
      })
    }
    if (type == '2') {
      // return 'activityPopulars'
      const activityPopulars = _this.data.activityPopulars.concat(list) || []
      const isGetAll = _this.isGetAll(total, activityPopulars.length)
      loadMorelist[Number(type) - 1] = {
        isGetAll: isGetAll,
        getMoreText: isGetAll ? '已经到底了' : '查看更多',
        getMoreTextLoad: false,
        type: type,
        current: current
      }

      _this.setData({
        activityPopulars: activityPopulars,
        loadMorelist: loadMorelist
      })

    }
    if (type == '3') {
      // return 'activityNews'
      const activityNews = _this.data.activityNews.concat(list) || []
      const isGetAll = _this.isGetAll(total, activityNews.length)
      loadMorelist[Number(type) - 1] = {
        isGetAll: isGetAll,
        getMoreText: isGetAll ? '已经到底了' : '查看更多',
        getMoreTextLoad: false,
        type: type,
        current: current
      }
      _this.setData({
        activityNews: activityNews,
        loadMorelist: loadMorelist
      })

    }
    if (type == '4') {
      // return 'activityDisocunts'
      const activityDisocunts = _this.data.activityDisocunts.concat(list) || []
      const isGetAll = _this.isGetAll(total, activityDisocunts.length)
      loadMorelist[Number(type) - 1] = {
        isGetAll: isGetAll,
        getMoreText: isGetAll ? '已经到底了' : '查看更多',
        getMoreTextLoad: false,
        type: type,
        current: current
      }
      _this.setData({
        activityDisocunts: activityDisocunts,
        loadMorelist: loadMorelist
      })
    }
  },

  


  // ————————————

  //获取openId
  getOpenId: function () {
    const _this = this
    const token = wx.getStorageSync('token')
    if (token) {
      wx.clearStorageSync()
    }
    wx.login({
      success: res => {
        // 发送 res.code到后台
        const data = {
          code: res.code,
        }
        WXAPI.getOpenId(data).then(function (res) {
          if (res.code == '0') {
            const openId = res.data
            wx.setStorageSync('openId', openId)
            _this.getToken(openId)
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
  //根据openId获取token
  getToken: function (openId) {
    const _this = this
    const data = {
      openId: openId
    }
    WXAPI.getToken(data).then(function (res) {
      if (res.code == '0') {
        //成功拿到token,说明以前已经绑定,状态为登录中，同时根据tokng去获取用户信息
        //没有拿到token，则说明以前用户没有注册过，则用户状态为未登录
        if (res.data) {
          wx.setStorageSync('token', res.data)
          app.globalData.hasUserInfo = true
          _this.setData({
            hasUserInfo: true
          })
        } else {
          //设置用户值
          app.globalData.hasUserInfo = false
          _this.setData({
            hasUserInfo: false
          })
        }
      } else {
        //结束loading
        const spinShow = false
        // _this.loadingView(spinShow)
        // _this.errMessage(res.msg)
      }
    })
  },
  
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },


  onShareAppMessage: function () {

  },
})
