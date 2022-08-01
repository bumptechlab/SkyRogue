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
export default class RandomAvatar extends cc.Component {


    @property([cc.SpriteFrame])
    avatarFrames: cc.SpriteFrame[] = [];

    @property(cc.Node)
    avatarUpSprite: cc.Node = null;

    @property(cc.Node)
    avatarSprite: cc.Node = null;

    @property(cc.Node)
    avatarDownSprite: cc.Node = null;

    private animRunning: boolean = false;
    private userAvatar: number = 0;
    private finishCallback = null;
    private INIT_STEP = 20;   //匀速运动的滚动速度，每次update滚动多少像素
    private ROLL_TIME = 2000; //匀速滚动的时间，毫秒

    protected onLoad(): void {
        let self = this;
        self.avatarUpSprite.y = 156;
        self.avatarSprite.y = 0;
        self.avatarDownSprite.y = -156;
    }

    public startRandomAnimation(userAvatar: number, finishCallback) {
        let self = this;
        self.animRunning = true;
        self.topAvatarNode = null;
        self.animBeginTime = new Date().getTime();
        self.lastSlowDownTime = 0;
        self.step = self.INIT_STEP;

        console.log("Start to roll, will stop at avatar: " + userAvatar);
        self.finishCallback = finishCallback;
        self.userAvatar = userAvatar;
    }

    public stopRandomAnimation() {
        let self = this;
        self.animRunning = false;
        self.topAvatarNode = null;
        self.animBeginTime = 0;
        self.lastSlowDownTime = 0;
        self.step = self.INIT_STEP;
    }

    public isAnimRunning(): boolean {
        return this.animRunning;
    }

    private step = this.INIT_STEP; //控制滚动速度，允许阶段该值不变，减速阶段，每100毫秒减少2
    private animBeginTime: number = 0;
    private lastSlowDownTime: number = 0;
    private topAvatarNode: cc.Node = null;

    protected update(dt: number): void {
        let self = this;
        if (!self.animRunning) {
            return;
        }
        let now = new Date().getTime();
        if (now - self.animBeginTime > self.ROLL_TIME) { //2秒后开始减速
            if (now - self.lastSlowDownTime > 100) {
                console.log("开始减速, step=%s", self.step);
                self.step -= 2;
                if (self.step <= 2) {
                    self.step = 2;
                    if (!cc.isValid(self.topAvatarNode)) {
                        self.topAvatarNode = self.findTopAvatar();
                        let avatarPath = ResManager.common.texture.userAvatarsVS[self.userAvatar];
                        SpriteManager.loadSpriteForNode(self.topAvatarNode, avatarPath);
                    }
                }
                self.lastSlowDownTime = now; //后一秒用来减速，每100毫秒减速一次
            }
        }

        self.moveNodeByStep(self.avatarUpSprite);
        self.moveNodeByStep(self.avatarSprite);
        self.moveNodeByStep(self.avatarDownSprite);

        if (cc.isValid(self.topAvatarNode)) {
            if (self.topAvatarNode.y <= 0) {
                console.log("topAvatarNode y=" + self.topAvatarNode.y);
                self.stopRandomAnimation();
                if (self.finishCallback) {
                    self.finishCallback();
                }
            }
        }

    }

    protected moveNodeByStep(node: cc.Node) {
        let self = this;
        node.y -= self.step;
        if (node.y < -156) {
            node.y = 312;
            self.changeAvatar(node);
        }
    }

    private lastAvatar = -1;

    protected changeAvatar(node: cc.Node) {
        let self = this;
        let curAvatar = -1;
        do {
            curAvatar = parseInt((Math.random() * self.avatarFrames.length).toString());
        } while (self.lastAvatar == curAvatar);
        self.lastAvatar = curAvatar;
        SpriteManager.setSpriteFrame(node, self.avatarFrames[curAvatar]);
    }

    private findTopAvatar() {
        let self = this;
        let children = self.node.children;
        let topY = 0;
        let topAvatar = null;
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if (child.y > topY) {
                topAvatar = child;
                topY = child.y;
            }
        }
        return topAvatar;
    }
}
