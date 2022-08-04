import NodeManager from "../UI/NodeManager";
import ResManager from "../Resources/ResManager";
import SpriteManager from "../UI/SpriteManager";
import Rock from "../../Component/Game/Rock";
import BoxCollider = cc.BoxCollider;

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

    public static createRockNode() {
        let self = this;
        let rockNode = SpriteManager.createSpriteNode("rock");
        let rock = rockNode.addComponent(Rock);
        rock.init(self.curRoom);
        return rockNode;
    }


    /**
     * 初始化并进入房间场景
     * @param roomKind
     */
    public static enterRoom() {
        cc.director.loadScene("Game");
    }


    public static setCurRoom(room) {
        this.curRoom = room;
    }

    public static getCurRoom() {
        return this.curRoom;
    }

}
