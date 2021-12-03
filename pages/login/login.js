// pages/login/login.js
const app = getApp()
const API = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone:'',
        password:''
    },

    // 获取输入的数据
    handleInput(e) {
        // console.log(e.detail.value);
        // 通过ID或者data-来获取数据
        let type = e.currentTarget.id;
        console.log(type, e.detail.value);
        this.setData({
            [type]: e.detail.value
        })
    },
    // 登录
    login() {
        let {phone, password} = this.data;
        console.log(phone, password);
        if(!phone) {
            wx.showToast({
              title: '手机号不能为空',
              icon: 'none'
            })
            //异步任务
            return;
        }
        // 验证手机号是否有效
        let phoneReg = /^[1]([3-9])[0-9]{9}$/;
        if(!phoneReg.test(phone)) {
            wx.showToast({
              title: '请输入正确的手机号',
              icon:'none'
            })
            return;
        }
        if (!password) {
            wx.showToast({
              title: '密码不能为空',
              icon: 'none'
            })
            return;
        }
        API.userLogin({
            phone: phone,
            password: password
        }).then(res=>{
            if (res.code==200) {
                wx.showToast({
                  title: '登录成功',
                  icon: 'success'
                })
                //本地存储
                wx.setStorageSync('userInfo', res.profile)
                wx.setStorageSync('cookie', res.cookie)
                wx.switchTab({
                  url: '/pages/index/index',
                })
            }else if (res.code ==400) {
                wx.showToast({
                  title: '手机号错误',
                  icon:'none'
                })
            }else if (res.code ==500) {
                wx.showToast({
                  title: '密码错误',
                  icon: 'none'
                })
            }else {
                wx.showToast({
                  title: '登录失败',
                  icon: 'none'
                })
            }
            console.log(res);
        }).catch(e=>{
            console.log(e);
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})