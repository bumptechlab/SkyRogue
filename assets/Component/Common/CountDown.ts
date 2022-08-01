// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import CountDownUtil from "../../Framework/Utils/CountDownUtil";
import SpriteManager from "../../Framework/UI/SpriteManager";
import ResManager from "../../Framework/Resources/ResManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CountDown extends cc.Component {

    private COUNT_DOWN_TAG = 12030;
    private countDownUtil: CountDownUtil = null;

    private numberSprites: cc.Node[] = [];

    private countdownCallback = null;

    protected onLoad(): void {
        let self = this;
        self.countDownUtil = new CountDownUtil(self.node, self.COUNT_DOWN_TAG, self.countDownCallback.bind(self));
        let layout = self.node.getComponent(cc.Layout);
        if (!layout) {
            layout = self.node.addComponent(cc.Layout);
            layout.type = cc.Layout.Type.HORIZONTAL;
            layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
            layout.spacingX = 15;
        }
    }

    public init(countdownCallback) {
        this.countdownCallback = countdownCallback;
    }

    private countDownCallback(leftTs) {
        let self = this;
        let leftTsText = leftTs.toString();
        if (self.numberSprites.length != leftTsText.length) {
            self.createNumberSprites(leftTsText.length);
        }
        for (let i = 0; i < leftTsText.length; i++) {
            let number = parseInt(leftTsText.substr(i, 1));
            let numberPath = ResManager.common.texture.numbers[number];
            SpriteManager.loadSpriteForNode(self.numberSprites[i], numberPath);
        }
        if (leftTs <= 0) {
            self.node.active = false;
        }
        if (self.countdownCallback) {
            self.countdownCallback(leftTs);
        }
    }

    private createNumberSprites(count) {
        let self = this;
        self.node.removeAllChildren();
        self.numberSprites = [];
        for (let i = 0; i < count; i++) {
            let numberNode = SpriteManager.createSpriteNode("number" + i);
            self.node.addChild(numberNode);
            self.numberSprites[i] = numberNode;
        }
    }

    public startCountDown(leftTs) {
        let self = this;
        self.node.active = true;
        self.countDownUtil.startCountDown(leftTs);
    }

    public stopCountDown() {
        let self = this;
        self.countDownUtil.stopCountDown();
        self.node.active = false;
    }
}