const Domains = require('../config.js')
import { obj2params, getUrlData} from './util.js'
const env = 'test'

const request = (Domain, url, method, data) => {
  let _url = Domains[env][Domain] + url
  return new Promise((resolve, reject) => {
    let header = {
      'Accept': 'application/json',
      'content-type': "application/json",
    }
    const token = wx.getStorageSync('token')
    if (token) {
      // header["Authorization"] = "Bearer " + token;
      header["token"] = token;
    }
    wx.request({
      url: _url,
      method: method,
      header: header,
      data: data,
      success(request) {
        resolve(request.data)
      },
      fail(error) {
        reject(error)
      },
      complete(res) {
        //假如页面已经在login，则不在跳转登录
        if (res && res.data && res.data.code =='604'){
          let pages = getCurrentPages();
          let currPage = null;
          if (pages.length) {
            currPage = pages[pages.length - 1];
          }
          if (currPage.route != "pages/user/user") {
            wx.clearStorageSync()
            wx.navigateTo({
              url: `../user/user`
            })
          } 
        }
      }
    })
  })
}


Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}

module.exports = {
  request,
  getOpenId: (data) => {
    let url = `/openId?code=${data.code}`
    return request('app', url, 'post')
  },
  getToken:(data)=>{
    let url = `/${data.openId}`
    return request('app', url, 'get')
  },
  userLogin:(data)=>{
    let url = `/user/login`
    return request('app', url, 'post',data)
  },

  //获取banner
  getBanner:()=>{
    let url = `/goods/banner`
    return request('app', url, 'get')
  },
  //获取商品列表
  getGoodList:(data)=>{
    let url = `/index/${data.type}?current=${data.current}&pageSize=${data.pageSize}`
    return request('app', url, 'get')
  },

  //请求商品详情
  getGoodsInfo: (data)=>{
    let url = `/goods`
    if (obj2params(data)) {
      url = `${url}?${obj2params(data)}`
    } 
    return request('app', url, 'get')
  },

  

  //品牌
  getBrandList: (data)=>{
    let url = `/brand`
    if (obj2params(data)) {
      url = `${url}?${obj2params(data)}`
    } 
    return request('app', url, 'get')
  },
  getBrandInfo:(data)=>{
    let url = `/brand/detail`
    if (obj2params(data)) {
      url = `${url}?${obj2params(data)}`
    } 
    return request('app', url, 'get')
  },

  //购物车查询
  getCarList:(data)=>{
    let url = `/cart`
    if (obj2params(data)) {
      url = `${url}?${obj2params(data)}`
    }
    return request('app', url, 'get')
  },
  //添加购物车
  addCar:(data)=>{
    let url = `/cart`
    return request('app', url, 'post', data)
  },
  //删除购物车
  deleteCar: (cartId)=>{
    let url = `/cart/${cartId}`
    return request('app', url, 'delete')
  },
  //购物车数量变更
  editNumCar: (data) => {
    let url = `/cart/${data.cartId}/${data.qtyChange}`
    return request('app', url, 'put')
  },

  //查询订单列表
  getOrderlist: (data)=>{
    let url = `/order/list`
    if (obj2params(data)) {
      url = `${url}?${obj2params(data)}`
    }
    return request('app', url, 'get')
  },
  //查询订单详情
  getOrderInfo:(data)=>{
    const url = getUrlData(`/order/${data.orderId}`)
    return request('app', url, 'get')
  },


  //查询门店信息
  getStoreInfo:()=>{
    const url = getUrlData('/user/shop')
    return request('app', url, 'get')
  },
  //查询规格信息
  getSpecsList:(data)=>{
    const url = `/goods/spu/${data.spuId}`
    return request('app', url, 'get')
  },
  //获取sku信息
  getInventory:(data)=>{
    const url = getUrlData('/goods/spec', data)
    return request('app', url, 'get')
  },
  //获取sku信息
  getAddress:()=>{
    const url = getUrlData('/user/address')
    return request('app', url, 'get')
  },
  //下订单
  submitOrder:(data)=>{
    let url = `/order`
    return request('app', url, 'post', data)
  },
  //后台支付
  payAmount: (data)=>{
    let url = `/order/pay?orderId=${data.orderId}`
    return request('app', url, 'post')
  },
  cancelOrder:(data)=>{
    let url = `/order/${data.orderId}`
    return request('app', url, 'put',)
  },
  //更新订单状态
  updataOrderState: (data)=>{
    let url = `/order/payOff?orderId=${data.orderId}`
    return request('app', url, 'post')
  },
  //购物车结算前库存校验
  getSureInv:(data)=>{
    let url = `/order/balance`
    return request('app', url, 'post',data)
  },
  //立即购买
  ordernow: (data) => {
    let url = `/order/now`
    return request('app', url, 'post',data)
  },


}