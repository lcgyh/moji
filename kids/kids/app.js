//app.js
App({
  onLaunch: function () {
    const that = this;
    //监测新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000,
          complete: function () {

          }
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    });


    wx.getSystemInfo({
      success: function (res) {
        that.globalData.statusBarHeight = res.statusBarHeight
      }
    })
    
   
    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // this.loadFont()
    // 获取用户信息
    this.loadFont()
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    
  },

  onShow(options) {
    // Do something when show.
    
  },
  globalData: {
    isConnected: true
  },

  loadFont: function () {
    wx.loadFontFace({
      global: true,
      family: 'FZFangSong-Z02S',
      source: 'url("https://b2c.losinx.com/conf/FZFangSong-Z02S0.TTF")',
      success: function (res) {
        console.log('FZFangSong-Z02S', res)
      },
      fail: function (err) {
        console.log('FZFangSong-Z02S', err)
      }
    })
    // wx.loadFontFace({
    //   global: true,
    //   family: 'STHeitiMedium',
    //   source: 'url("https://b2c.losinx.com/conf/STHeiti_Medium.ttc")',
    //   success: function (res) {
    //     console.log('STHeitiMedium', res)
    //   },
    //   fail: function (err) {
    //     console.log('STHeitiMedium', err)
    //   }
    // })
  }
  
})