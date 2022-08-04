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
import PurchaseBtn from "./PurchaseBtn";
import GameManager from "../../Framework/Business/GameManager";
import UserManager from "../../Framework/Business/UserManager";
import CommonPrefabMgr from "../../Framework/Base/CommonPrefabMgr";
import Language from "../../Framework/Resources/Language";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Shop extends cc.Component {

    @property(PurchaseBtn)
    purchaseBtns: PurchaseBtn[] = [];

    protected onLoad(): void {
        let self = this;
        self.initPurchaseState();
    }

    private initPurchaseState() {
        let self = this;
        for (let i = 0; i < self.purchaseBtns.length; i++) {
            let state = self.getPlanePurchaseState(i);
            self.purchaseBtns[i].init(i, state, self.onPurchaseBtnClickCallback.bind(self));
        }
    }

    private getPlanePurchaseState(planeType: number): number {
        let user = UserManager.getLoginUser();
        let state = PurchaseBtn.STATE.LOCKED_CAN_BUY;
        if (user.curPlane == planeType) {
            state = PurchaseBtn.STATE.USING;
        } else if (user.planes.indexOf(planeType) != -1) {
            state = PurchaseBtn.STATE.UNLOCKED;
        } else {
            let price = GameManager.PLANE_CONFIG[planeType].price;
            if (user.coin < price) {//金币不足
                state = PurchaseBtn.STATE.LOCKED_CAN_NOT_BUY;
            } else {
                state = PurchaseBtn.STATE.LOCKED_CAN_BUY;
            }
        }
        return state;
    }

    protected onPurchaseBtnClickCallback(planeType: number, state: number) {
        let self = this;
        console.log("Click on plane type: " + planeType);
        if (state == PurchaseBtn.STATE.USING) {
            return;
        }
        let user = UserManager.getLoginUser();
        if (state == PurchaseBtn.STATE.UNLOCKED) { //已解锁，可以更换飞机
            user.curPlane = planeType;
            UserManager.updateLoginUser(user);
        } else if (state == PurchaseBtn.STATE.LOCKED_CAN_BUY) {//未解锁，需要购买
            let price = GameManager.PLANE_CONFIG[planeType].price;
            if (user.coin < price) {//金币不足
                CommonPrefabMgr.createToast(Language.common.balanceNotEnough);
                return;
            }
            user.coin = user.coin - price;
            user.planes = user.planes.concat(planeType);
            UserManager.updateLoginUser(user);
        }
        self.initPurchaseState();

    }

    protected onClickBackBtn(event) {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);
        cc.director.loadScene("Hall");

    }
}