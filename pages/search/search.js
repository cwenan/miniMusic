// pages/search/search.js
const app = getApp()
const API = require('../../utils/api')
let isSend = false
Page({

    /**
     * 页面的初始数据
     */
    data: {
        defaultkey: '',
        simplehot: [],
        searchList:[],
        index: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            defaultkey: app.globalData.defaultkey
        }),

        //获取简单热榜
        API.getSimpleHot({
        }).then(res=>{
            console.log(res);
            this.setData({
                simplehot:res.data
            })
        }).catch(error=>{
            console.log(error);
        })
    },
    //关键词搜索方法
    toSearchKey(event) {
        // console.log(event);
        let key = event.detail.value.trim()
        if (isSend) {
            return
        }
        isSend = true
        if (key!=null) {
            API.getSearch({
                keywords: key,
                limit: 10
            }).then(res => {
                console.log("获取搜索列表");
                console.log(res);
                this.setData({
                    searchList: res.result.songs
                })
            }).catch(error => {
                console.log(error);
            })
            // 优化搜索请求
            setTimeout(()=>{
                isSend = false
            }, 200)   
        } 
    },
    clear(){
        this.setData({
            defaultkey:'',
            searchList: []
        })
    },
    //跳到播放页面
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