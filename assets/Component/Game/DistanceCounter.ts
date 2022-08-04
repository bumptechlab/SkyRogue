// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import LabelManager from "../../Framework/UI/LabelManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DistanceCounter extends cc.Component {

    @property(cc.Label)
    distanceLabel: cc.Label = null;

    private finishCallback = null;
    private distance: number = 0;

    protected onLoad(): void {
        let self = this;
        LabelManager.setLabelString(self.distanceLabel, self.distance + "m");
    }

    public init(finishCallback) {
        let self = this;
        self.finishCallback = finishCallback;
        self.distance = 0;
        LabelManager.setLabelString(self.distanceLabel, self.distance + "m");
    }

    public startCount() {
        let self = this;
        self.unscheduleAllCallbacks();
        self.schedule(function () {
            self.distance++;
            LabelManager.setLabelString(self.distanceLabel, self.distance + "m");
        }, 1, cc.macro.REPEAT_FOREVER, 0);
    }

    public stopCount() {
        let self = this;
        self.unscheduleAllCallbacks();
        if (self.finishCallback) {
            self.finishCallback(self.distance);
        }
    }

    public getDistance() {
        let self = this;
        return self.distance;
    }

    protected onDestroy(): void {
        let self = this;
        self.unscheduleAllCallbacks();
    }
}