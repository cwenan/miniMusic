const API = require("../../utils/api");

// pages/updateNickName/updateNickName.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nickname: '',
        focus: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        this.setData({
            nickname: options.nickname
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
     // 获取输入的数据
     handleInput(e) {
        console.log(e);
        let nickname = e.detail.value;
        this.setData({
            nickname
        })
    },
    updateNickName() {
        API.updateUserInfo({
            nickname:this.data.nickname,
            cookie: wx.getStorageSync('cookie')
        }).then(res=>{
            console.log(res);
            if(res.code == 505) {
                wx.showToast({
                    title: '昵称已被占用',
                    icon: 'none'
                  })
            }
        }).catch(error=>{
            console.log(error);
        })
    }
})