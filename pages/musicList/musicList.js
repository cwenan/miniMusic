// pages/musicList/musicList.js
import PubSub from 'pubsub-js'
const app = getApp()
const API = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        musicList:[],
        musicListInfo:[],
        listArray:[],
        listInfoArray:[],
        index: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let listID  = options.listID;
        console.log("歌单页面获取到的歌单ID");
        let listArray = new Array();
        //获取歌曲id
        API.querymusicmenu({
            id: listID,
            cookie: wx.getStorageSync('cookie')
        }).then(res=>{
            console.log(res);
            let trackIds=res.playlist.trackIds
            trackIds.forEach(element => {
                listArray.push(element.id)
            });
            //把歌单id数组转成字符串，传入对应方法中
            console.log("id数组："+listArray);
            let a = listArray.join(',')
            API.getMusicInfo({
                ids: a
            }).then(res=>{
                console.log("获取音乐详情");
                console.log(res);
                this.setData({
                    listInfoArray: res.songs 
                })
            }).catch(error=>{
                console.log(error);
            })
            this.setData({
                musicList: res.playlist,
                listArray,
            })
        }).catch(error=>{
            console.log(error);
        }),

        //获取歌曲收藏相关信息
        API.querymusicmenuInfo({
            id:listID
        }).then(res=>{
            console.log(res);
            this.setData({
                musicListInfo: res
            })
        }).catch(error=>{
            console.log(error);
        }),


         // 订阅来自播放页面发步的信息
        // msg是订阅名，发布方和订阅方要相同，type是传过来的参数
        PubSub.subscribe('switchType', (msg, type)=>{
            let {listInfoArray, index} = this.data;
            console.log("接收到"+type);
            if(type === 'pre'){ // 上一首
                (index === 0) && (index = listInfoArray.length);
                index -= 1;
              }else { // 下一首
                (index === listInfoArray.length - 1) && (index = -1);
                index += 1;
              }
            this.setData({
                index
            })
            let musicID = listInfoArray[index].id
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