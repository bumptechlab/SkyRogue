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
import Plane from "./Plane";
import RockScene from "./RockScene";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    bg1Node: cc.Node = null;

    @property(cc.Node)
    bg2Node: cc.Node = null;

    @property(Plane)
    plane: Plane = null;

    @property(RockScene)
    rockScene: RockScene = null;

    gamePaused: boolean = true;
    speed: number = 5;
    bgOutPosition: number = -360;

    protected onLoad(): void {
        let self = this;
        self.bgOutPosition = -self.bg1Node.height;
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
        self.startGame();
    }

    protected startGame() {
        let self = this;
        self.setGamePause(false);
        self.initPlaneSkin();
        self.planeEnter(function () {
            let timeout = setTimeout(function () {
                clearTimeout(timeout);
                //障碍物开始入场
                if (cc.isValid(self.rockScene)) {
                    self.rockScene.startGame();
                }
            }, 3000);
        });
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
        let user = UserManager.getLoginUser();
        if (cc.isValid(self.plane)) {
            self.plane.init(user.curPlane);
        }
    }


    protected planeEnter(enterCallback) {
        let self = this;
        if (cc.isValid(self.plane)) {
            self.plane.node.runAction(cc.sequence(
                cc.moveTo(2, cc.v2(0, -100)),
                cc.moveTo(2, cc.v2(0, -250)),
                cc.callFunc(function () {
                    if (enterCallback) {
                        enterCallback();
                    }
                })
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

    protected onDestroy(): void {
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    }

}