// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Vec2 = cc.Vec2;

const {ccclass, property} = cc._decorator;

@ccclass
export default class CommonDragView extends cc.Component {

    //控件能在此范围内移动的世界坐标边界值
    private left: number = 0;
    private right: number = 0;
    private top: number = 0;
    private bottom: number = 0;

    private touchStartTime: number = 0;
    private lastClickTime: number = 0;
    private longClickTimer = null;


    private LONG_CLICK_TIME: number = 50; //设置长按多少毫秒后可以移动控件
    private CLICK_INTERVAL: number = 1500; //防爆点击时间间隔
    private isLongClick: boolean = false; //true:正处于长按状态（可以拖动窗口）;false:没有处于长按状态（不可拖动窗口）

    private onClickCallback = null;
    private onLongClickCallback = null;

    private parentWidth: number = 0;
    private parentHeight: number = 0;
    private lastUpdateTime: number = 0;
    private draggable: boolean = true;

    protected onLoad(): void {
        let self = this;
        self.registerReceiver();
        //先在onLoad方法计算移动边界坐标，避免在移动过程中做过多计算
        self.initDragBorder();
        //self.initDefaultPosition();
    }

    protected onDestroy(): void {
        let self = this;
        self.unregisterReceiver();
    }

    protected update(dt: number): void {
        let self = this;
        let now = self.getNow();
        if (now - self.lastUpdateTime < 1500) {
            return;
        }
        self.lastUpdateTime = now;
        //当父节点尺寸变化时，重新计算边界
        if (cc.isValid(self.node.parent)) {
            if (self.parentWidth != self.node.parent.width
                || self.parentHeight != self.node.parent.height) {
                self.initDragBorder();
            }
        }
    }

    public setDraggable(draggable: boolean) {
        let self = this;
        self.draggable = draggable;
    }

    private registerReceiver(): void {
        let self = this;
        self.node.on(cc.Node.EventType.TOUCH_START, self.onTouchStart, self);
        self.node.on(cc.Node.EventType.TOUCH_MOVE, self.onTouchMove, self);
        self.node.on(cc.Node.EventType.TOUCH_END, self.onTouchEnd, self);
        self.node.on(cc.Node.EventType.TOUCH_CANCEL, self.onTouchCancel, self);
    }

    private unregisterReceiver(): void {
        let self = this;
        self.node.off(cc.Node.EventType.TOUCH_START);
        self.node.off(cc.Node.EventType.TOUCH_MOVE);
        self.node.off(cc.Node.EventType.TOUCH_END);
        self.node.off(cc.Node.EventType.TOUCH_CANCEL);
    }

    /**
     * 初始化拖拽的边界的世界坐标
     */
    private initDragBorder(): void {
        let self = this;
        if (cc.isValid(self.node) && cc.isValid(self.node.parent)) {
            self.parentWidth = self.node.parent.width;
            self.parentHeight = self.node.parent.height;

            //先计算父节点坐标系上的边界值
            let leftInParent = -(self.node.parent.width * self.node.parent.anchorX);
            let rightInParent = self.node.parent.width * (1 - self.node.parent.anchorX);
            let topInParent = self.node.parent.height * (1 - self.node.parent.anchorY);
            let bottomInParent = -(self.node.parent.height * self.node.parent.anchorY);

            //父节点上的边界值转换为世界坐标
            let leftTopWorldPos = self.node.parent.convertToWorldSpaceAR(new Vec2(leftInParent, topInParent));
            let rightBottomWorldPos = self.node.parent.convertToWorldSpaceAR(new Vec2(rightInParent, bottomInParent));

            //以下保证活动区域不超出屏幕边界
            if (leftTopWorldPos.x < 0) {
                leftTopWorldPos.x = 0;
            }
            if (leftTopWorldPos.y > cc.winSize.height) {
                leftTopWorldPos.y = cc.winSize.height;
            }
            if (rightBottomWorldPos.x > cc.winSize.width) {
                rightBottomWorldPos.x = cc.winSize.width;
            }
            if (rightBottomWorldPos.y < 0) {
                rightBottomWorldPos.y = 0;
            }

            self.left = leftTopWorldPos.x + (self.node.width / 2);
            self.top = leftTopWorldPos.y - (self.node.height / 2);
            self.right = rightBottomWorldPos.x - (self.node.width / 2);
            self.bottom = rightBottomWorldPos.y + (self.node.height / 2);
        }
        console.log("拖拽边界:[%s, %s, %s, %s]", self.left, self.top, self.right, self.bottom);
    }

