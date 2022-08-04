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
        rockNode.group = "rock";
        rockNode.addComponent(Rock);
        rockNode.addComponent(BoxCollider);
        let rockRes = [];
        if (self.curRoom == GameManager.ROOM_KIND.EASY) {
            rockRes = ResManager.game.texture.rockEasy;
        } else if (self.curRoom == GameManager.ROOM_KIND.ORDINARY) {
            rockRes = ResManager.game.texture.rockOrdinary;
        } else if (self.curRoom == GameManager.ROOM_KIND.DIFFICULTY) {
            rockRes = ResManager.game.texture.rockDifficulty;
        }
        let rockIndex = parseInt((Math.random() * rockRes.length).toString());
        let rockTexture = rockRes[rockIndex];
        SpriteManager.loadSpriteForNode(rockNode, rockTexture, function () {
            console.log("Create a rock, size: %sx%s", rockNode.width, rockNode.height);
        });
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
