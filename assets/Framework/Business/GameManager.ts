export default class GameManager {

    //房间类型
    static ROOM_KIND = cc.Enum({
        EASY: 0,           //容易
        ORDINARY: 1,       //普通
        DIFFICULTY: 2      //困难
    });
    static PLANE_TYPE = cc.Enum({
        PLANE1: 0,
        PLANE2: 1,
        PLANE3: 2
    });
    static PLANE_CONFIG = {
        0: {
            price: 0
        },
        1: {
            price: 20000
        },
        2: {
            price: 30000
        }
    };
    private static curRoom: number; //当前难度


    /**
     * 初始化并进入房间场景
     * @param roomKind
     */
    public static enterRoom() {
        cc.director.loadScene("Game");
    }

    /**
     * 初始化一个房间
     * @param roomKind
     */
    public static createRoom(roomKind: number) {

    }

    public static setCurRoom(room) {
        this.curRoom = room;
    }

    public static getCurRoom() {
        return this.curRoom;
    }

}
