// pages/top/top.js
const app = getApp()
const API = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        toplist: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        API.querytopList({

        }).then(res=>{
            console.log(res);
            this.setData({
                toplist: res.list
            })
        }).catch(error=>{
            console.log(error);
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