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
import CommonFunction from "../../Framework/Base/CommonFunction";
import CommonAudioMgr from "../../Framework/Base/CommonAudioMgr";
import ResManager from "../../Framework/Resources/ResManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GestureSelector extends cc.Component {

    @property(cc.Node)
    scissorNode: cc.Node = null;

    @property(cc.Node)
    rockNode: cc.Node = null;

    @property(cc.Node)
    paperNode: cc.Node = null;

    private selectCallback;
    private selectedGesture;

    protected onLoad(): void {
        this.selectedGesture = GameManager.GESTURE.NONE;
        this.selectGesture(this.selectedGesture);
    }

    public init(selectCallback) {
        this.selectCallback = selectCallback;
    }

    protected onSelectGesture(event, data) {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

        console.log("Select gesture: data=" + data);
        let gesture = parseInt(data);
        this.selectGesture(gesture);
    }

    public selectGesture(gesture: number) {
        if (gesture == GameManager.GESTURE.SCISSORS) {
            this.setChosenIconVisible(this.scissorNode, true);
            this.setChosenIconVisible(this.rockNode, false);
            this.setChosenIconVisible(this.paperNode, false);
        } else if (gesture == GameManager.GESTURE.ROCK) {
            this.setChosenIconVisible(this.scissorNode, false);
            this.setChosenIconVisible(this.rockNode, true);
            this.setChosenIconVisible(this.paperNode, false);
        } else if (gesture == GameManager.GESTURE.PAPER) {
            this.setChosenIconVisible(this.scissorNode, false);
            this.setChosenIconVisible(this.rockNode, false);
            this.setChosenIconVisible(this.paperNode, true);
        } else {
            this.setChosenIconVisible(this.scissorNode, false);
            this.setChosenIconVisible(this.rockNode, false);
            this.setChosenIconVisible(this.paperNode, false);
        }
        this.selectedGesture = gesture;
        if (this.selectCallback) {
            this.selectCallback(gesture);
        }
    }

    private setChosenIconVisible(gestureNode: cc.Node, visible: boolean) {
        if (cc.isValid(gestureNode)) {
            let chosenIcon = gestureNode.getChildByName("chosen");
            if (cc.isValid(chosenIcon)) {
                chosenIcon.active = visible;
            }
        }
    }


    public getSelectedGesture() {
        return this.selectedGesture;
    }
}