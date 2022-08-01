// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import SpriteManager from "../../Framework/UI/SpriteManager";
import ResManager from "../../Framework/Resources/ResManager";
import User from "../../Framework/Business/User";
import CommonPrefabMgr from "../../Framework/Base/CommonPrefabMgr";
import CommonFunction from "../../Framework/Base/CommonFunction";
import CommonAudioMgr from "../../Framework/Base/CommonAudioMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ResultController extends cc.Component {

    @property(cc.Sprite)
    avatarSprite: cc.Sprite = null;

    @property(cc.Sprite)
    gestureSprite: cc.Sprite = null;

    @property(cc.Sprite)
    winnerSprite: cc.Sprite = null;

    @property(cc.Sprite)
    highlightSprite: cc.Sprite = null;

    @property([cc.SpriteFrame])
    gestures: cc.SpriteFrame[] = [];

    private user: User = null;
    private RANDOM_TAG = 1000;

    public init(user: User, isDraw: boolean) {
        if (!user) {
            return;
        }
        let avatarPath = ResManager.common.texture.userAvatarsVS[user.avatar];
        SpriteManager.loadSprite(this.avatarSprite, avatarPath);

        let resultPath = ResManager.room.texture.gesture[user.gesture];
        if (resultPath) {
            SpriteManager.loadSprite(this.gestureSprite, resultPath);
        } else {
            SpriteManager.setSpriteFrame(this.gestureSprite, null);
        }

        if (isDraw) {
            SpriteManager.loadSprite(this.winnerSprite, ResManager.room.texture.draw);
        } else {
            if (user.isWinner) {
                SpriteManager.loadSprite(this.winnerSprite, ResManager.room.texture.winner);
            } else {
                SpriteManager.setSpriteFrame(this.winnerSprite, null);
            }
        }
        if (cc.isValid(this.highlightSprite)) {
            this.highlightSprite.node.active = user.isWinner;
        }
        this.user = user;
    }

    protected onClickAvatar(event) {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

        CommonPrefabMgr.showUserDialog(this.user);
    }

    public startRandomGesture() {
        let self = this;
        let lastRandomIndex = -1;
        let changeGesture = cc.callFunc(function () {
            let curRandomIndex = -1;
            do {
                curRandomIndex = parseInt((Math.random() * 3).toString());
            } while (curRandomIndex == lastRandomIndex);
            lastRandomIndex = curRandomIndex;
            SpriteManager.setSpriteFrame(self.gestureSprite, self.gestures[curRandomIndex]);
        });
        let action = self.node.runAction(cc.repeatForever(
            cc.sequence(
                changeGesture,
                cc.delayTime(0.1)
            )
        ));
        action.setTag(self.RANDOM_TAG);
    }

    public stopRandomGesture() {
        let self = this;
        self.node.stopActionByTag(self.RANDOM_TAG);
    }


}
