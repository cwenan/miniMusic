// pages/recentpage/recentpage.js
import PubSub from 'pubsub-js'
const app = getApp()
const API = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        recentMusic:[],
        index: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
          //最近播放歌曲，1为本周，0为全部
      API.getRecentMusic({
        uid: userInfo.userId,
        type: 1
      }).then(res=>{
        console.log("成功获取最近播放列表");
        this.setData({
          recentMusic: res.weekData
        })        
      }).catch(error=>{
        console.log(error);
      }),

        // 订阅来自播放页面发步的信息
        // msg是订阅名，发布方和订阅方要相同，type是传过来的参数
        PubSub.subscribe('switchType', (msg, type)=>{
            let {recentMusic, index} = this.data;
            console.log("接收到"+type);
            if(type === 'pre'){ // 上一首
                (index === 0) && (index = recentMusic.length);
                index -= 1;
              }else { // 下一首
                (index === recentMusic.length - 1) && (index = -1);
                index += 1;
              }
            this.setData({
                index
            })
            let musicID = recentMusic[index].song.id
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