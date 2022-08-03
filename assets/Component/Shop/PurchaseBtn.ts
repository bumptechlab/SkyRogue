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
import SpriteManager from "../../Framework/UI/SpriteManager";
import ResManager from "../../Framework/Resources/ResManager";
import CommonFunction from "../../Framework/Base/CommonFunction";
import CommonAudioMgr from "../../Framework/Base/CommonAudioMgr";
import GameManager from "../../Framework/Business/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PurchaseBtn extends cc.Component {

    //房间类型
    static STATE = cc.Enum({
        USING: 0,    //正在使用
        UNLOCKED: 1, //已解锁
        LOCKED: 2    //未解锁
    });

    @property(cc.Sprite)
    bgSprite: cc.Sprite = null;

    @property(cc.Node)
    usingNode: cc.Node = null;

    @property(cc.Node)
    useNode: cc.Node = null;

    @property(cc.Node)
    unlockNode: cc.Node = null;

    @property(cc.Label)
    goldLabel: cc.Label = null;

    planeType: number = 0;
    clickCallback = null;
    state: number = 0;

    protected onLoad(): void {
    }

    public init(planeType: number, state: number, clickCallback) {
        let self = this;
        self.planeType = planeType;
        self.clickCallback = clickCallback;
        LabelManager.setLabelString(self.goldLabel, GameManager.PLANE_CONFIG[planeType].price);
        self.setState(state);
    }

    public setState(state: number) {
        let self = this;
        self.state = state;
        if (state == PurchaseBtn.STATE.USING) {
            if (cc.isValid(self.usingNode)) {
                self.usingNode.active = true;
            }
            if (cc.isValid(self.useNode)) {
                self.useNode.active = false;
            }
            if (cc.isValid(self.unlockNode)) {
                self.unlockNode.active = false;
            }
            SpriteManager.loadSprite(self.bgSprite, ResManager.common.texture.btn1);
        } else if (state == PurchaseBtn.STATE.UNLOCKED) {
            if (cc.isValid(self.usingNode)) {
                self.usingNode.active = false;
            }
            if (cc.isValid(self.useNode)) {
                self.useNode.active = true;
            }
            if (cc.isValid(self.unlockNode)) {
                self.unlockNode.active = false;
            }
            SpriteManager.loadSprite(self.bgSprite, ResManager.common.texture.btn3);
        } else if (state == PurchaseBtn.STATE.LOCKED) {
            if (cc.isValid(self.usingNode)) {
                self.usingNode.active = false;
            }
            if (cc.isValid(self.useNode)) {
                self.useNode.active = false;
            }
            if (cc.isValid(self.unlockNode)) {
                self.unlockNode.active = true;
            }
            SpriteManager.loadSprite(self.bgSprite, ResManager.common.texture.btn2);
        }
    }

    private onClickBtn(event) {
        let self = this;
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);
        if (self.clickCallback) {
            self.clickCallback(self.planeType, self.state);
        }
    }
}
