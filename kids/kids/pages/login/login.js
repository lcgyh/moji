// pages/login/login.js
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
    spinShow: false,
    accountInput: false,
    userName: '',
    passWord: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this
    const spinShow = true
    this.loadingView(spinShow)
    const token = wx.getStorageSync('token')
    if (token) {
      wx.clearStorageSync()
    }
    _this.getOpenId()
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

  //获取openId
  getOpenId: function () {
    const _this = this
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
            //先判断小程序是否授权
            wx.getSetting({
              success(res) {
                if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                  wx.getUserInfo({
                    success: function (res) {
                      console.log(res.userInfo)
                      app.globalData.userInfo = res.userInfo
                      _this.getToken(openId)
                    }
                  })
                } else {
                  const spinShow = false
                  _this.loadingView(spinShow)
                }
              }
            })
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
        //成功拿到token,说明以前已经绑定,直接进入首页
        //没有拿到token，则说明以前用户信息没有注册,停留当前页面
        if (res.data) {
          wx.setStorageSync('token', res.data)
          wx.switchTab({
            url: '../index/index'
          })
          const spinShow = false
          _this.loadingView(spinShow)
        } else {
          const spinShow = false
          _this.loadingView(spinShow)
        }
      } else {
        //结束loading
        const spinShow = false
        _this.loadingView(spinShow)
        _this.errMessage(res.msg)
      }
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
  //获取微信userInfo
  getUserinfo: function () {
    const _this = this
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        //调用登录接口
        _this.userLogin()
      },
    })
  },
  //手机号输入框输入
  bindKeyInput: function (e) {
    const value = e.detail.value
    let accountInput = value.length > 0 ? true : false
    this.setData({
      accountInput: accountInput,
      userName: value
    })
  },
  //密码输入
  passWordInput: function (e) {
    this.setData({
      passWord: e.detail.value
    })
  },
  //用户登录
  userLogin: function () {
    const _this = this
    const data = {
      userName: _this.data.userName,
      passWord: _this.data.passWord,
      openId: wx.getStorageSync('openId')
    }
    WXAPI.userLogin(data).then(function (res) {
      if (res.code == '0') {
        wx.setStorageSync('token', res.data)
        wx.switchTab({
          url: '../index/index'
        })
      } else {
        const spinShow = false
        _this.loadingView(spinShow)
        _this.errMessage(res.msg)
      }
    })
  },

  modelOk: function () {
    console.log(1)
  },
  modelCancel: function () {
    console.log(2)
  }
})