// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import UserManager from "../../Framework/Business/UserManager";
import GameManager from "../../Framework/Business/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Plane extends cc.Component {


    private planeType = 0;

    protected onLoad(): void {

    }

    public init(planeType: number) {
        let self = this;
        self.planeType = planeType;
        if (cc.isValid(self.node)) {
            let tailFrame = self.node.getChildByName("tail_flame");
            if (cc.isValid(tailFrame)) {
                let animation = tailFrame.getComponent(sp.Skeleton);
                if (cc.isValid(animation)) {
                    let animName = "";
                    if (planeType == GameManager.PLANE_TYPE.PLANE1) {
                        animName = "feiji1";
                    } else if (planeType == GameManager.PLANE_TYPE.PLANE2) {
                        animName = "feiji2";
                    } else if (planeType == GameManager.PLANE_TYPE.PLANE3) {
                        animName = "feiji3";
                    }
                    console.log("Use plane: %s, skin: %s", planeType, animName);
                    animation.setAnimation(0, animName, true);
                }
            }
        }
    }

    protected onCollisionEnter(other) {
        let self = this;
        //console.log("Plane[%s]: 碰到了%s", self.planeType, other.node.name);
    }

    protected onCollisionStay(other) {
        let self = this;
        //console.log("Plane[%s]: 穿过了%s", self.planeType, other.node.name);
    }

    protected onCollisionExit(other) {
        let self = this;
        //console.log("Plane[%s]: 离开了%s", self.planeType, other.node.name);
    }

}