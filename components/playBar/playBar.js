// components/playBar/playBar.js
const app = getApp();
const API = require('../../utils/api')
import PubSub from 'pubsub-js';
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        musicID:app.globalData.musicID
    },

    /**
     * 组件的方法列表
     */
    methods: {
        toPlay() {
            PubSub.subscribe('musicPlayID',(msg, musicID)=>{
                console.log("订阅获得musicID"+musicID);
            })
            let musicID = this.musicID
            wx.navigateTo({
              url: '/pages/play/play?musicID'+ musicID,
            })
        }
    }
})
