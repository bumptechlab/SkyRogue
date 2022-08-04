// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Rock extends cc.Component {

    protected onLoad(): void {
    }

    protected onCollisionEnter(other) {
        console.log("Rock: 碰到了%s", other.node.name);
    }

    protected onCollisionStay(other) {
        console.log("Rock: 穿过了%s", other.node.name);
    }

    protected onCollisionExit(other) {
        console.log("Rock: 离开了%s", other.node.name);
    }

}