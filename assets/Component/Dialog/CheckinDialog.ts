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
import CommonFunction from "../../Framework/Base/CommonFunction";
import CommonAudioMgr from "../../Framework/Base/CommonAudioMgr";
import ResManager from "../../Framework/Resources/ResManager";
import CheckinManager from "../../Framework/Business/CheckinManager";
import SpriteManager from "../../Framework/UI/SpriteManager";
import UserManager from "../../Framework/Business/UserManager";
import CommonPrefabMgr from "../../Framework/Base/CommonPrefabMgr";
import formatStr = cc.js.formatStr;
import Language from "../../Framework/Resources/Language";
import LabelManager from "../../Framework/UI/LabelManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CheckinDialog extends BaseDialog {

    @property([cc.Node])
    checkinDays: cc.Node[] = [];

    protected onLoad(): void {
        CheckinManager.initCheckinState(this.checkinDays.length);
        this.updateCheckinUI();
    }

    private updateCheckinUI() {
        let checkinState = CheckinManager.getCheckinState();
        for (let i = 0; i < checkinState.length; i++) {
            this.updateDay(this.checkinDays[i], checkinState[i]);
        }
    }

    private updateDay(checkinDay: cc.Node, state) {
        let checkinBtn = checkinDay.getComponent(cc.Button);
        let checkedNode = checkinDay.getChildByName("checked");
        let selectedNode = checkinDay.getChildByName("selected");
        let maskNode = checkinDay.getChildByName("mask");
        let dayNode = checkinDay.getChildByName("day");

        if (state.checked) {
            SpriteManager.loadSpriteForNode(checkinDay, ResManager.common.texture.checkin.bgNotSelect);
            LabelManager.setLabelColor(dayNode, "#995129");
            if (cc.isValid(checkinBtn)) {
                checkinBtn.interactable = false;
            }

            if (cc.isValid(checkedNode)) {
                checkedNode.active = true;
            }
            if (cc.isValid(selectedNode)) {
                selectedNode.active = false;
            }
            if (cc.isValid(maskNode)) {
                maskNode.active = true;
            }
        } else {
            if (state.canCheck) {
                SpriteManager.loadSpriteForNode(checkinDay, ResManager.common.texture.checkin.bgCheckable);
                LabelManager.setLabelColor(dayNode, "#fee40b");
                if (cc.isValid(checkinBtn)) {
                    checkinBtn.interactable = true;
                }

                if (cc.isValid(checkedNode)) {
                    checkedNode.active = false;
                }
                if (cc.isValid(selectedNode)) {
                    selectedNode.active = true;
                }
                if (cc.isValid(maskNode)) {
                    maskNode.active = false;
                }
            } else {
                SpriteManager.loadSpriteForNode(checkinDay, ResManager.common.texture.checkin.bgNotSelect);
                LabelManager.setLabelColor(dayNode, "#995129");
                if (cc.isValid(checkinBtn)) {
                    checkinBtn.interactable = false;
                }

                if (cc.isValid(checkedNode)) {
                    checkedNode.active = false;
                }
                if (cc.isValid(selectedNode)) {
                    selectedNode.active = false;
                }
                if (cc.isValid(maskNode)) {
                    maskNode.active = false;
                }
            }
        }
    }

    protected onClickCheckin(event, data) {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);
        let day = parseInt(data);

        let success = CheckinManager.checkin(day);
        if (!success) {
            return;
        }
        let checkinState = CheckinManager.getCheckinState();
        let curDayState = checkinState[day - 1];

        if (curDayState) {
            let reward = curDayState.reward;

            let loginUser = UserManager.getLoginUser();
            UserManager.updateUserCoin(loginUser.coin + reward);

            CommonPrefabMgr.createToast(formatStr(Language.common.checkinTips, reward));
        }


        this.updateCheckinUI();
    }

}