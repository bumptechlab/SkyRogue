// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import ResManager from "../../Framework/Resources/ResManager";
import SpriteManager from "../../Framework/UI/SpriteManager";
import GameManager from "../../Framework/Business/GameManager";
import BoxCollider = cc.BoxCollider;

const {ccclass, property} = cc._decorator;

@ccclass
export default class Rock extends cc.Component {

    protected onLoad(): void {
    }

    public init(room: number): void {
        let self = this;
        self.node.group = "rock";
        let box = self.node.addComponent(BoxCollider);
        let rockRes = [];
        if (room == GameManager.ROOM_KIND.EASY) {
            rockRes = ResManager.game.texture.rockEasy;
        } else if (room == GameManager.ROOM_KIND.ORDINARY) {
            rockRes = ResManager.game.texture.rockOrdinary;
        } else if (room == GameManager.ROOM_KIND.DIFFICULTY) {
            rockRes = ResManager.game.texture.rockDifficulty;
        }
        let configRes = [];
        if (room == GameManager.ROOM_KIND.EASY) {
            configRes = ResManager.game.config.rockEasy;
        } else if (room == GameManager.ROOM_KIND.ORDINARY) {
            configRes = ResManager.game.config.rockOrdinary;
        } else if (room == GameManager.ROOM_KIND.DIFFICULTY) {
            configRes = ResManager.game.config.rockDifficulty;
        }
        let rockIndex = parseInt((Math.random() * rockRes.length).toString());
        let rockTexture = rockRes[rockIndex];
        let boxSize = configRes[rockIndex];
        box.size.width = boxSize[0];
        box.size.height = boxSize[1];

        self.node.name = "rock" + rockIndex;
        SpriteManager.loadSpriteForNode(self.node, rockTexture, function () {
            //console.log("Rock[%s] box size: %sx%s", rockIndex, box.size.width, box.size.height);
        });
    }

    protected onCollisionEnter(other) {
        //console.log("Rock: 碰到了%s", other.node.name);
    }

    protected onCollisionStay(other) {
        //console.log("Rock: 穿过了%s", other.node.name);
    }

    protected onCollisionExit(other) {
        //console.log("Rock: 离开了%s", other.node.name);
    }

}