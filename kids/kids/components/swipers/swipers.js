// components/swipers/swipers.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrls: {
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    circular: true,
    currentSwiper: 0,
    previousMargin: 30,
    nextMargin: 30
  },

  /**
   * 组件的方法列表
   */
  methods: {
    previewImage:function(e){
      const index = e.currentTarget.dataset.index
      const imgUrls = this.properties.imgUrls
      wx.previewImage({
        current: imgUrls[index],
        urls: imgUrls,
      })
    }
  }
})
