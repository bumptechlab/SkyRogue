// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import NativeUtil from "../../Framework/Utils/NativeUtil";
import UserManager from "../../Framework/Business/UserManager";
import CommonEventName from "../../Framework/Base/CommonEventName";
import CommonFunction from "../../Framework/Base/CommonFunction";
import CommonAudioMgr from "../../Framework/Base/CommonAudioMgr";
import ResManager from "../../Framework/Resources/ResManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Loading extends cc.Component {


    onLoad() {
    }

    protected onEnable(): void {
        let self = this;
        cc.director.on(CommonEventName.EVENT_APPLE_LOGIN_RESULT, self.onAppLoginResult, self);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, self.onKeyUp, self);
    }

    protected onDisable(): void {
        let self = this;
        cc.director.off(CommonEventName.EVENT_APPLE_LOGIN_RESULT, self.onAppLoginResult, self);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, self.onKeyUp, self);
    }

    public onKeyUp(event): void {
        if (event.keyCode == cc.macro.KEY.back) {
            NativeUtil.quitGame();
        }
    }

    protected onGuestLogin(event): void {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

        let user = UserManager.guestLogin();
        if (user) {
            cc.director.loadScene('Hall');
        }
    }

    protected onAppleLogin(event): void {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

        NativeUtil.appleLogin();
    }

    protected onAppLoginResult(state, result) {

    }
}
