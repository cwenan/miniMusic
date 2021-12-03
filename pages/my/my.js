// pages/home/home.js
const API = require('../../utils/api')
import moment from 'moment';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      accountInfo:[],
      profile:[],
      createTime: 0,
      lastTime: 0,
      gender: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      // 获取用户信息
      let userInfo = wx.getStorageSync('userInfo')
      console.log(userInfo);
      this.setData({
        userInfo
    }),
      //获取账号信息
      API.getAccountInfo({
        cookie: wx.getStorageSync('cookie')
      }).then(res=>{
        console.log(res);
        let createTime = moment(res.profile.createTime).format("yy-MM-DD") 
        let lastTime = moment(res.profile.lastLoginTime).format("yy-MM-DD")
        let gender = res.profile.gender
        if(gender==1) {
          gender="男"
        }else{
          gender="女"
        }
        this.setData({
          accountInfo:res.account,
          profile: res.profile,
          createTime,
          lastTime,
          gender
        })
      }).catch(error=>{
        console.log(error);
      })
    },
    //去编辑页面
    toEditUserInfoPage() {
      wx.navigateTo({
        url: '/pages/editUserInfo/editUserInfo',
      })
    }
})