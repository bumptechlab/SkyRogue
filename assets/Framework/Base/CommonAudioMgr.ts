import LocalStorageMgr from "../Utils/LocalStorageMgr";

class CommonAudioMgr {
    static EffectListArr: number[];
    static AudioMusicArray: [];
    static AudioEffectArray: number[];
    static AudioMusicFile: string;
    static MaxAudioMusicLength: number;
    static MaxAudioEffectLength: number;
    static AUDIO_MUSIC_VOLUME: number;
    static AUDIO_EFFECT_VOLUME: number;
    static IS_OPEN_EFFECT: boolean = true;
    static MusicID: number;

    static init() {
        let self = this;
        self.EffectListArr = [];
        self.AudioMusicArray = [];
        self.AudioEffectArray = [];
        self.AudioMusicFile = null;
        self.MaxAudioMusicLength = 1;
        self.MaxAudioEffectLength = 3;
        self.AUDIO_MUSIC_VOLUME = 1;
        self.AUDIO_EFFECT_VOLUME = 0.5;
        self.MusicID = -1;

        //由于init()方法在各个场景的onDestroy()方法被调用，
        //不能直接将IS_OPEN_EFFECT设置为true，否则出现bug：在关闭音效后切换场景会重新打开音效
        //解决方案：再次读取存储的开关标记，进行赋值。
        //self.IS_OPEN_EFFECT = true;
        self.changeEffectSwitch();
    }

    // 更新音效开关
    // 频繁的获取本地保存的数据比较消耗性能，而且音效的开关只需获取一次就可，不需要每次播放音效时都去本地拿一次
    // 再打开或关闭音效开关时更新一下即可
    static changeEffectSwitch() {
        let self = this;
        let effect = LocalStorageMgr.readEffectSwitch();
        // 首次进入时没有本地缓存的数据，默认也是打开的
        if (effect) {
            if (effect == 'true') {
                self.IS_OPEN_EFFECT = true;
            } else {
                self.IS_OPEN_EFFECT = false;
            }
        } else {
            self.IS_OPEN_EFFECT = true;
        }
    }

    // 播放音效
    static playEffect(file, loop = false, volume = this.AUDIO_EFFECT_VOLUME, callback = null, finishCallback = null) {
        let self = this;
        if (self.IS_OPEN_EFFECT && file) {
            if (loop == undefined) {
                loop = false;
            }
            if (volume == undefined) {
                volume = self.AUDIO_EFFECT_VOLUME;
            }
            cc.loader.loadRes(file, function (err, clip) {
                if (err) {
                    console.log("playEffect: " + file + " err=>" + err);
                    if (finishCallback) {
                        finishCallback();
                    }
                    return;
                }
                let audioID = cc.audioEngine.play(clip, loop, volume);
                self.AudioEffectArray.push(audioID);
                cc.audioEngine.setFinishCallback(audioID, function () {
                    if (finishCallback) {
                        finishCallback();
                    }
                });
                if (callback) {
                    callback(audioID);
                }
            });
            if (self.AudioEffectArray.length >= self.MaxAudioEffectLength) {
                let audioOld = self.AudioEffectArray.shift();
                self.safeStopEffect(audioOld);
            }
        } else {
            if (finishCallback) {
                finishCallback();
            }
        }
    }

    // 播放音效 可同时播放多个音效 最多播放20个吧 win平台32，安卓和ios是24
    static playMultiEffect(file, loop, volume, callback, finishCallback, onPrePlayCallback?) {
        let self = this;
        if (self.IS_OPEN_EFFECT && file) {
            if (loop == undefined) {
                loop = false;
            }
            if (volume == undefined) {
                volume = self.AUDIO_EFFECT_VOLUME;
            }

            if (onPrePlayCallback) {
                onPrePlayCallback(self.EffectListArr, 22);
            }
            if (self.EffectListArr.length >= 22) {
                if (finishCallback) {
                    finishCallback(-1);
                }
                return;
            }
            cc.loader.loadRes(file, function (err, clip) {
                if (err) {
                    console.log("playMultiEffect: " + file + " err=>" + err);
                    if (finishCallback) {
                        finishCallback(-1);
                    }
                    return;
                }
                let audioID = cc.audioEngine.play(clip, loop, volume);
                if (audioID != -1) {
                    self.EffectListArr.push(audioID);
                }
                cc.audioEngine.setFinishCallback(audioID, function () {
                    let index = self.EffectListArr.indexOf(audioID);
                    if (index > -1) {
                        self.EffectListArr.splice(index, 1);
                    }
                    if (finishCallback) {
                        finishCallback(audioID);
                    }
                });
                if (callback) {
                    callback(audioID);
                }
            });
        } else {
            if (finishCallback) {
                finishCallback(-1);
            }
        }
    }

