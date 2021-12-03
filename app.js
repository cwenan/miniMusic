// app.js
App({
  onLaunch: function() {
    this.globalData = {}
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
},
  globalData: {
    golobaMusicPlay: false,
    musicID: '',
    defaultkey:'',
    
    playList:[] ,//正在播放的数组
    playmusicIndex:0 //播放歌曲的下标
  }
})
