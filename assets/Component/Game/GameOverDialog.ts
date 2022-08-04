// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseDialog from "../Dialog/BaseDialog";
import LabelManager from "../../Framework/UI/LabelManager";
import CommonFunction from "../../Framework/Base/CommonFunction";
import CommonAudioMgr from "../../Framework/Base/CommonAudioMgr";
import ResManager from "../../Framework/Resources/ResManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOverDialog extends BaseDialog {

    @property(cc.Label)
    distanceLabel: cc.Label = null;

    @property(cc.Label)
    goldLabel: cc.Label = null;

    private backCallback;
    private continueCallback;

    protected onLoad(): void {
    }


    public showDialog(distance: number, gold: number, backCallback, continueCallback): void {
        super.showDialog();
        let self = this;
        LabelManager.setLabelString(self.distanceLabel, distance);
        LabelManager.setLabelString(self.goldLabel, "+" + gold);
        self.backCallback = backCallback;
        self.continueCallback = continueCallback;
    }

    protected onClickBackBtn(event): void {
        let self = this;
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

        super.dismissDialog();
        if (self.backCallback) {
            self.backCallback();
        }
    }

    protected onClickContinueBtn(event): void {
        let self = this;
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);
        super.dismissDialog();

        if (self.continueCallback) {
            self.continueCallback();
        }
    }

}