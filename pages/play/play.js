// pages/play/play.js
import PubSub from 'pubsub-js';
import moment from 'moment';
const app = getApp();
const API = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false,
        songInfo: [],
        musicID: '',
        isShowLyric: false,
        Lyric: '',
        currentTime: '00:00',
        durationTime: '00:00',
        currentTimeLineWidth: 0,
        scrollTop: 0,  //设置歌词滚动条位置
        lyricIndex: 0
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //获取音乐id
        let musicID = options.musicID;

        //把音乐id存储到本地
        wx.setStorageSync('musicId', musicID)

        this.setData({
            musicID: options.musicID
        })
        //初始化歌曲数据
        this.getsongdetail(musicID) ;

        //创建音频播放对象
        this.backgroundAudioManager = wx.getBackgroundAudioManager();

        //判断是否是当前页面播放
        if (app.globalData.golobaMusicPlay && app.globalData.musicID == musicID) {
            this.setData({
                isPlay: true,
            })
        }

        //全局监听音乐播放
        this.backgroundAudioManager.onPlay(()=> {
            console.log("play");
            this.changePlayState(true)
            app.globalData.musicID = this.data.musicID
            //发布订阅
            let musicID = this.data.musicID
            PubSub.publish('musicPlayID',  musicID)
        });
        //全局监听音乐是否暂停
        this.backgroundAudioManager.onPause(()=>{
            console.log("pause");
            this.changePlayState(false)
        });
        //全局监听音乐是否完全播放，停止
        this.backgroundAudioManager.onStop(()=> {
            this.changePlayState(false)
        });

        // 如果音乐播放结束，切换到下一首
        this.backgroundAudioManager.onEnded(()=>{
            console.log("已播放完，切换到下一首");
            PubSub.publish('switchType', 'next')
            this.setData({
                currentTime:'00:00',
                currentTimeLineWidth:0
            })
            //订阅来自dayrecommend发过来的musicid
            PubSub.subscribe('musicID', (msg, musicID)=>{
                console.log("下一首ID："+musicID);
                //获取下一曲的信息
                this.getsongdetail(musicID)
                //调用播放功能
                this.musicControl(true, musicID)
                //取消订阅
                PubSub.unsubscribe('musicID')
            })
        });

        //监听音乐的播放情况
        this.backgroundAudioManager.onTimeUpdate(()=>{
            // console.log(this.backgroundAudioManager.duration);
            // console.log("当前播放进度："+this.backgroundAudioManager.currentTime);
            let currentTime = moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss')
            
            // 歌词动态变化
            // let seconds = moment.duration(currentTime).as('seconds')
            let currentTimeArray = currentTime.split(':')
            let seconds = parseFloat(currentTimeArray[0]*60+parseFloat(currentTimeArray[1]))
            // console.log("当前是"+seconds);
            this.showCurrentLyric(seconds);

            //进度条进度设置
            let currentTimeLineWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration*450;
            //如果不是当前歌曲，把进度条和时间设置为0
            if (app.globalData.golobaMusicPlay&&app.globalData.musicID!=musicID) {
                this.setData({
                    currentTime: '00:00',
                    durationTime: '00:00',
                    currentTimeLineWidth: 0
                })
            }else{
                this.setData({
                    currentTime,
                    currentTimeLineWidth
                })
            }
        })

    },   
    getsongdetail(musicID){
        // 获取歌曲详情
        API.getMusicInfo({
            ids: musicID
        }).then(res=>{
            console.log(res);
            let durationTime = moment(res.songs[0].dt).format('mm:ss')
            this.setData({
                durationTime
            })
            this.setData({
                songInfo: res.songs[0]
            })
        }).catch(error=>{
            console.log(error);
        });
        
        //获取歌词
        API.getLyric({
            id: musicID
        }).then(res=>{
            console.log(res);
            //调用歌词解析方法
            let Lyric = this.parseLyric(res.lrc.lyric)
            // 把空歌词去掉
            // let Lyric = this.handleLyricNull(parseLyric)
            console.log(Lyric);
            // 赋值
            this.setData({
                Lyric
            })
        }).catch(error=>{
            console.log(error);
        })
    },


    //进一步封装功能播放函数
    changePlayState(isPlay) {
        this.setData({
            isPlay
        })
        app.globalData.golobaMusicPlay = isPlay
    },

    //音乐播放
    musicPlay: function() {
        let isPlay = !this.data.isPlay
        let musicID = this.data.musicID
        this.musicControl(isPlay, musicID)
    },
    //音乐播放控制
    musicControl(isPlay, musicID) {
        // 创建播放对象
        if (isPlay) {
            API.getSongUrl({
                id: musicID
            }).then(res=> {
                console.log("Music播放url");
                console.log(res);
                this.backgroundAudioManager.src = res.data[0].url;
                this.backgroundAudioManager.title = this.data.songInfo.al.name
            }).catch(error=>{
                console.log(error);
            })
        }else{
            this.backgroundAudioManager.pause();
        }
    },
    //是否显示歌词
    showLyric(){
        let isShowLyric = this.data.isShowLyric;
        this.setData({
            isShowLyric: !isShowLyric
        })
    },

      //歌词处理
      parseLyric(text) {
        let lyricresult = [];
        let lines = text.split('\n')
        //判断最后一个元素是否为空,去掉
        if (lines[lines.length-1]=='') {
            lines.pop();
        }
        //正则，\[转义
        let pattern = /\[\d{2}:\d{2}\.\d{2,3}\]/;
        //v:每一个元素， i:下标，a:正在遍历的数组
        lines.forEach((v, i, a) => {
            //获取文字
            let lyric = v.replace(pattern, "").trim();
            let playTime = v.match(pattern)
            if (playTime!=null) {
                let timearray = playTime[0].slice(1, -1).split(':')
                let finallytime = parseFloat(timearray[0]*60+parseFloat(timearray[1]))
                lyricresult.push([finallytime, lyric])
            }          
        });
        return lyricresult;
    },
    //当歌词为空，但又存在时间时，去掉
    handleLyricNull(lyricArray){
        let result = [];
        for(let i = 0; i<lyricArray.length; i++) {
            if (lyricArray[i][1]!='') {
                result.push(lyricArray[i])
            }
        }
        return result;
    },
    //显示当前歌词滚动
    showCurrentLyric(currentTime){
        // console.log("歌词播放时间："+currentTime);
        let lyricArray = this.data.Lyric
        // 对最后一句进行处理
        if (this.data.lyricIndex==lyricArray.length-2) {
             if(currentTime>=lyricArray[lyricArray.length-1][0]) {
                 this.setData({
                     lyricIndex: lyricArray.length-1
                 })
             }           
        }else{
            for (let i = 0; i < lyricArray.length-1; i++) {
                if (lyricArray[i][0]<= currentTime && lyricArray[i+1][0] >currentTime) {
                    // console.log("当前歌词index为："+i);
                    this.setData({
                        lyricIndex: i
                    })
                }
            }
        }
        if (this.data.lyricIndex>=8) {
            this.setData({
                scrollTop: (this.data.lyricIndex-8)*50
            })
        }
    },


    //处理上一曲下一曲
    handleSwitch(event) {
        let type = event.currentTarget.id;
        console.log(type);
        
        //先停止再切换
        this.backgroundAudioManager.stop();

        //发步消息数据
        PubSub.publish('switchType', type)

        //订阅来自dayrecommend发过来的musicid
        PubSub.subscribe('musicID', (msg, musicID)=>{
            //把音乐id存储到本地
            wx.setStorageSync('musicId', musicID)
            console.log("下一首ID："+musicID);
            //获取下一曲的信息
            this.getsongdetail(musicID)
            //调用播放功能
            this.musicControl(true, musicID)
            //取消订阅
            PubSub.unsubscribe('musicID')
        })

    },
    //我喜欢
    ilike() {
        let musicId = this.data.musicID
        API.ILike({
            id: musicId,
            cookie: wx.getStorageSync('cookie')
        }).then(res=> {
            if(res.code==200) {
                console.log("已添加到我喜欢");
                console.log(res);
                wx.showToast({
                  title: '已收藏',
                  icon: 'none'
                })
            }
        }).catch(error=>{
            console.log(error);
        })
    }
   
})