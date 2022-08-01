import UserManager from "./UserManager";
import GameRoomController from "../../Component/GameRoom/GameRoomController";
import User from "./User";
import CommonPrefabMgr from "../Base/CommonPrefabMgr";
import Language from "../Resources/Language";

export default class GameManager {

    //房间类型
    static ROOM_KIND = cc.Enum({
        ONE: 0,           //一局定胜负
        THREE: 1,         // 三局两胜
        FIVE: 2           // 五局三胜
    });

    //出拳
    static GESTURE = cc.Enum({
        NONE: 100,              //没有出拳（编译系统不让用负数）
        SCISSORS: 0,           //剪刀
        ROCK: 1,               //石头
        PAPER: 2               //步
    });

    public static roomInfo = {
        roomOne: {
            limit: 100,
        },
        roomThree: {
            limit: 500,
        },
        roomFive: {
            limit: 1000,
        }
    };
    public static betAmount = 10;//每一局下注金额
    private static curRoom: GameRoomController; //当前房间

    public static createOpponent(): User {
        let curLoginUser = UserManager.getLoginUser();
        let opponent = UserManager.createRandomUser(true);
        do {
            opponent = UserManager.createRandomUser(true);
        } while (curLoginUser.id == opponent.id || curLoginUser.avatar == opponent.avatar || curLoginUser.name == opponent.name)//对手的ID，头像，名字不能跟当前用户一样

        return opponent;
    }

    /**
     * 初始化并进入房间场景
     * @param roomKind
     */
    public static enterRoom() {
        cc.director.loadScene("GameRoom");
    }

    /**
     * 初始化一个房间
     * @param roomKind
     */
    public static createRoom(roomKind: number): GameRoomController {
        let me = UserManager.getLoginUser();
        //余额不足下注，无法创建房间
        if (me.coin < this.betAmount) {
            return null;
        }
        let opponent = this.createOpponent();

        let room = new GameRoomController();
        room.initRoom(roomKind, me, opponent);

        //进入新房间扣金币
        let myCoin = me.coin - this.betAmount;
        room.updateMyCoin(myCoin);

        this.setCurRoom(room);
        return room;
    }

    public static setCurRoom(room: GameRoomController) {
        this.curRoom = room;
    }

    public static getCurRoom() {
        return this.curRoom;
    }

}
