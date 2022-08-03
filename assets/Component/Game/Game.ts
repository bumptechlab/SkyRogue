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
export default class Game extends cc.Component {

    @property(cc.Node)
    bg1Node: cc.Node = null;

    @property(cc.Node)
    bg2Node: cc.Node = null;

    @property(cc.Node)
    planeNode: cc.Node = null;

    gamePaused: boolean = true;
    speed = 5;
    bgOutPosition = 0;

    protected onLoad(): void {
        let self = this;
        self.bgOutPosition = -self.bg1Node.height;
        self.startGame();
    }

    protected startGame() {
        let self = this;
        self.setGamePause(false);
        self.initPlaneSkin();
        self.planeEnter();
    }

    protected setGamePause(paused) {
        let self = this;
        self.gamePaused = paused;
    }

    protected update(dt: number): void {
        let self = this;
        if (self.gamePaused) {
            return;
        }
        self.renderBg();
    }

    protected initPlaneSkin() {
        let self = this;
        if (cc.isValid(self.planeNode)) {
            let tailFrame = self.planeNode.getChildByName("tail_flame");
            if (cc.isValid(tailFrame)) {
                let animation = tailFrame.getComponent(sp.Skeleton);
                if (cc.isValid(animation)) {
                    let animName = "";
                    let user = UserManager.getLoginUser();
                    if (user.curPlane == GameManager.PLANE_TYPE.PLANE1) {
                        animName = "feiji1";
                    } else if (user.curPlane == GameManager.PLANE_TYPE.PLANE2) {
                        animName = "feiji2";
                    } else if (user.curPlane == GameManager.PLANE_TYPE.PLANE3) {
                        animName = "feiji3";
                    }
                    console.log("Use plane: %s, skin: %s", user.curPlane, animName);
                    animation.setAnimation(0, animName, true);
                }
            }
        }
    }

    protected planeEnter() {
        let self = this;
        if (cc.isValid(self.planeNode)) {
            self.planeNode.runAction(cc.sequence(
                cc.moveTo(2, cc.v2(0, -100)),
                cc.moveTo(2, cc.v2(0, -250))
            )).easing(cc.easeSineOut());
        }
    }

    protected renderBg() {
        let self = this;
        self.bg1Node.y -= self.speed;
        self.bg2Node.y -= self.speed;
        //判断下一帧要出屏幕外了，移动到最上面
        if ((self.bg1Node.y - self.speed) <= self.bgOutPosition) {
            self.bg1Node.y = self.bg2Node.y + self.bg2Node.height;
        }
        if ((self.bg2Node.y - self.speed) <= self.bgOutPosition) {
            self.bg2Node.y = self.bg1Node.y + self.bg1Node.height;
        }
    }

}