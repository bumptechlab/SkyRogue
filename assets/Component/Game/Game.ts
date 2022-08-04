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
import GameManager from "../../Framework/Business/GameManager";
import CommonPrefabMgr from "../../Framework/Base/CommonPrefabMgr";

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
        self.startGame();
    }

    protected startGame() {
        let self = this;
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
        self.setGamePause(false);
        self.initPlane(function () {
            //3秒后，障碍物开始入场
            self.scheduleOnce(function () {
                self.rockEnter();
            }, 3);
        });
    }

    protected stopGame() {
        let self = this;
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = true;
        self.setGamePause(true);
        if (cc.isValid(self.rockScene)) {
            self.rockScene.stopGame();
        }
    }

    protected rockEnter() {
        let self = this;
        if (cc.isValid(self.rockScene)) {
            let rockSpeed = self.speed;
            if (GameManager.getCurRoom() == GameManager.ROOM_KIND.EASY) {
                rockSpeed = self.speed * 0.8;
            } else if (GameManager.getCurRoom() == GameManager.ROOM_KIND.ORDINARY) {
                rockSpeed = self.speed;
            } else if (GameManager.getCurRoom() == GameManager.ROOM_KIND.DIFFICULTY) {
                rockSpeed = self.speed * 1.2;
            }
            self.rockScene.setSpeed(rockSpeed);
            self.rockScene.startGame();
        }
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

    protected initPlane(enterCallback) {
        let self = this;
        let user = UserManager.getLoginUser();
        if (cc.isValid(self.plane)) {
            self.plane.initPosition();
            self.plane.init(user.curPlane, self.gameOver.bind(self));
            self.plane.enter(enterCallback);
        }
    }

    //Game Over
    protected gameOver(rock: cc.Node) {
        let self = this;
        self.stopGame();
        CommonPrefabMgr.showGameOverDialog(0, 0, function () {
            cc.director.loadScene("Hall");
        }, function () {
            self.startGame();
        })
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
        let self = this;
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = false;
        self.unscheduleAllCallbacks();
    }

}