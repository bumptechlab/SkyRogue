// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "../../Framework/Business/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RockScene extends cc.Component {


    private speed: number = 5;
    private paused: boolean = true;

    private lastElapsedTime: number = 0;
    private randomInterval: number = 0;
    private outPositionY: number = 0;

    protected onLoad(): void {
        let self = this;
        let worldPositionY = -50; //石头在屏幕外被移除的Y轴位置，使用世界坐标
        let nodePos = self.node.convertToNodeSpaceAR(new cc.v2(0, worldPositionY));
        self.outPositionY = nodePos.y;
        console.log("RockScene: outPositionY=" + self.outPositionY);
    }

    public startGame(): void {
        let self = this;
        self.node.removeAllChildren();
        self.setPaused(false);
    }

    public stopGame(): void {
        let self = this;
        self.node.removeAllChildren();
        self.setPaused(true);
    }

    public setSpeed(speed: number): void {
        let self = this;
        self.speed = speed;
    }

    private setPaused(paused: boolean) {
        let self = this;
        self.paused = paused;
    }

    protected update(dt: number): void {
        let self = this;
        if (self.paused) {
            return;
        }
        self.createRandomRocks(dt);
        self.renderRocks();
    }

    protected createRandomRocks(dt) {
        let self = this;
        self.lastElapsedTime += dt;
        if (self.lastElapsedTime >= self.randomInterval) {
            let rockNode = GameManager.createRockNode();
            rockNode.y = cc.winSize.height / 2 + 50;//出现在屏幕上方超出50像素的位置
            rockNode.x = (Math.random() * self.node.width) - self.node.width / 2; //出现在显示区域的随机x坐标上
            self.node.addChild(rockNode);

            self.randomInterval = Math.random() * 3; //随机0-3秒之间生成一个石头
            self.lastElapsedTime = 0;
            console.log("Create %s, next rock in %s seconds", rockNode.name, self.randomInterval);
        }
    }

    protected renderRocks() {
        let self = this;
        let outChildren: cc.Node[] = [];
        for (let i = 0; i < self.node.children.length; i++) {
            let child = self.node.children[i];
            child.y -= self.speed;
            //统计移动到屏幕外的节点
            if (child.y <= self.outPositionY) {
                outChildren.push(child);
            }
        }
        for (let i = 0; i < outChildren.length; i++) {
            outChildren[i].removeFromParent();
        }
    }

}