// pages/editUserInfo/editUserInfo.js
import moment from 'moment';
const API = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    // 获取用户信息
      let userInfo = wx.getStorageSync('userInfo')
      console.log(userInfo);
      let gender = userInfo.gender;
      if(gender==1) {
        gender="男"
      }else{
        gender="女"
      }
      let birthday = moment(userInfo.birthday).format("yy-MM-DD")
      this.setData({
        userInfo,
        gender,
        birthday
    })
    },
    //昵称修改
    updateNickName() {
        let nickname = this.data.userInfo.nickname
        wx.navigateTo({
          url: '/pages/updateNickName/updateNickName?n'+nickname,
        })
    },
    //性别修改
    showGenderModal() {
        let that = this
        wx.showActionSheet({
          itemList: ['男','女'],
          success (res) {
            console.log(res.tapIndex)
            let gender_num = res.tapIndex
            let gender = null
            if(gender_num==0) {
                gender = '男'
            }else {
                gender = '女'
            }
            API.updateUserInfo({
                gender: gender_num,
                cookie: wx.getStorageSync('cookie')
            }).then(res=>{
                console.log(res);
                console.log("性别修改成功");
                that.setData({
                    gender
                })
            }).catch(error=>{
                console.log(error);
            })
          },
          fail (res) {
            console.log(res.errMsg)
          }
        })
    },
    //时间修改
    bindDateChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        let time = moment(e.detail.value).valueOf()
        API.updateUserInfo({
            birthday: time,
            cookie: wx.getStorageSync('cookie')
        }).then(res=>{
            console.log(res);
            console.log("日期修改成功");
            this.setData({
                birthday: e.detail.value
              })
        }).catch(error=>{
            console.log(error);
        })
      }
})