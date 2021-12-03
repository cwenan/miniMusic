// pages/dayrecommend/dayrecommend.js
import PubSub from 'pubsub-js'
const app = getApp()
const API = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day: '',
        month: '',
        songList: [],
        // 数组下标初始化
        index: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
        var cookie = wx.getStorageSync('cookie');
        this.setData({
            day: new Date().getDate(),
            month: new Date().getMonth()+1
        }),
        //需要登录，可以稍后做
        API.queryDayRecommend({ 
            cookie: cookie
        }).then(res=> {
            console.log("每日推荐歌曲获取成功");
            console.log(res);
            this.setData({
                songList: res.data.dailySongs
            })
        })

        // 订阅来自播放页面发步的信息
        // msg是订阅名，发布方和订阅方要相同，type是传过来的参数
        PubSub.subscribe('switchType', (msg, type)=>{
            let {songList, index} = this.data;
            let len = songList.length-1
            console.log("接收到"+type);
            if(type === 'pre'){ // 上一首
                (index === 0) && (index = songList.length);
                index -= 1;
              }else { // 下一首
                (index === songList.length - 1) && (index = -1);
                index += 1;
              }
            this.setData({
                index
            })
            let musicID = songList[index].id
            //发步消息数据
            PubSub.publish('musicID', musicID)
        })
    },

    // 跳转播放页面
    // 传参对字符长度有限制，当数据过长时，仅获取部分 
    songPlayPage(event) {
        let song = event.currentTarget.dataset.song;
        let index = event.currentTarget.dataset.index;
        this.setData({
            index: index
        });
        wx.navigateTo({
          url: '/pages/play/play?musicID='+song.id
        })
    }
})