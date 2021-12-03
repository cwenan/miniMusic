// pages/about/about.js
const app = getApp();
const API = require('../../utils/api')
Page({
    data: {
      userInfo: [],
    //   处理高度
      CustomBar: app.globalData.CustomBar,
      StatusBar: app.globalData.StatusBar,
      hidden: true,
      lovelist:[],//我喜欢的
      createlist:[],//我创建的
      collectlist:[]//我收藏的
    },
    onLoad() {
        let userInfo = wx.getStorageSync('userInfo')
        if(!userInfo) {
          wx.showToast({
            title: '请登录',
            icon: 'none',
            success: ()=>{
                wx.reLaunch({
                  url: '/pages/login/login',
                })
            }
          })
      }
        console.log(userInfo);
        this.setData({
          userInfo
      })
        //最近播放歌曲
        API.getRecentMusic({
          uid: this.data.userInfo.userId,
          type: 1
        }).then(res=>{
          console.log(res);
          this.setData({
            recentMusic: res.weekData
          })
        }).catch(error=>{
          console.log(error);
        }),
        //用户歌单
        API.getUserList({
          uid: this.data.userInfo.userId,
          cookie:wx.getStorageSync('cookie')
        }).then(res=>{
          console.log(res);
          this.setData({
            lovelist: res.playlist,
            createlist: res.playlist.slice(1, 3),
            collectlist: res.playlist.slice(3, -1)
          })
        }).catch(error=>{
          console.log(error);
        })         
    },
    toMyPage() {
      wx.navigateTo({
        url: '/pages/my/my',
      })
    },
    toLogin() {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    },
        //跳转搜索界面
    toSearch() {
      wx.navigateTo({
        url: '/pages/search/search',
    })
    },

    //跳转到最近播放页面
    toRecentPage() {
      wx.navigateTo({
        url: '/pages/recentpage/recentpage',
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
  })