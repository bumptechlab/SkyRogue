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
import CommonFunction from "../../Framework/Base/CommonFunction";
import CommonAudioMgr from "../../Framework/Base/CommonAudioMgr";
import ResManager from "../../Framework/Resources/ResManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseDialog extends cc.Component {

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Node)
    body: cc.Node = null;

    public showDialog(finishCallback?) {
        let self = this;

        let bodyCallback = cc.callFunc(function () {
            if (finishCallback) {
                finishCallback();
            }
        });

        let popDialogShown = cc.callFunc(function () {
            if (cc.isValid(self.body)) {
                self.body.active = true;
                self.body.runAction(cc.sequence(
                    cc.delayTime(0.04),
                    cc.fadeIn(0.2),
                    cc.delayTime(0.1),
                    bodyCallback
                ));
            }
        });

        if (cc.isValid(self.node)) {
            self.node.setPosition(0, 0);
            self.node.opacity = 0;
            self.node.scale = 0;
            self.node.width = cc.winSize.width;
            self.node.height = cc.winSize.height;
            self.node.active = true;
            self.node.runAction(cc.sequence(
                cc.spawn(
                    cc.fadeIn(0.15),
                    cc.scaleTo(0.15, 1.1),
                ),
                cc.scaleTo(0.15, 1.0),
                popDialogShown,
            )).easing(cc.easeSineOut());
        }
    }

    public dismissDialog(finishCallback?) {
        let self = this;
        let dismissCallback = cc.callFunc(function () {
            if (finishCallback) {
                finishCallback();
            }
        });
        if (cc.isValid(self.node)) {
            self.node.runAction(cc.sequence(
                cc.scaleTo(0.08, 1.1),
                cc.scaleTo(0.1, 0),
                cc.callFunc(function () {
                    if (cc.isValid(self.node)) {
                        self.node.active = false;
                        self.body.active = false;
                    }
                    self.node.removeFromParent();
                }, self.node),
                dismissCallback
            )).easing(cc.easeIn(3.0));
        }
    }

    protected onClickCloseBtn(event) {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

        this.dismissDialog();
    }
}