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
import NodeManager from "../../Framework/UI/NodeManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PurchaseBtn extends cc.Component {

    //房间类型
    static STATE = cc.Enum({
        USING: 0,    //正在使用
        UNLOCKED: 1, //已解锁
        LOCKED_CAN_NOT_BUY: 2,    //未解锁-不可购买
        LOCKED_CAN_BUY: 3,        //未解锁-可购买
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
        console.log("Purchase btn set state [%s] on plane-%s", state, self.planeType);
        if (state == PurchaseBtn.STATE.USING) {
            NodeManager.setInteractable(self.node, true);
            NodeManager.setVisible(self.usingNode, true);
            NodeManager.setVisible(self.useNode, false);
            NodeManager.setVisible(self.unlockNode, false);
            SpriteManager.loadSprite(self.bgSprite, ResManager.common.texture.btn1);

        } else if (state == PurchaseBtn.STATE.UNLOCKED) {
            NodeManager.setInteractable(self.node, true);
            NodeManager.setVisible(self.usingNode, false);
            NodeManager.setVisible(self.useNode, true);
            NodeManager.setVisible(self.unlockNode, false);
            SpriteManager.loadSprite(self.bgSprite, ResManager.common.texture.btn3);

        } else if (state == PurchaseBtn.STATE.LOCKED_CAN_BUY) {
            NodeManager.setInteractable(self.node, true);
            NodeManager.setVisible(self.usingNode, false);
            NodeManager.setVisible(self.useNode, false);
            NodeManager.setVisible(self.unlockNode, true);
            SpriteManager.loadSprite(self.bgSprite, ResManager.common.texture.btn2);

        } else if (state == PurchaseBtn.STATE.LOCKED_CAN_NOT_BUY) {
            NodeManager.setInteractable(self.node, false);
            NodeManager.setVisible(self.usingNode, false);
            NodeManager.setVisible(self.useNode, false);
            NodeManager.setVisible(self.unlockNode, true);
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