    /**
     * 默认位置在右上角
     */
    private initDefaultPosition(): void {
        let self = this;
        let initX = self.right;
        let initY = self.top;
        self.moveToPos(new cc.Vec2(initX, initY));
    }

    /**
     *
     * @param onClickCallback 点击事件回调
     * @param onLongClickCallback 长按事件回调
     */
    public init(onClickCallback, onLongClickCallback): void {
        let self = this;
        self.onClickCallback = onClickCallback;
        self.onLongClickCallback = onLongClickCallback;
    }

    /**
     * 初始化位置
     * @param position
     */
    public initPosition(position?: cc.Vec2): void {
        let self = this;
        self.scheduleOnce(function () {
            self.initDragBorder();
            if (position) {
                self.moveToPos(position);
            } else {
                self.initDefaultPosition();
            }
        }, 0);
    }


    /**
     * 长按放大悬浮窗
     */
    protected zoomInViewSize(resize: boolean = true): void {
        let self = this;
        if (resize) {
            if (cc.isValid(self.node)) {
                self.node.stopAllActions();
                self.node.runAction(cc.scaleTo(0.1, 1.2));
            }
        }
        self.isLongClick = true;
    }

    /**
     * 放手后悬浮窗恢复原大小
     */
    protected recoverViewSize(resize: boolean = true): void {
        let self = this;
        if (resize) {
            if (cc.isValid(self.node)) {
                self.node.stopAllActions();
                self.node.runAction(cc.scaleTo(0.1, 1.0));
            }
        }
        self.isLongClick = false;
    }

    protected onTouchStart(event): void {
        let self = this;
        self.touchStartTime = self.getNow();
        console.log("==》onTouchStart");

        self.longClickTimer = setTimeout(function () {
            self.zoomInViewSize(false);
            self.clearLongClickTimer();
        }, self.LONG_CLICK_TIME);
    }

    protected clearLongClickTimer() {
        let self = this;
        if (self.longClickTimer) {
            clearTimeout(self.longClickTimer);
            self.longClickTimer = null;
        }
    }

    protected onTouchEnd(event): void {
        let self = this;
        self.clearLongClickTimer();
        let now = self.getNow();
        let clickTime = now - self.touchStartTime;
        let clickInterval = now - self.lastClickTime;
        console.log("==》onTouchEnd: clickTime=%sms, clickInterval=%sms, isLongClick=%s", clickTime, clickInterval, self.isLongClick);

        //clickTime，为按钮点击时长，小于LONG_CLICK_TIME，判断为普通点击
        //clickInterval, 就上次完成点击时间间隔，用于防爆点击
        if (!self.isLongClick) {
            if (clickTime < self.LONG_CLICK_TIME && clickInterval > self.CLICK_INTERVAL) {
                if (typeof self.onClickCallback == "function") {
                    self.onClickCallback(event);
                }
            }
            self.lastClickTime = now;
        } else {
            if (typeof self.onLongClickCallback == "function") {
                self.onLongClickCallback(event);
            }
        }
        self.recoverViewSize(false);
    }

    protected onTouchCancel(event): void {
        let self = this;
        console.log("==》onTouchCancel");
        self.clearLongClickTimer();
        self.recoverViewSize(false);
    }

    protected onTouchMove(event): void {
        let self = this;
        if (!self.isLongClick) {
            return;
        }
        if (!self.draggable) {
            return;
        }
        //console.log("鼠标移动了, 世界坐标[%s, %s]", event.getLocationX(), event.getLocationY());
        let worldPos = new cc.Vec2(event.getLocationX(), event.getLocationY());
        self.moveToPos(worldPos);
    }

    /**
     * 悬浮窗移动到指定世界坐标
     * @param worldPos
     */
    public moveToPos(worldPos: cc.Vec2): void {
        let self = this;
        if (!worldPos) {
            return;
        }
        if (cc.isValid(self.node) && cc.isValid(self.node.parent)) {
            let moveX = worldPos.x;
            let moveY = worldPos.y;

            //保证控件的边界不超出活动范围
            if (moveX > self.right) {
                moveX = self.right;
            } else if (moveX < self.left) {
                moveX = self.left;
            }

            if (moveY > self.top) {
                moveY = self.top;
            } else if (moveY < self.bottom) {
                moveY = self.bottom;
            }

            //触摸点的世界坐标
            let pos = new cc.Vec2(moveX, moveY);
            //转换为节点坐标
            pos = self.node.parent.convertToNodeSpaceAR(pos);
            self.node.position = pos;
        }
    }

    private getNow() {
        return (new Date()).getTime();
    }
}