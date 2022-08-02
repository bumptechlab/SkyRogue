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
import CommonAudioMgr from "../../Framework/Base/CommonAudioMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Launcher extends cc.Component {


    protected onLoad() {
        let self = this;
        CommonAudioMgr.init();
        NativeUtil.init();

        //设置背景色
        //cc.director.setClearColor(cc.color().fromHEX("#FFFFFF"));
        cc.Camera.main.backgroundColor = cc.color().fromHEX("#FFFFFF");

        let loginUser = UserManager.guestLogin();
        self.gotoHallDelay();
    }


    private gotoHallDelay() {
        setTimeout(function () {
            cc.director.loadScene('Hall');
        }, 3000);
    }

    protected start() {
    }

    // update (dt) {}
}
