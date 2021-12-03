// components/SideBar/SideBar.js
const app = getApp();
const API = require('../../utils/api')
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
      CustomBar: app.globalData.CustomBar,
    },

    /**
     * 组件的方法列表
     */
    methods: {
      showModal(e) {
        this.setData({
          modalName: e.currentTarget.dataset.target
        })
      },
      hideModal(e) {
        this.setData({
          modalName: null
        })
      },
      true(e) {
        console.log(e);
      },
        // 去个人主页
      toMyPage() {
        //判断是否登录
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
         wx.navigateTo({
          url: '/pages/my/my'
      })
    },
    //退出登录
    logout() {
      API.toLogout({
      }).then(res=>{
        wx.removeStorageSync('cookie');
        wx.removeStorageSync('userInfo')
        console.log("已退出登录");
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }).catch(error=>{
        console.log(error);
      })
      //关闭弹窗
      this.hideModal();
    }
    },
})
