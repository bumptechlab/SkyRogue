import UserManager from "../../Framework/Business/UserManager";
import User from "../../Framework/Business/User";
import GameManager from "../../Framework/Business/GameManager";

/**
 * 控制每一局游戏的行为
 */
class GameRoomController {

    public me: User = null;
    public opponent: User = null;
    public roomKind: number = 0;
    public winRound: number = 0; //首先到达赢的轮数，三局两胜（winRound=2）,五局三胜(winRound=3)
    public curRound: number = 0;
    public isGameOver: boolean = false;
    public gameState = 0;

    //出拳
    public static GAME_STATE = cc.Enum({
        IDLE: 0,
        ROUND_BEGIN: 1,     //新一轮开始，双方决定出什么拳
        ROUND_END: 2,       //新一轮结束，展示输赢
        ROUND_WAITING: 3,   //等待下一轮，10秒钟
        GAME_OVER: 4,      //所有局都已结束
    });


    public initRoom(roomKind: number, me: User, opponent: User) {
        this.roomKind = roomKind;
        this.me = me;
        this.opponent = opponent;
        this.resetRoom();
    }

    public resetRoom() {
        let initLife = 0;
        let winRound = 0;
        if (this.roomKind == GameManager.ROOM_KIND.ONE) {
            initLife = 1;
            winRound = 1;
        } else if (this.roomKind == GameManager.ROOM_KIND.THREE) {
            initLife = 3;
            winRound = 2;
        } else if (this.roomKind == GameManager.ROOM_KIND.FIVE) {
            initLife = 5;
            winRound = 3;
        }

        let me = this.me;
        me.life = initLife;
        me.isWinner = false;
        me.gesture = GameManager.GESTURE.NONE;
        me.winCount = 0;

        let opponent = this.opponent;
        opponent.life = initLife;
        opponent.isWinner = false;
        opponent.gesture = GameManager.GESTURE.NONE;
        opponent.winCount = 0;

        this.winRound = winRound;
        this.curRound = 0;
        this.isGameOver = false;
        this.gameState = GameRoomController.GAME_STATE.IDLE;
    }

    public updateOpponentCoin(coin: number) {
        if (this.opponent) {
            this.opponent.coin = coin;
        }
    }

    public updateMyCoin(coin: number) {
        if (this.me) {
            this.me.coin = coin;
        }
        UserManager.updateUserCoin(coin);
    }

    //下一轮
    public beginMatch(gesture: number, resultCallback) {
        if (!this.me || !this.opponent) {
            console.log("Not enough of gamers, can not play the game");
            return;
        }
        if (this.isGameOver) {
            console.log("Game Over");
            this.gameState = GameRoomController.GAME_STATE.GAME_OVER;
            if (resultCallback) {
                resultCallback(this.me, this.opponent, this.isGameOver);
            }
            return;
        }
        this.curRound++;
        this.me.gesture = gesture;
        this.opponent.gesture = parseInt((Math.random() * 3).toString());
        this.matchGame(this.me, this.opponent);
        if (this.me.isWinner) {
            this.me.winCount++;
            this.opponent.life--;
        } else if (this.opponent.isWinner) {
            this.opponent.winCount++;
            this.me.life--;
        }
        //先判断是否有人达到了赢的轮数
        if (this.me.winCount >= this.winRound) {
            this.me.isWinner = true;
            this.opponent.isWinner = false;
            this.isGameOver = true;
            this.gameState = GameRoomController.GAME_STATE.GAME_OVER;
        } else if (this.opponent.winCount >= this.winRound) {
            this.me.isWinner = false;
            this.opponent.isWinner = true;
            this.isGameOver = true;
            this.gameState = GameRoomController.GAME_STATE.GAME_OVER;
        } else {
            this.gameState = GameRoomController.GAME_STATE.ROUND_END;
        }

        if (resultCallback) {
            resultCallback(this.me, this.opponent, this.isGameOver);
        }
    }

    /**
     * 决定输赢
     * @param me
     * @param opponent
     */
    private matchGame(me: User, opponent: User) {

        if (me.gesture == opponent.gesture) {//和
            me.isWinner = false;
            opponent.isWinner = false;
        } else {
            if (me.gesture == GameManager.GESTURE.PAPER && opponent.gesture == GameManager.GESTURE.ROCK) {
                me.isWinner = true;
                opponent.isWinner = false;
            } else if (me.gesture == GameManager.GESTURE.PAPER && opponent.gesture == GameManager.GESTURE.SCISSORS) {
                me.isWinner = false;
                opponent.isWinner = true;
            } else if (me.gesture == GameManager.GESTURE.ROCK && opponent.gesture == GameManager.GESTURE.PAPER) {
                me.isWinner = false;
                opponent.isWinner = true;
            } else if (me.gesture == GameManager.GESTURE.ROCK && opponent.gesture == GameManager.GESTURE.SCISSORS) {
                me.isWinner = true;
                opponent.isWinner = false;
            } else if (me.gesture == GameManager.GESTURE.SCISSORS && opponent.gesture == GameManager.GESTURE.ROCK) {
                me.isWinner = false;
                opponent.isWinner = true;
            } else if (me.gesture == GameManager.GESTURE.SCISSORS && opponent.gesture == GameManager.GESTURE.PAPER) {
                me.isWinner = true;
                opponent.isWinner = false;
            }
        }
    }

}

export default GameRoomController;