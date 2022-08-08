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
import DistanceCounter from "./DistanceCounter";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    bg1Node: cc.Node = null;

    @property(cc.Node)
    bg2Node: cc.Node = null;

    @property(DistanceCounter)
    distanceCounter: DistanceCounter = null;

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

        //背景开始移动
        self.setGamePause(false);
        //初始化距离计算器（未开始计算）
        if (cc.isValid(self.distanceCounter)) {
            self.distanceCounter.init(self.distanceFinishCallback.bind(self));
        }
        //初始化飞机并开始进场
        self.initPlane(function () {
            //开始计算距离
            if (cc.isValid(self.distanceCounter)) {
                self.distanceCounter.startCount();
            }
            //可以开始拖动飞机
            if (cc.isValid(self.plane)) {
                self.plane.setDraggable(true);
            }
            //飞机入场完毕3秒后，障碍物开始入场
            self.scheduleOnce(function () {
                self.rockEnter();
            }, 3);
        });

    }

    protected stopGame() {
        let self = this;
        cc.director.getCollisionManager().enabled = false;
        //暂停背景
        self.setGamePause(true);
        //障碍物停止
        if (cc.isValid(self.rockScene)) {
            self.rockScene.stopGame();
        }
        //距离计算停止
        if (cc.isValid(self.distanceCounter)) {
            self.distanceCounter.stopCount();
        }
        //飞机变为不可拖拽
        if (cc.isValid(self.plane)) {
            self.plane.setDraggable(false);
        }
    }

    protected distanceFinishCallback() {
        let self = this;

    }

    protected rockEnter() {
        let self = this;
        if (cc.isValid(self.rockScene)) {
            let rockSpeed = GameManager.getRockSpeed();
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
            self.plane.setDraggable(false);
            self.plane.initPosition();
            self.plane.init(user.curPlane, self.gameOverCallback.bind(self));
            self.plane.enter(enterCallback);
        }
    }

    //Game Over
    protected gameOverCallback(rock: cc.Node) {
        let self = this;
        self.stopGame();
        self.showGameOverDialog();
    }

    private showGameOverDialog() {
        let self = this;
        let distance = 0;
        if (cc.isValid(self.distanceCounter)) {
            distance = self.distanceCounter.getDistance();
        }
        let curRoom = GameManager.getCurRoom();
        let gold = distance;
        let user = UserManager.getLoginUser();
        //更新金额
        user.coin = user.coin + gold;
        //记录最远距离
        if (distance > user.records[curRoom]) {
            user.records[curRoom] = distance;
        }
        UserManager.updateLoginUser(user);


        CommonPrefabMgr.showGameOverDialog(distance, gold, function () {
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