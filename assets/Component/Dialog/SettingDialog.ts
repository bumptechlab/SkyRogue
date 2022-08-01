// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseDialog from "./BaseDialog";
import LocalStorageMgr from "../../Framework/Utils/LocalStorageMgr";
import SpriteManager from "../../Framework/UI/SpriteManager";
import ResManager from "../../Framework/Resources/ResManager";
import CommonFunction from "../../Framework/Base/CommonFunction";
import CommonAudioMgr from "../../Framework/Base/CommonAudioMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SettingDialog extends BaseDialog {

    @property(cc.Sprite)
    musicSwitch: cc.Sprite = null;

    @property(cc.Sprite)
    effectSwitch: cc.Sprite = null;

    protected onLoad(): void {
        let self = this;
        self.initSwitch();
    }

    private initSwitch() {
        let self = this;
        let musicSwitch = LocalStorageMgr.readMusicSwitch();
        if (musicSwitch == "false") {
            SpriteManager.loadSprite(self.musicSwitch, ResManager.common.texture.off);
        } else {
            SpriteManager.loadSprite(self.musicSwitch, ResManager.common.texture.on);
        }

        let effectSwitch = LocalStorageMgr.readEffectSwitch();
        if (effectSwitch == "false") {
            SpriteManager.loadSprite(self.effectSwitch, ResManager.common.texture.off);
        } else {
            SpriteManager.loadSprite(self.effectSwitch, ResManager.common.texture.on);
        }
    }


    protected onClickMusicSwitch(event) {
        let self = this;
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

        let musicSwitch = LocalStorageMgr.readMusicSwitch();
        if (musicSwitch == "false") {
            musicSwitch = "true";
        } else {
            musicSwitch = "false";
        }
        LocalStorageMgr.saveMusicSwitch(musicSwitch);
        self.initSwitch();

        if (musicSwitch == "false") {
            CommonAudioMgr.stopAll();
        } else {
            CommonAudioMgr.playMusic(ResManager.common.audio.bgm, true, 1);
        }
    }

    protected onClickEffectSwitch(event) {
        let self = this;
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

        let effectSwitch = LocalStorageMgr.readEffectSwitch();
        if (effectSwitch == "false") {
            effectSwitch = "true";
        } else {
            effectSwitch = "false";
        }
        LocalStorageMgr.saveEffectSwitch(effectSwitch);
        self.initSwitch();
    }
}