    // 播放背景音乐，默认循环
    static playMusic(file: string, loop: boolean, volume: number) {
        let self = this;
        let openSound = 'true';
        let sound = LocalStorageMgr.readMusicSwitch();
        if (sound != null) {
            openSound = sound;
        }
        if (openSound == 'false') {
            self.stopMusic();
            return;
        }
        if (self.AudioMusicFile == file) {
            console.log("音乐正在播放，不能重复播放：%s", file);
            return;
        }
        if (loop == undefined) {
            loop = true;
        }
        if (volume == undefined) {
            volume = self.AUDIO_MUSIC_VOLUME;
        }

        if (openSound == 'true') {
            // if (AudioMusicArray.length >= MaxAudioMusicLength) {
            //     let audioMusicID = AudioMusicArray.shift();
            //     cc.audioEngine.stop(audioMusicID);
            // }
            // let musicID = cc.audioEngine.play(cc.url.raw(file), loop, volume);
            cc.loader.loadRes(file, function (err, clip) {

                if (err) {
                    console.log("play Music: " + file + " err=>" + err);
                    return;
                }
                self.stopAll();
                // let musicID = cc.audioEngine.play(clip, loop, volume);
                let musicID = cc.audioEngine.playMusic(clip, loop);
                cc.audioEngine.setMusicVolume(volume);
                self.MusicID = musicID;
                // AudioMusicArray.push(musicID);
                self.AudioMusicFile = file;

            });
            // AudioMusicArray.push(musicID);
        }
        // cc.audioEngine.setFinishCallback(id, function () {});
    }

    // 播放背景音乐，默认不循环 结束播放其他音乐
    // 注意 finishCallback 里不能执行stopMusic()，否则会报错，具体原因未找到
    // 注意 finishCallback 里不能执行stopMusic()，否则会报错，具体原因未找到
    // 注意 finishCallback 里不能执行stopMusic()，否则会报错，具体原因未找到
    static playMusicWithNoLoop(file, finishCallback, loop = false, volume = CommonAudioMgr.AUDIO_MUSIC_VOLUME) {
        let self = this;
        let openSound = 'true';
        let sound = LocalStorageMgr.readMusicSwitch();
        if (sound != null) {
            openSound = sound;
        }
        if (openSound == 'false') {
            this.stopMusic();
            return;
        }
        if (self.AudioMusicFile == file) {
            console.log("音乐正在播放，不能重复播放：%s", file);
            return;
        }
        if (loop == undefined) {
            loop = false;
        }
        if (volume == undefined) {
            volume = self.AUDIO_MUSIC_VOLUME;
        }
        if (openSound == 'true') {
            // let musicID = cc.audioEngine.play(cc.url.raw(file), loop, volume);
            cc.loader.loadRes(file, function (err, clip) {
                if (err) {
                    console.log("play Music: " + file + " err=>" + err);
                    if (finishCallback) {
                        finishCallback();
                    }
                    return;
                }
                self.stopAll();
                let musicID = cc.audioEngine.playMusic(clip, loop);
                cc.audioEngine.setMusicVolume(volume);
                cc.audioEngine.setFinishCallback(musicID, function () {
                    if (finishCallback) {
                        finishCallback();
                    }
                });
                self.AudioMusicFile = file;
            });

        }
    }

    // 停止背景音乐
    static stopMusic() {
        let self = this;
        self.AudioMusicFile = null;
        // AudioMusicArray.forEach((id) => {
        //     cc.audioEngine.stop(id);
        // });
        // AudioMusicArray = [];
        if ((cc.audioEngine.getState(self.MusicID) != cc.audioEngine.AudioState.STOPPED) &&
            (cc.audioEngine.getState(self.MusicID) != cc.audioEngine.AudioState.ERROR)) {
            cc.audioEngine.stopMusic();
            self.MusicID = -1;
        }
    }

    //停止某个音效
    static stopEffect(audioId) {
        let self = this;
        if (audioId) {
            self.safeStopEffect(audioId);
            let index = self.EffectListArr.indexOf(audioId);
            if (index > -1) {
                self.EffectListArr.splice(index, 1);
            }
        }
    }

    /**
     * 经过查看CCAudioEngine.js得知：
     * 1 当audioId状态是AudioState.STOPPED时，当再次执行cc.audioEngine.stop，会造成底层源码空指针
     * 2 cc.audioEngine.setFinishCallback回调时，audioId是AudioState.STOPPED状态
     * 3 但是间隔一段时间后，会自动变为AudioState.ERROR，排查代码后可以肯定不是我们代码有改变auidId的状态
     * @param audioId
     */
    private static safeStopEffect(audioId) {
        if ((cc.audioEngine.getState(audioId) != cc.audioEngine.AudioState.STOPPED) &&
            (cc.audioEngine.getState(audioId) != cc.audioEngine.AudioState.ERROR)) {
            cc.audioEngine.stop(audioId);
        }
    }

    // 暂停所有音效与背景音乐
    static pauseAll() {
        cc.audioEngine.pauseAll();
    }

    // 继续所有音效与背景音乐
    static resumeAll() {
        cc.audioEngine.resumeAll();
    }

    // 停止所有音效与背景音乐
    static stopAll() {
        let self = this;
        self.AudioMusicFile = null;
        self.EffectListArr = [];
        cc.audioEngine.stopAll();
    }
}

export default CommonAudioMgr;