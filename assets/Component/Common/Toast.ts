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
export default class Toast extends cc.Component {

    @property(cc.Label)
    message: cc.Label = null;

    public init(message): void {
        let self = this;
        if (cc.isValid(self.node)) {
            self.node.active = true;
        }
        if (cc.isValid(self.message)) {
            self.message.string = message;
        }
        if (self.hideToast) {
            console.log("show toast: " + message);
            self.unschedule(self.hideToast);
            self.schedule(self.hideToast, 0, 1, 2);
        }
        let size = cc.winSize;
        if (size) {
            self.node.x = size.width / 2;
            self.node.y = size.height / 2;
        }
        //console.log("w: " + self.node.width + " h: " + self.node.height + " x: " + self.node.x + " y: " + self.node.y);
    }

    public hideToast(): void {
        console.log("hide toast......");
        let self = this;
        self.node.active = false;
    }


}