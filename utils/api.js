// const baseURL = 'http://netease.wenancoding.com:8899'
const baseURL = 'http://119.91.250.21:8899'
const musicApi = (url, data, method="GET") => {
    let totalurl = baseURL + url
    return new Promise((resolve, reject) => {
        // 三种状态：pending、resolved， rejected
        wx.request({
          url: totalurl,
          method: method,
          data: data,
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success(res) {
              resolve(res.data)
          },
          fail(error) {
              reject(error)
          }
        })
    })
}

module.exports = {
    // 关键词搜索
    searchResult: (data)=>{
        return musicApi('/search', data)
    },
    // 轮播图
    queryBanner: (data) => {
        return musicApi('/banner', data)
    },
    //推荐歌单
    querypersonlized: (data) => {
        return musicApi('/personalized', data)
    },
    //获取歌单
    querymusicmenu: (data) => {
        return musicApi('/playlist/detail', data)
    },
    //获取歌单详情数据
    querymusicmenuInfo:(data)=>{
        return musicApi('/playlist/detail/dynamic', data)
    },
    //排行榜内容摘要数据
    querytopList: (data) => {
        return musicApi('/toplist/detail', data)
    },
    // 所有榜单
    querytop: (data) => {
        return musicApi('/toplist', data)
    },
    //每日推荐歌曲
    queryDayRecommend: (data) => {
        return musicApi('/recommend/songs', data)
    },
    //手机号登录
    userLogin: (data) => {
        return musicApi('/login/cellphone', data)
    },
    //获取歌曲详情
    getMusicInfo:(data) => {
        return musicApi('/song/detail',data)
    },
    // 获取播放链接
    getSongUrl: (data) => {
        return musicApi('/song/url', data)
    },
    //获取歌词
    getLyric:(data) => {
        return musicApi('/lyric', data)
    },
    //默认搜索关键词
    getDefaultKey:(data) => {
        return musicApi('/search/default', data)
    },
    //搜索建议
    getSearchSuggest:(data) => {
        return musicApi('/search/suggest', data)
    },
    //搜索
    getSearch:(data) => {
        return musicApi('/search', data)
    },
    //获取简单热榜
    getSimpleHot:(data) => {
        return musicApi('/search/hot/detail', data)
    },
    //最近播放
    getRecentMusic:(data) => {
        return musicApi('/user/record', data)
    },
    //退出登录
    toLogout:(data) => {
        return musicApi('/logout',data)
    },
    //获取用户歌单
    getUserList:(data) => {
        return musicApi('/user/playlist', data)
    },
    //获取账号信息
    getAccountInfo:(data) => {
        return musicApi('/user/account', data)
    },
    //更新用户信息
    updateUserInfo:(data)=> {
        return musicApi('/user/update', data)
    },
    //我喜欢
    ILike:(data) => {
        return musicApi('/like', data)
    }
}