// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "../../Framework/Business/GameManager";
import CommonDragView from "../Common/CommonDragView";
import BoxCollider = cc.BoxCollider;
import ResManager from "../../Framework/Resources/ResManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Plane extends cc.Component {

    @property(CommonDragView)
    commonDragView: CommonDragView = null;

    private planeType: number = 0;
    private crashCallback = null;

    protected onLoad(): void {
        let self = this;
        self.initPosition();
    }

    public initPosition() {
        let self = this;
        //初始位置的世界坐标，在屏幕底部外
        let x = cc.winSize.width / 2;
        let y = -100;
        let initPos = new cc.v2(x, y);
        self.setPosition(initPos);
    }

    public setPosition(worldPos: cc.Vec2): void {
        let self = this;
        let nodePos = self.node.parent.convertToNodeSpaceAR(worldPos);
        console.log("Plane init position: [%s,%s]", nodePos.x, nodePos.y);
        self.node.position = nodePos;
    }

    public setDraggable(draggable: boolean): void {
        let self = this;
        if (cc.isValid(self.commonDragView)) {
            self.commonDragView.setDraggable(draggable);
        }
    }


    public enter(enterCallback): void {
        let self = this;
        if (cc.isValid(self.node)) {

            let flyToY = 137;
            let flyToX = cc.winSize.width / 2;
            let flyToPos = self.node.parent.convertToNodeSpaceAR(new cc.v2(flyToX, flyToY));

            let flyOverY = flyToY + 200;
            let flyOverX = flyToX;
            let flyOverPos = self.node.parent.convertToNodeSpaceAR(new cc.v2(flyOverX, flyOverY));

            self.node.runAction(cc.sequence(
                cc.moveTo(2, flyOverPos),
                cc.moveTo(2, flyToPos),
                cc.callFunc(function () {
                    if (enterCallback) {
                        enterCallback();
                    }
                })
            )).easing(cc.easeSineOut());
        }
    }

    public init(planeType: number, crashCallback) {
        let self = this;
        self.planeType = planeType;
        self.crashCallback = crashCallback;
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
            let box = self.node.getComponent(BoxCollider);
            if (cc.isValid(box)) {
                let planeSize = ResManager.game.config.planeSize[planeType];
                box.size.width = planeSize[0];
                box.size.height = planeSize[1];
            }
        }
    }

    protected onCollisionEnter(other) {
        let self = this;
        console.log("Plane[%s]: 碰到了%s", self.planeType, other.node.name);
        if (self.crashCallback) {
            self.crashCallback(other.node);
        }
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