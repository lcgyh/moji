// components/goodsList/goodsList.js
const { stringToTime } = require('../../utils/util')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ispop: {
      type: Boolean,
      value: true
    },
    priceViewType: {
      type: String,
      value: '1'  //1 a-b 2 1 a 折扣b
    },
    goodsInfo: {
      type: Object,
      value: {}
    }
  },
  attached() {
    this.dataInit()
  },
  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    dataInit() {
      let goodsInfo = this.properties.goodsInfo;
      // const activeList = [{
      //   activityType: 4,
      //   activityName: '折扣专区'
      // }, {
      //   activityType: 3,
      //   activityName: '新品上架'
      // }, {
      //   activityType: 2,
      //   activityName: '热销产品'
      // }, {
      //   activityType: 1,
      //   activityName: '限时秒杀'
      // }]

      if (goodsInfo.endTime) {
        goodsInfo.endTimeSrt = stringToTime(goodsInfo.endTime)
      }
      // const activityDisocunts = goodsInfo.activityDisocunts || []
      // const activityNews = goodsInfo.activityNews || []
      // const activityPopulars = goodsInfo.activityPopulars || []
      // const activitySkills = goodsInfo.activitySkills || []



      this.setData({
        goodsInfo: goodsInfo
      })
    },
    goGoodsInfo: function (e) {
      console.log('e',e)
      const goodsId = e.currentTarget.dataset.goodsid
      console.log(goodsId)
      this.triggerEvent('goGoodsInfo', { goodsId: goodsId });
    }
  }
})
