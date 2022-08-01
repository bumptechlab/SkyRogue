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
import GameManager from "../../Framework/Business/GameManager";
import LifeController from "./LifeController";
import ResultController from "./ResultController";
import GameRoomController from "./GameRoomController";
import User from "../../Framework/Business/User";
import SpineManager from "../../Framework/UI/SpineManager";
import GestureSelector from "./GestureSelector";
import CommonPrefabMgr from "../../Framework/Base/CommonPrefabMgr";
import CountDown from "../Common/CountDown";
import Language from "../../Framework/Resources/Language";
import CommonAudioMgr from "../../Framework/Base/CommonAudioMgr";
import CommonFunction from "../../Framework/Base/CommonFunction";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameRoom extends cc.Component {

    @property(cc.Sprite)
    titleSprite: cc.Sprite = null;

    @property(LifeController)
    meLifeController: LifeController = null;

    @property(LifeController)
    opponentLifeController: LifeController = null;

    @property(ResultController)
    meResultController: ResultController = null;

    @property(ResultController)
    opponentResultController: ResultController = null;

    @property(sp.Skeleton)
    vsSkeleton: sp.Skeleton = null;

    @property(GestureSelector)
    gestureSelector: GestureSelector = null;

    @property(CountDown)
    countDown: CountDown = null;

    private curRoom: GameRoomController;
    private BET_COUNT_DOWN_TIME = 10;     //等待下一局开始的时长
    private RESULT_SHOW_TIME = 2;         //展示输赢结果的时长
    private RANDOM_GESTURE_SHOW_TIME = 3; //展示随机出拳效果的时长

    protected onLoad(): void {
        let self = this;
        CommonAudioMgr.playMusic(ResManager.common.audio.bgm, true, 1);
        self.curRoom = GameManager.getCurRoom();
        self.initRoom();
        self.playVsAnimation(function () {
            self.initStateOnNewGame();
        });
    }

    private startNewGame() {
        let self = this;
        let newRoom = GameManager.createRoom(self.curRoom.roomKind);
        if (newRoom == null) {
            CommonPrefabMgr.createToast(Language.common.notEnoughMoney);
            self.exitGameRoom();
            return;
        }
        self.curRoom = newRoom;
        self.initRoom();
        self.playVsAnimation(function () {
            self.initStateOnNewGame();
        });
    }

    private initStateOnNewGame() {
        let self = this;
        self.curRoom.gameState = GameRoomController.GAME_STATE.ROUND_WAITING;
        if (cc.isValid(self.countDown)) {
            self.countDown.startCountDown(self.BET_COUNT_DOWN_TIME);
        }
    }

    private initRoom() {
        SpriteManager.loadSprite(this.titleSprite, ResManager.room.texture.roomTitle[this.curRoom.roomKind]);

        let me = this.curRoom.me;
        let opponent = this.curRoom.opponent;

        this.updateLife(me, opponent);
        this.updateResult(me, opponent, false);
        this.setControlVisible(false);

        if (cc.isValid(this.gestureSelector)) {
            this.gestureSelector.init(this.onSelectGesture.bind(this));
            this.gestureSelector.selectGesture(GameManager.GESTURE.NONE);
        }
        if (cc.isValid(this.countDown)) {
            this.countDown.init(this.countdownCallback.bind(this));
        }
    }

    private setControlVisible(visible) {
        if (cc.isValid(this.meLifeController)) {
            this.meLifeController.node.active = visible;
        }
        if (cc.isValid(this.opponentLifeController)) {
            this.opponentLifeController.node.active = visible;
        }

        if (cc.isValid(this.meResultController)) {
            this.meResultController.node.active = visible;
        }
        if (cc.isValid(this.opponentResultController)) {
            this.opponentResultController.node.active = visible;
        }
        if (cc.isValid(this.gestureSelector)) {
            this.gestureSelector.node.active = visible;
        }
        if (cc.isValid(this.countDown)) {
            this.countDown.node.active = visible;
        }
    }

    private playVsAnimation(completeCallback) {
        let self = this;
        let options = {
            name: "animation",
            loop: false,
        };
        SpineManager.loadSpine(this.vsSkeleton, ResManager.room.animation.vs, options, function () {
            self.setControlVisible(true);
            completeCallback();
        });
    }


    /**
     * 生命值更新
     * @param me
     * @param opponent
     */
    private updateLife(me: User, opponent: User) {
        if (cc.isValid(this.meLifeController)) {
            this.meLifeController.init(me);
        }
        if (cc.isValid(this.opponentLifeController)) {
            this.opponentLifeController.init(opponent);
        }
    }

    /**
     * 胜负结果更新
     * @param me
     * @param opponent
     */
    private updateResult(me: User, opponent: User, isDraw: boolean) {
        if (cc.isValid(this.meResultController)) {
            this.meResultController.init(me, isDraw);
        }
        if (cc.isValid(this.opponentResultController)) {
            this.opponentResultController.init(opponent, isDraw)
        }
    }

    private beginMatch(gesture: number) {
        let self = this;
        if (self.curRoom.gameState != GameRoomController.GAME_STATE.ROUND_BEGIN) {
            console.log("Can not begin match, current state: " + self.curRoom.gameState);
            return;
        }
        self.curRoom.beginMatch(gesture, function (me: User, opponent: User, isGameOver: boolean) {
            //判断是否平局
            let isDraw = false;
            let winner = "";
            if (!me.isWinner && !opponent.isWinner) {
                isDraw = true;
                winner = "Nobody";
            } else if (me.isWinner) {
                winner = me.name;
            } else if (opponent.isWinner) {
                winner = opponent.name;
            }
            console.log("Round-%s, winner is %s, isGameOver=%s", self.curRoom.curRound, winner, self.curRoom.isGameOver);

            //更新UI
            self.updateLife(me, opponent);
            self.updateResult(me, opponent, isDraw);

            if (isGameOver) {
                //结算金额
                if (me.isWinner) {
                    let meWinCoin = 2 * GameManager.betAmount;

                    self.curRoom.updateMyCoin(me.coin + meWinCoin);
                    CommonPrefabMgr.showWinDialog(meWinCoin, self.onDialogBackCallback.bind(self), self.onDialogContinueCallback.bind(self));

                } else if (opponent.isWinner) {
                    let meLostCoin = -GameManager.betAmount;

                    let opponentWinCoin = 2 * GameManager.betAmount;
                    self.curRoom.updateOpponentCoin(opponent.coin + opponentWinCoin);
                    CommonPrefabMgr.showLostDialog(meLostCoin, self.onDialogBackCallback.bind(self), self.onDialogContinueCallback.bind(self));
                }
                if (cc.isValid(self.countDown)) {
                    self.countDown.stopCountDown();
                }
            } else {
                let timer = setTimeout(function () {
                    clearTimeout(timer);
                    if (!cc.isValid(self.node)) {
                        return;
                    }
                    self.curRoom.gameState = GameRoomController.GAME_STATE.ROUND_WAITING;

                    self.curRoom.me.gesture = GameManager.GESTURE.NONE;
                    self.curRoom.me.isWinner = false;
                    self.curRoom.opponent.gesture = GameManager.GESTURE.NONE;
                    self.curRoom.opponent.isWinner = false;

                    self.updateResult(self.curRoom.me, self.curRoom.opponent, false);

                    if (cc.isValid(self.countDown)) {
                        self.countDown.startCountDown(self.BET_COUNT_DOWN_TIME);
                    }
                }, self.RESULT_SHOW_TIME * 1000);

            }

        });
    }

    private countdownCallback(leftTs) {
        let self = this;
        console.log("Round-%s countdown: %s, isGameOver=%s", self.curRoom.curRound, leftTs, self.curRoom.isGameOver);
        if (self.curRoom.gameState != GameRoomController.GAME_STATE.ROUND_WAITING) {
            return;
        }
        //倒计时结束，未选择时随机出拳
        if (leftTs <= 0) {
            let gesture = self.gestureSelector.getSelectedGesture();
            if (gesture == GameManager.GESTURE.NONE) {
                gesture = parseInt((Math.random() * 3).toString());
            }
            self.startNewRound(gesture);
        }
    }

    private exitGameRoom() {
        let self = this;
        self.curRoom.resetRoom();
        cc.director.loadScene("Hall");
    }

    private onClickBackBtn(event) {
        let self = this;
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

        self.exitGameRoom();
    }

    private onDialogBackCallback() {
        let self = this;
        self.exitGameRoom();
    }

    private onDialogContinueCallback() {
        let self = this;
        self.startNewGame();
    }


    protected onSelectGesture(gesture: number) {

    }

    protected onClickConfirm(event) {
        let self = this;
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

        let gesture = self.gestureSelector.getSelectedGesture();
        if (gesture == GameManager.GESTURE.NONE) {
            CommonPrefabMgr.createToast(Language.common.notSelectGesture);
            return;
        }
        self.startNewRound(gesture);
    }

    protected startNewRound(gesture: number) {
        let self = this;
        if (self.curRoom.gameState == GameRoomController.GAME_STATE.IDLE
            || self.curRoom.gameState == GameRoomController.GAME_STATE.ROUND_WAITING) {

            self.curRoom.gameState = GameRoomController.GAME_STATE.ROUND_BEGIN;

            if (cc.isValid(self.countDown)) {
                self.countDown.stopCountDown();
            }

            //开始随机选择出拳
            self.meResultController.startRandomGesture();
            self.opponentResultController.startRandomGesture();
            console.log("Round-%s begin, show random gesture", self.curRoom.curRound);

            let timeout = setTimeout(function () {
                clearTimeout(timeout);
                if (!cc.isValid(self.node)) {
                    return;
                }
                self.meResultController.stopRandomGesture();
                self.opponentResultController.stopRandomGesture();
                console.log("Round-%s, stop random gesture", self.curRoom.curRound);
                self.beginMatch(gesture);

            }, self.RANDOM_GESTURE_SHOW_TIME * 1000);
        }

        //清空出拳
        if (cc.isValid(self.gestureSelector)) {
            self.gestureSelector.selectGesture(GameManager.GESTURE.NONE);
        }
    }


    protected onDestroy(): void {
        let self = this;
        if (cc.isValid(self.countDown)) {
            self.countDown.stopCountDown();
        }
    }

}
