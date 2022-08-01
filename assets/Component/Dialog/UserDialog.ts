// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import LabelManager from "../../Framework/UI/LabelManager";
import BaseDialog from "./BaseDialog";
import User from "../../Framework/Business/User";
import ResManager from "../../Framework/Resources/ResManager";
import SpriteManager from "../../Framework/UI/SpriteManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UserDialog extends BaseDialog {

    @property(cc.Sprite)
    avatarSprite: cc.Sprite = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    idLabel: cc.Label = null;

    @property(cc.Label)
    coinLabel: cc.Label = null;


    public showDialog(user: User, finishCallback?) {
        super.showDialog(finishCallback);
        this.initUserInfo(user);
    }

    private initUserInfo(user: User) {
        let self = this;
        let avatarPath = ResManager.common.texture.userAvatars[user.avatar];
        if (avatarPath) {
            SpriteManager.loadSprite(self.avatarSprite, avatarPath);
        } else {
            SpriteManager.setSpriteFrame(self.avatarSprite, null);
        }
        LabelManager.setLabelString(self.nameLabel, user.name);
        LabelManager.setLabelString(self.idLabel, user.id);
        LabelManager.setLabelString(self.coinLabel, user.coin);
    }


}