export default class CountDownUtil {

    private COUNT_DOWN_ACTION_TAG = 9111024911;

    private _componentNode: cc.Node = null;
    private _leftTs = 0;
    private _callback: Function = null;

    constructor(componentNode, countDownActionTag, callback) {
        let self = this;
        self._componentNode = componentNode;
        self._callback = callback;
        self.COUNT_DOWN_ACTION_TAG = countDownActionTag;
        self.stopCountDown();
    }

    public startCountDown(leftTs) {
        let self = this;

        if (self._leftTs > 0) {//已经在倒计时
            self._leftTs = leftTs;
            self.callback(leftTs);

        } else {// 没有倒计时
            if (leftTs <= 0) {
                // do nothing
            } else {
                // 需要开始倒计时
                self.stopCountDown();
                if (cc.isValid(self._componentNode)) {
                    self.callback(leftTs);
                    self._componentNode.runAction(self.countDownAction(leftTs));
                }
            }
        }
    }

    public getLeftTs() {
        return this._leftTs;
    }

    private countDownAction(leftTs) {
        let self = this;
        self._leftTs = leftTs;
        let action = cc.repeatForever(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(function () {
                if (self._leftTs <= 0) {
                    self.callback(0);
                    return;
                }
                self._leftTs--;
                if (cc.isValid(self._componentNode)) {
                    if (self._leftTs > 0) {
                        self.callback(self._leftTs);
                    } else {
                        self.callback(0);
                    }
                }
            })));
        action.setTag(self.COUNT_DOWN_ACTION_TAG);
        return action;
    }

    public stopCountDown() {
        let self = this;
        self._leftTs = 0;
        if (cc.isValid(self._componentNode)) {
            self._componentNode.stopActionByTag(self.COUNT_DOWN_ACTION_TAG);
        }
    }

    /**
     *
     * @param currLeftTs 单位：秒
     */
    private callback(currLeftTs) {
        if (this._callback) {
            if (currLeftTs <= 0) {
                this.stopCountDown();
            }
            this._callback(currLeftTs);
        }
    }
}