// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import UserManager from "../../Framework/Business/UserManager";
import ResManager from "../../Framework/Resources/ResManager";
import NativeUtil from "../../Framework/Utils/NativeUtil";
import CommonAudioMgr from "../../Framework/Base/CommonAudioMgr";
import CommonFunction from "../../Framework/Base/CommonFunction";
import CommonEventName from "../../Framework/Base/CommonEventName";
import SpriteManager from "../../Framework/UI/SpriteManager";
import LabelManager from "../../Framework/UI/LabelManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hall extends cc.Component {

    @property(cc.Label)
    private coinLabel: cc.Label = null;

    protected onLoad() {
        let self = this;
        console.log("=== Hall onLoad ===");
        CommonAudioMgr.playMusic(ResManager.common.audio.bgm, true, 1);
        self.initUserInfo();
    }

    protected onEnable(): void {
        let self = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, self.onKeyUp, this);
        cc.director.on(CommonEventName.EVENT_REFRESH_USER_INFO, self.initUserInfo, self);
    }

    protected onDisable(): void {
        let self = this;
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, self.onKeyUp, self);
        cc.director.off(CommonEventName.EVENT_REFRESH_USER_INFO, self.initUserInfo, self);
    }

    private initUserInfo(): void {
        let self = this;
        let user = UserManager.getLoginUser();
        LabelManager.setLabelString(self.coinLabel, user.coin);
    }

    protected onClickShop(event): void {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

    }

    protected onClickStart(event): void {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);
        cc.director.loadScene("Room")
    }


    public onKeyUp(event): void {
        if (event.keyCode == cc.macro.KEY.back) {
            NativeUtil.quitGame();
        }
    }

    protected onDestroy(): void {

    }

}
