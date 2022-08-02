// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import CommonFunction from "../../Framework/Base/CommonFunction";
import CommonAudioMgr from "../../Framework/Base/CommonAudioMgr";
import ResManager from "../../Framework/Resources/ResManager";
import UserManager from "../../Framework/Business/UserManager";
import LabelManager from "../../Framework/UI/LabelManager";
import formatStr = cc.js.formatStr;
import Language from "../../Framework/Resources/Language";
import GameManager from "../../Framework/Business/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Room extends cc.Component {

    @property(cc.Label)
    easyRecord: cc.Label = null;

    @property(cc.Label)
    ordinaryRecord: cc.Label = null;

    @property(cc.Label)
    difficultyRecord: cc.Label = null;


    protected onLoad(): void {
        let self = this;
        let user = UserManager.getLoginUser();
        LabelManager.setLabelString(self.easyRecord, formatStr(Language.room.highestRecord, user.records[GameManager.ROOM_KIND.EASY]));
        LabelManager.setLabelString(self.ordinaryRecord, formatStr(Language.room.highestRecord, user.records[GameManager.ROOM_KIND.ORDINARY]));
        LabelManager.setLabelString(self.difficultyRecord, formatStr(Language.room.highestRecord, user.records[GameManager.ROOM_KIND.DIFFICULTY]))
    }

    protected onClickEasyBtn(event) {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

    }

    protected onClickOrdinaryBtn(event) {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

    }

    protected onClickDifficultyBtn(event) {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

    }

    protected onClickBackBtn(event) {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

        cc.director.loadScene("Hall")
    }

}