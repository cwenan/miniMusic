// index.js
// 获取应用实例
const app = getApp()
const API = require('../../utils/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 顶部导航栏
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    hidden: true,

    //轮播图colorUI，js未添加
    cardCur: 0,
    swiperList:[],

    //搜索关键词
    defaultkey:'',

    //推荐歌单
    recommendList: [],

    // 排行榜数据
    indextopList: [],
    // 搜索框
    inputShowed: true,
    inputVal: ""
  },

  //轮播图改变时触发的方法
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  // 获取轮播图
    API.queryBanner({
    type: 2,
  }).then(res=>{
    console.log("轮播图数据获取成功");
    console.log(res);
    this.setData({
      swiperList: res.banners
    })
  }).catch(error=>{
    console.log("轮播图数据获取失败");
    console.log(error);
  })

  // 获取推荐歌单
  API.querypersonlized({
    limit: 10
  }).then(res => {
    console.log("推荐歌单数据获取成功");
    console.log(res);
    this.setData({
      recommendList: res.result
    })
  }).catch(error => {
    console.log("推荐歌单数据获取失败");
    console.log(error);
  }),
  //获取搜索关键词
  API.getDefaultKey({
  }).then(res=>{
      console.log("获取搜索关键词");
      console.log(res);
      app.globalData.defaultkey = res.data.realkeyword
      this.setData({
        defaultkey: res.data.realkeyword
      })
  }).catch(error=>{
      console.log(error);
  })

  //首页排行榜数据
  API.querytopList({
  }).then(res=> {
    console.log("排行榜数据获取成功");
    console.log(res.list.slice(0,5));
    this.setData({
      indextopList: res.list.slice(0,5)
    })
  })
  },

  //跳转每日推荐
  toDayRecommend(){
    wx.navigateTo({
      url: '/pages/dayrecommend/dayrecommend',
    })
  },
  //跳转歌单界面
  toMusicList(event) {
    console.log(event);
    let listID = event.currentTarget.dataset.listid;
    console.log(listID);
    wx.navigateTo({
      url: '/pages/musicList/musicList?listID='+listID,
    })
  },
  //跳转搜索界面
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  //跳转排行榜界面
  toTopPage() {
    wx.navigateTo({
      url: '/pages/top/top',
    })
  }
})
