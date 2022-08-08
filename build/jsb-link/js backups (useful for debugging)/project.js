window.__require = function e(t, o, n) {
function a(c, r) {
if (!o[c]) {
if (!t[c]) {
var s = c.split("/");
s = s[s.length - 1];
if (!t[s]) {
var l = "function" == typeof __require && __require;
if (!r && l) return l(s, !0);
if (i) return i(s, !0);
throw new Error("Cannot find module '" + c + "'");
}
}
var u = o[c] = {
exports: {}
};
t[c][0].call(u.exports, function(e) {
return a(t[c][1][e] || e);
}, u, u.exports, e, t, o, n);
}
return o[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < n.length; c++) a(n[c]);
return a;
}({
BaseDialog: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "14bdehL0z9MPKq50KveFAqL", "BaseDialog");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../Framework/Base/CommonFunction"), a = e("../../Framework/Base/CommonAudioMgr"), i = e("../../Framework/Resources/ResManager"), c = cc._decorator, r = c.ccclass, s = c.property, l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.mask = null;
t.body = null;
return t;
}
t.prototype.showDialog = function(e) {
var t = this, o = cc.callFunc(function() {
e && e();
}), n = cc.callFunc(function() {
if (cc.isValid(t.body)) {
t.body.active = !0;
t.body.runAction(cc.sequence(cc.delayTime(.04), cc.fadeIn(.2), cc.delayTime(.1), o));
}
});
if (cc.isValid(t.node)) {
t.node.setPosition(0, 0);
t.node.opacity = 0;
t.node.scale = 0;
t.node.width = cc.winSize.width;
t.node.height = cc.winSize.height;
t.node.active = !0;
t.node.runAction(cc.sequence(cc.spawn(cc.fadeIn(.15), cc.scaleTo(.15, 1.1)), cc.scaleTo(.15, 1), n)).easing(cc.easeSineOut());
}
};
t.prototype.dismissDialog = function(e) {
var t = this, o = cc.callFunc(function() {
e && e();
});
cc.isValid(t.node) && t.node.runAction(cc.sequence(cc.scaleTo(.08, 1.1), cc.scaleTo(.1, 0), cc.callFunc(function() {
if (cc.isValid(t.node)) {
t.node.active = !1;
t.body.active = !1;
}
t.node.removeFromParent();
}, t.node), o)).easing(cc.easeIn(3));
};
t.prototype.onClickCloseBtn = function(e) {
n.default.clickManager(e.target);
a.default.playEffect(i.default.common.audio.btnClick);
this.dismissDialog();
};
__decorate([ s(cc.Node) ], t.prototype, "mask", void 0);
__decorate([ s(cc.Node) ], t.prototype, "body", void 0);
return t = __decorate([ r ], t);
}(cc.Component);
o.default = l;
cc._RF.pop();
}, {
"../../Framework/Base/CommonAudioMgr": "CommonAudioMgr",
"../../Framework/Base/CommonFunction": "CommonFunction",
"../../Framework/Resources/ResManager": "ResManager"
} ],
CommonAudioMgr: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "41d11WF1eVPeon98lXB57lo", "CommonAudioMgr");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../Utils/LocalStorageMgr"), a = function() {
function e() {}
e.init = function() {
this.EffectListArr = [];
this.AudioMusicArray = [];
this.AudioEffectArray = [];
this.AudioMusicFile = null;
this.MaxAudioMusicLength = 1;
this.MaxAudioEffectLength = 3;
this.AUDIO_MUSIC_VOLUME = 1;
this.AUDIO_EFFECT_VOLUME = .5;
this.MusicID = -1;
this.changeEffectSwitch();
};
e.changeEffectSwitch = function() {
var e = n.default.readEffectSwitch();
this.IS_OPEN_EFFECT = !e || "true" == e;
};
e.playEffect = function(e, t, o, n, a) {
void 0 === t && (t = !1);
void 0 === o && (o = this.AUDIO_EFFECT_VOLUME);
void 0 === n && (n = null);
void 0 === a && (a = null);
var i = this;
if (i.IS_OPEN_EFFECT && e) {
void 0 == t && (t = !1);
void 0 == o && (o = i.AUDIO_EFFECT_VOLUME);
cc.loader.loadRes(e, function(c, r) {
if (c) {
console.log("playEffect: " + e + " err=>" + c);
a && a();
} else {
var s = cc.audioEngine.play(r, t, o);
i.AudioEffectArray.push(s);
cc.audioEngine.setFinishCallback(s, function() {
a && a();
});
n && n(s);
}
});
if (i.AudioEffectArray.length >= i.MaxAudioEffectLength) {
var c = i.AudioEffectArray.shift();
i.safeStopEffect(c);
}
} else a && a();
};
e.playMultiEffect = function(e, t, o, n, a, i) {
var c = this;
if (c.IS_OPEN_EFFECT && e) {
void 0 == t && (t = !1);
void 0 == o && (o = c.AUDIO_EFFECT_VOLUME);
i && i(c.EffectListArr, 22);
if (c.EffectListArr.length >= 22) {
a && a(-1);
return;
}
cc.loader.loadRes(e, function(i, r) {
if (i) {
console.log("playMultiEffect: " + e + " err=>" + i);
a && a(-1);
} else {
var s = cc.audioEngine.play(r, t, o);
-1 != s && c.EffectListArr.push(s);
cc.audioEngine.setFinishCallback(s, function() {
var e = c.EffectListArr.indexOf(s);
e > -1 && c.EffectListArr.splice(e, 1);
a && a(s);
});
n && n(s);
}
});
} else a && a(-1);
};
e.playMusic = function(e, t, o) {
var a = this, i = "true", c = n.default.readMusicSwitch();
null != c && (i = c);
if ("false" != i) if (a.AudioMusicFile != e) {
void 0 == t && (t = !0);
void 0 == o && (o = a.AUDIO_MUSIC_VOLUME);
"true" == i && cc.loader.loadRes(e, function(n, i) {
if (n) console.log("play Music: " + e + " err=>" + n); else {
a.stopAll();
var c = cc.audioEngine.playMusic(i, t);
cc.audioEngine.setMusicVolume(o);
a.MusicID = c;
a.AudioMusicFile = e;
}
});
} else console.log("音乐正在播放，不能重复播放：%s", e); else a.stopMusic();
};
e.playMusicWithNoLoop = function(t, o, a, i) {
void 0 === a && (a = !1);
void 0 === i && (i = e.AUDIO_MUSIC_VOLUME);
var c = this, r = "true", s = n.default.readMusicSwitch();
null != s && (r = s);
if ("false" != r) if (c.AudioMusicFile != t) {
void 0 == a && (a = !1);
void 0 == i && (i = c.AUDIO_MUSIC_VOLUME);
"true" == r && cc.loader.loadRes(t, function(e, n) {
if (e) {
console.log("play Music: " + t + " err=>" + e);
o && o();
} else {
c.stopAll();
var r = cc.audioEngine.playMusic(n, a);
cc.audioEngine.setMusicVolume(i);
cc.audioEngine.setFinishCallback(r, function() {
o && o();
});
c.AudioMusicFile = t;
}
});
} else console.log("音乐正在播放，不能重复播放：%s", t); else this.stopMusic();
};
e.stopMusic = function() {
this.AudioMusicFile = null;
if (cc.audioEngine.getState(this.MusicID) != cc.audioEngine.AudioState.STOPPED && cc.audioEngine.getState(this.MusicID) != cc.audioEngine.AudioState.ERROR) {
cc.audioEngine.stopMusic();
this.MusicID = -1;
}
};
e.stopEffect = function(e) {
if (e) {
this.safeStopEffect(e);
var t = this.EffectListArr.indexOf(e);
t > -1 && this.EffectListArr.splice(t, 1);
}
};
e.safeStopEffect = function(e) {
cc.audioEngine.getState(e) != cc.audioEngine.AudioState.STOPPED && cc.audioEngine.getState(e) != cc.audioEngine.AudioState.ERROR && cc.audioEngine.stop(e);
};
e.pauseAll = function() {
cc.audioEngine.pauseAll();
};
e.resumeAll = function() {
cc.audioEngine.resumeAll();
};
e.stopAll = function() {
this.AudioMusicFile = null;
this.EffectListArr = [];
cc.audioEngine.stopAll();
};
e.IS_OPEN_EFFECT = !0;
return e;
}();
o.default = a;
cc._RF.pop();
}, {
"../Utils/LocalStorageMgr": "LocalStorageMgr"
} ],
CommonDragView: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "df079+jUMlNWZLEcjTonSe4", "CommonDragView");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc.Vec2, a = cc._decorator, i = a.ccclass, c = (a.property, function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.left = 0;
t.right = 0;
t.top = 0;
t.bottom = 0;
t.touchStartTime = 0;
t.lastClickTime = 0;
t.longClickTimer = null;
t.LONG_CLICK_TIME = 50;
t.CLICK_INTERVAL = 1500;
t.isLongClick = !1;
t.onClickCallback = null;
t.onLongClickCallback = null;
t.parentWidth = 0;
t.parentHeight = 0;
t.lastUpdateTime = 0;
t.draggable = !0;
return t;
}
t.prototype.onLoad = function() {
this.registerReceiver();
this.initDragBorder();
};
t.prototype.onDestroy = function() {
this.unregisterReceiver();
};
t.prototype.update = function(e) {
var t = this.getNow();
if (!(t - this.lastUpdateTime < 1500)) {
this.lastUpdateTime = t;
cc.isValid(this.node.parent) && (this.parentWidth == this.node.parent.width && this.parentHeight == this.node.parent.height || this.initDragBorder());
}
};
t.prototype.setDraggable = function(e) {
this.draggable = e;
};
t.prototype.registerReceiver = function() {
this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
};
t.prototype.unregisterReceiver = function() {
this.node.off(cc.Node.EventType.TOUCH_START);
this.node.off(cc.Node.EventType.TOUCH_MOVE);
this.node.off(cc.Node.EventType.TOUCH_END);
this.node.off(cc.Node.EventType.TOUCH_CANCEL);
};
t.prototype.initDragBorder = function() {
if (cc.isValid(this.node) && cc.isValid(this.node.parent)) {
this.parentWidth = this.node.parent.width;
this.parentHeight = this.node.parent.height;
var e = -this.node.parent.width * this.node.parent.anchorX, t = this.node.parent.width * (1 - this.node.parent.anchorX), o = this.node.parent.height * (1 - this.node.parent.anchorY), a = -this.node.parent.height * this.node.parent.anchorY, i = this.node.parent.convertToWorldSpaceAR(new n(e, o)), c = this.node.parent.convertToWorldSpaceAR(new n(t, a));
i.x < 0 && (i.x = 0);
i.y > cc.winSize.height && (i.y = cc.winSize.height);
c.x > cc.winSize.width && (c.x = cc.winSize.width);
c.y < 0 && (c.y = 0);
this.left = i.x + this.node.width / 2;
this.top = i.y - this.node.height / 2;
this.right = c.x - this.node.width / 2;
this.bottom = c.y + this.node.height / 2;
}
console.log("拖拽边界:[%s, %s, %s, %s]", this.left, this.top, this.right, this.bottom);
};
t.prototype.initDefaultPosition = function() {
var e = this.right, t = this.top;
this.moveToPos(new cc.Vec2(e, t));
};
t.prototype.init = function(e, t) {
this.onClickCallback = e;
this.onLongClickCallback = t;
};
t.prototype.initPosition = function(e) {
var t = this;
t.scheduleOnce(function() {
t.initDragBorder();
e ? t.moveToPos(e) : t.initDefaultPosition();
}, 0);
};
t.prototype.zoomInViewSize = function(e) {
void 0 === e && (e = !0);
if (e && cc.isValid(this.node)) {
this.node.stopAllActions();
this.node.runAction(cc.scaleTo(.1, 1.2));
}
this.isLongClick = !0;
};
t.prototype.recoverViewSize = function(e) {
void 0 === e && (e = !0);
if (e && cc.isValid(this.node)) {
this.node.stopAllActions();
this.node.runAction(cc.scaleTo(.1, 1));
}
this.isLongClick = !1;
};
t.prototype.onTouchStart = function(e) {
var t = this;
t.touchStartTime = t.getNow();
console.log("==》onTouchStart");
t.longClickTimer = setTimeout(function() {
t.zoomInViewSize(!1);
t.clearLongClickTimer();
}, t.LONG_CLICK_TIME);
};
t.prototype.clearLongClickTimer = function() {
if (this.longClickTimer) {
clearTimeout(this.longClickTimer);
this.longClickTimer = null;
}
};
t.prototype.onTouchEnd = function(e) {
this.clearLongClickTimer();
var t = this.getNow(), o = t - this.touchStartTime, n = t - this.lastClickTime;
console.log("==》onTouchEnd: clickTime=%sms, clickInterval=%sms, isLongClick=%s", o, n, this.isLongClick);
if (this.isLongClick) "function" == typeof this.onLongClickCallback && this.onLongClickCallback(e); else {
o < this.LONG_CLICK_TIME && n > this.CLICK_INTERVAL && "function" == typeof this.onClickCallback && this.onClickCallback(e);
this.lastClickTime = t;
}
this.recoverViewSize(!1);
};
t.prototype.onTouchCancel = function(e) {
console.log("==》onTouchCancel");
this.clearLongClickTimer();
this.recoverViewSize(!1);
};
t.prototype.onTouchMove = function(e) {
if (this.isLongClick && this.draggable) {
var t = new cc.Vec2(e.getLocationX(), e.getLocationY());
this.moveToPos(t);
}
};
t.prototype.moveToPos = function(e) {
if (e && cc.isValid(this.node) && cc.isValid(this.node.parent)) {
var t = e.x, o = e.y;
t > this.right ? t = this.right : t < this.left && (t = this.left);
o > this.top ? o = this.top : o < this.bottom && (o = this.bottom);
var n = new cc.Vec2(t, o);
n = this.node.parent.convertToNodeSpaceAR(n);
this.node.position = n;
}
};
t.prototype.getNow = function() {
return new Date().getTime();
};
return t = __decorate([ i ], t);
}(cc.Component));
o.default = c;
cc._RF.pop();
}, {} ],
CommonEventName: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "f49d9gNXhlCtpNPmY1KGy8x", "CommonEventName");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.EVENT_APPLE_LOGIN_RESULT = "EVENT_APPLE_LOGIN_RESULT";
e.EVENT_REFRESH_USER_INFO = "EVENT_REFRESH_USER_INFO";
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
CommonFunction: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "04b32vpnTZD4qFboCOgX/Mv", "CommonFunction");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.getSceneCanvas = function() {
if (cc.director) {
var e = cc.director.getScene();
if (cc.isValid(e)) {
var t = e.getChildByName("Canvas");
return cc.isValid(t) ? t : null;
}
return null;
}
return null;
};
e.clickManager = function(e, t) {
void 0 === t && (t = 1500);
if (cc.isValid(e)) {
var o = e.getComponent(cc.Button);
cc.isValid(o) && (o.interactable = !1);
var n = setTimeout(function() {
cc.isValid(o) && (o.interactable = !0);
clearInterval(n);
}, t);
}
};
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
CommonPrefabMgr: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "6f0dcP9/AFL8J9/1X2O2YAz", "CommonPrefabMgr");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./CommonFunction"), a = e("../Resources/ResManager"), i = e("../UI/PrefabManager"), c = e("./Global"), r = e("../../Component/Game/GameOverDialog"), s = function() {
function e() {}
e.createToast = function(e, t) {
void 0 === t && (t = c.default.Config.layerZOrder.Toast);
var o = n.default.getSceneCanvas();
if (cc.isValid(o)) {
var r = o.getChildByName("Toast");
r && o.removeChild(r);
}
var s = a.default.common.prefab.toast;
i.default.getPrefabIns(s, function(n) {
if (cc.isValid(o) && n) {
o.addChild(n, t);
n.getComponent("Toast") && n.getComponent("Toast").init(e);
n.x = 0;
n.y = 0;
}
});
};
e.showGameOverDialog = function(e, t, o, s) {
var l = n.default.getSceneCanvas();
i.default.getPrefab(a.default.game.prefab.gameOverDialog, function(n) {
if (n) {
var a = cc.instantiate(n);
if (a) {
cc.isValid(l) && l.addChild(a, c.default.Config.layerZOrder.Dialog);
a.getComponent(r.default) && a.getComponent(r.default).showDialog(e, t, o, s);
}
}
});
};
return e;
}();
o.default = s;
cc._RF.pop();
}, {
"../../Component/Game/GameOverDialog": "GameOverDialog",
"../Resources/ResManager": "ResManager",
"../UI/PrefabManager": "PrefabManager",
"./CommonFunction": "CommonFunction",
"./Global": "Global"
} ],
CountDownUtil: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "e178dRT0R1Gp7hz5F9RgpUY", "CountDownUtil");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e(e, t, o) {
this.COUNT_DOWN_ACTION_TAG = 9111024911;
this._componentNode = null;
this._leftTs = 0;
this._callback = null;
this._componentNode = e;
this._callback = o;
this.COUNT_DOWN_ACTION_TAG = t;
this.stopCountDown();
}
e.prototype.startCountDown = function(e) {
if (this._leftTs > 0) {
this._leftTs = e;
this.callback(e);
} else if (e <= 0) ; else {
this.stopCountDown();
if (cc.isValid(this._componentNode)) {
this.callback(e);
this._componentNode.runAction(this.countDownAction(e));
}
}
};
e.prototype.getLeftTs = function() {
return this._leftTs;
};
e.prototype.countDownAction = function(e) {
var t = this;
t._leftTs = e;
var o = cc.repeatForever(cc.sequence(cc.delayTime(1), cc.callFunc(function() {
if (t._leftTs <= 0) t.callback(0); else {
t._leftTs--;
cc.isValid(t._componentNode) && (t._leftTs > 0 ? t.callback(t._leftTs) : t.callback(0));
}
})));
o.setTag(t.COUNT_DOWN_ACTION_TAG);
return o;
};
e.prototype.stopCountDown = function() {
this._leftTs = 0;
cc.isValid(this._componentNode) && this._componentNode.stopActionByTag(this.COUNT_DOWN_ACTION_TAG);
};
e.prototype.callback = function(e) {
if (this._callback) {
e <= 0 && this.stopCountDown();
this._callback(e);
}
};
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
CountDown: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "0a1d77xStpHepXdigZVVvNO", "CountDown");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../Framework/Utils/CountDownUtil"), a = e("../../Framework/UI/SpriteManager"), i = e("../../Framework/Resources/ResManager"), c = cc._decorator, r = c.ccclass, s = (c.property, 
function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.COUNT_DOWN_TAG = 12030;
t.countDownUtil = null;
t.numberSprites = [];
t.countdownCallback = null;
return t;
}
t.prototype.onLoad = function() {
this.countDownUtil = new n.default(this.node, this.COUNT_DOWN_TAG, this.countDownCallback.bind(this));
var e = this.node.getComponent(cc.Layout);
if (!e) {
(e = this.node.addComponent(cc.Layout)).type = cc.Layout.Type.HORIZONTAL;
e.resizeMode = cc.Layout.ResizeMode.CONTAINER;
e.spacingX = 15;
}
};
t.prototype.init = function(e) {
this.countdownCallback = e;
};
t.prototype.countDownCallback = function(e) {
var t = e.toString();
this.numberSprites.length != t.length && this.createNumberSprites(t.length);
for (var o = 0; o < t.length; o++) {
var n = parseInt(t.substr(o, 1)), c = i.default.common.texture.numbers[n];
a.default.loadSpriteForNode(this.numberSprites[o], c);
}
e <= 0 && (this.node.active = !1);
this.countdownCallback && this.countdownCallback(e);
};
t.prototype.createNumberSprites = function(e) {
this.node.removeAllChildren();
this.numberSprites = [];
for (var t = 0; t < e; t++) {
var o = a.default.createSpriteNode("number" + t);
this.node.addChild(o);
this.numberSprites[t] = o;
}
};
t.prototype.startCountDown = function(e) {
this.node.active = !0;
this.countDownUtil.startCountDown(e);
};
t.prototype.stopCountDown = function() {
this.countDownUtil.stopCountDown();
this.node.active = !1;
};
return t = __decorate([ r ], t);
}(cc.Component));
o.default = s;
cc._RF.pop();
}, {
"../../Framework/Resources/ResManager": "ResManager",
"../../Framework/UI/SpriteManager": "SpriteManager",
"../../Framework/Utils/CountDownUtil": "CountDownUtil"
} ],
DateFormat: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "a81cdeaheBMEpIaiVOoC8wG", "DateFormat");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.getDayInYear = function(e) {
var t = new Date().getFullYear().toString(), o = new Date(e) - new Date(t);
return Math.ceil(o / 864e5);
};
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
DistanceCounter: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "e8b045PUslNFpdwHhxCdWwo", "DistanceCounter");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../Framework/UI/LabelManager"), a = cc._decorator, i = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.distanceLabel = null;
t.finishCallback = null;
t.distance = 0;
return t;
}
t.prototype.onLoad = function() {
n.default.setLabelString(this.distanceLabel, this.distance + "m");
};
t.prototype.init = function(e) {
this.finishCallback = e;
this.distance = 0;
n.default.setLabelString(this.distanceLabel, this.distance + "m");
};
t.prototype.startCount = function() {
var e = this;
e.unscheduleAllCallbacks();
e.schedule(function() {
e.distance++;
n.default.setLabelString(e.distanceLabel, e.distance + "m");
}, 1, cc.macro.REPEAT_FOREVER, 0);
};
t.prototype.stopCount = function() {
this.unscheduleAllCallbacks();
this.finishCallback && this.finishCallback(this.distance);
};
t.prototype.getDistance = function() {
return this.distance;
};
t.prototype.onDestroy = function() {
this.unscheduleAllCallbacks();
};
__decorate([ c(cc.Label) ], t.prototype, "distanceLabel", void 0);
return t = __decorate([ i ], t);
}(cc.Component);
o.default = r;
cc._RF.pop();
}, {
"../../Framework/UI/LabelManager": "LabelManager"
} ],
GameManager: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "4f2a86rJIhCIoZ9hUBSfFat", "GameManager");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../UI/SpriteManager"), a = e("../../Component/Game/Rock"), i = function() {
function e() {}
e.createRockNode = function() {
var e = n.default.createSpriteNode("rock");
e.addComponent(a.default).init(this.curRoom);
return e;
};
e.getRockSpeed = function() {
var t = this.speed;
e.getCurRoom() == e.ROOM_KIND.EASY ? t = .8 * this.speed : e.getCurRoom() == e.ROOM_KIND.ORDINARY ? t = this.speed : e.getCurRoom() == e.ROOM_KIND.DIFFICULTY && (t = 1.2 * this.speed);
return t;
};
e.enterRoom = function() {
cc.director.loadScene("Game");
};
e.setCurRoom = function(e) {
this.curRoom = e;
};
e.getCurRoom = function() {
return this.curRoom;
};
e.ROOM_KIND = cc.Enum({
EASY: 0,
ORDINARY: 1,
DIFFICULTY: 2
});
e.PLANE_TYPE = cc.Enum({
PLANE1: 0,
PLANE2: 1,
PLANE3: 2
});
e.PLANE_CONFIG = {
0: {
price: 0
},
1: {
price: 2e4
},
2: {
price: 3e4
}
};
e.speed = 10;
return e;
}();
o.default = i;
cc._RF.pop();
}, {
"../../Component/Game/Rock": "Rock",
"../UI/SpriteManager": "SpriteManager"
} ],
GameOverDialog: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "db1ca5fJhFAO5tb18ooVDiy", "GameOverDialog");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../Dialog/BaseDialog"), a = e("../../Framework/UI/LabelManager"), i = e("../../Framework/Base/CommonFunction"), c = e("../../Framework/Base/CommonAudioMgr"), r = e("../../Framework/Resources/ResManager"), s = cc._decorator, l = s.ccclass, u = s.property, d = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.distanceLabel = null;
t.goldLabel = null;
return t;
}
t.prototype.onLoad = function() {};
t.prototype.showDialog = function(t, o, n, i) {
e.prototype.showDialog.call(this);
a.default.setLabelString(this.distanceLabel, t);
a.default.setLabelString(this.goldLabel, "+" + o);
this.backCallback = n;
this.continueCallback = i;
};
t.prototype.onClickBackBtn = function(t) {
i.default.clickManager(t.target);
c.default.playEffect(r.default.common.audio.btnClick);
e.prototype.dismissDialog.call(this);
this.backCallback && this.backCallback();
};
t.prototype.onClickContinueBtn = function(t) {
i.default.clickManager(t.target);
c.default.playEffect(r.default.common.audio.btnClick);
e.prototype.dismissDialog.call(this);
this.continueCallback && this.continueCallback();
};
__decorate([ u(cc.Label) ], t.prototype, "distanceLabel", void 0);
__decorate([ u(cc.Label) ], t.prototype, "goldLabel", void 0);
return t = __decorate([ l ], t);
}(n.default);
o.default = d;
cc._RF.pop();
}, {
"../../Framework/Base/CommonAudioMgr": "CommonAudioMgr",
"../../Framework/Base/CommonFunction": "CommonFunction",
"../../Framework/Resources/ResManager": "ResManager",
"../../Framework/UI/LabelManager": "LabelManager",
"../Dialog/BaseDialog": "BaseDialog"
} ],
Game: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "98a8biRS9pO+ZCoV/dcLmUm", "Game");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../Framework/Business/UserManager"), a = e("./Plane"), i = e("./RockScene"), c = e("../../Framework/Business/GameManager"), r = e("../../Framework/Base/CommonPrefabMgr"), s = e("./DistanceCounter"), l = cc._decorator, u = l.ccclass, d = l.property, f = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.bg1Node = null;
t.bg2Node = null;
t.distanceCounter = null;
t.plane = null;
t.rockScene = null;
t.gamePaused = !0;
t.speed = 5;
t.bgOutPosition = -360;
return t;
}
t.prototype.onLoad = function() {
this.bgOutPosition = -this.bg1Node.height;
this.startGame();
};
t.prototype.startGame = function() {
var e = this;
cc.director.getCollisionManager().enabled = !0;
e.setGamePause(!1);
cc.isValid(e.distanceCounter) && e.distanceCounter.init(e.distanceFinishCallback.bind(e));
e.initPlane(function() {
cc.isValid(e.distanceCounter) && e.distanceCounter.startCount();
cc.isValid(e.plane) && e.plane.setDraggable(!0);
e.scheduleOnce(function() {
e.rockEnter();
}, 3);
});
};
t.prototype.stopGame = function() {
cc.director.getCollisionManager().enabled = !1;
this.setGamePause(!0);
cc.isValid(this.rockScene) && this.rockScene.stopGame();
cc.isValid(this.distanceCounter) && this.distanceCounter.stopCount();
cc.isValid(this.plane) && this.plane.setDraggable(!1);
};
t.prototype.distanceFinishCallback = function() {};
t.prototype.rockEnter = function() {
if (cc.isValid(this.rockScene)) {
var e = c.default.getRockSpeed();
this.rockScene.setSpeed(e);
this.rockScene.startGame();
}
};
t.prototype.setGamePause = function(e) {
this.gamePaused = e;
};
t.prototype.update = function(e) {
this.gamePaused || this.renderBg();
};
t.prototype.initPlane = function(e) {
var t = n.default.getLoginUser();
if (cc.isValid(this.plane)) {
this.plane.setDraggable(!1);
this.plane.initPosition();
this.plane.init(t.curPlane, this.gameOverCallback.bind(this));
this.plane.enter(e);
}
};
t.prototype.gameOverCallback = function(e) {
this.stopGame();
this.showGameOverDialog();
};
t.prototype.showGameOverDialog = function() {
var e = this, t = 0;
cc.isValid(e.distanceCounter) && (t = e.distanceCounter.getDistance());
var o = c.default.getCurRoom(), a = t, i = n.default.getLoginUser();
i.coin = i.coin + a;
t > i.records[o] && (i.records[o] = t);
n.default.updateLoginUser(i);
r.default.showGameOverDialog(t, a, function() {
cc.director.loadScene("Hall");
}, function() {
e.startGame();
});
};
t.prototype.renderBg = function() {
this.bg1Node.y -= this.speed;
this.bg2Node.y -= this.speed;
this.bg1Node.y - this.speed <= this.bgOutPosition && (this.bg1Node.y = this.bg2Node.y + this.bg2Node.height);
this.bg2Node.y - this.speed <= this.bgOutPosition && (this.bg2Node.y = this.bg1Node.y + this.bg1Node.height);
};
t.prototype.onDestroy = function() {
cc.director.getCollisionManager().enabled = !1;
cc.director.getCollisionManager().enabledDebugDraw = !1;
this.unscheduleAllCallbacks();
};
__decorate([ d(cc.Node) ], t.prototype, "bg1Node", void 0);
__decorate([ d(cc.Node) ], t.prototype, "bg2Node", void 0);
__decorate([ d(s.default) ], t.prototype, "distanceCounter", void 0);
__decorate([ d(a.default) ], t.prototype, "plane", void 0);
__decorate([ d(i.default) ], t.prototype, "rockScene", void 0);
return t = __decorate([ u ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
}, {
"../../Framework/Base/CommonPrefabMgr": "CommonPrefabMgr",
"../../Framework/Business/GameManager": "GameManager",
"../../Framework/Business/UserManager": "UserManager",
"./DistanceCounter": "DistanceCounter",
"./Plane": "Plane",
"./RockScene": "RockScene"
} ],
Global: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "e44d2crUEpDUpXz70FN2T2J", "Global");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.Config = {
layerZOrder: {
Toast: 8e3,
Dialog: 7e3
}
};
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
Hall: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "c5e60FAkL5JKZtwdy83I9mx", "Hall");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../Framework/Business/UserManager"), a = e("../../Framework/Resources/ResManager"), i = e("../../Framework/Utils/NativeUtil"), c = e("../../Framework/Base/CommonAudioMgr"), r = e("../../Framework/Base/CommonFunction"), s = e("../../Framework/Base/CommonEventName"), l = e("../../Framework/UI/LabelManager"), u = cc._decorator, d = u.ccclass, f = u.property, p = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.coinLabel = null;
return t;
}
t.prototype.onLoad = function() {
console.log("=== Hall onLoad ===");
c.default.playMusic(a.default.common.audio.bgm, !0, 1);
this.initUserInfo();
};
t.prototype.onEnable = function() {
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
cc.director.on(s.default.EVENT_REFRESH_USER_INFO, this.initUserInfo, this);
};
t.prototype.onDisable = function() {
cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
cc.director.off(s.default.EVENT_REFRESH_USER_INFO, this.initUserInfo, this);
};
t.prototype.initUserInfo = function() {
var e = n.default.getLoginUser();
l.default.setLabelString(this.coinLabel, e.coin);
};
t.prototype.onClickShop = function(e) {
r.default.clickManager(e.target);
c.default.playEffect(a.default.common.audio.btnClick);
cc.director.loadScene("Shop");
};
t.prototype.onClickStart = function(e) {
r.default.clickManager(e.target);
c.default.playEffect(a.default.common.audio.btnClick);
cc.director.loadScene("Room");
};
t.prototype.onKeyUp = function(e) {
e.keyCode == cc.macro.KEY.back && i.default.quitGame();
};
t.prototype.onDestroy = function() {};
__decorate([ f(cc.Label) ], t.prototype, "coinLabel", void 0);
return t = __decorate([ d ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
}, {
"../../Framework/Base/CommonAudioMgr": "CommonAudioMgr",
"../../Framework/Base/CommonEventName": "CommonEventName",
"../../Framework/Base/CommonFunction": "CommonFunction",
"../../Framework/Business/UserManager": "UserManager",
"../../Framework/Resources/ResManager": "ResManager",
"../../Framework/UI/LabelManager": "LabelManager",
"../../Framework/Utils/NativeUtil": "NativeUtil"
} ],
LabelManager: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "2b649QP/KtCb7NeLMPcD+Ja", "LabelManager");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.initLabelManager = function() {
this.initFont();
};
e.createLabelNode = function(e) {
var t = new cc.Node("label_" + e || "");
t.addComponent(cc.Label);
t.setName(e || "");
return t;
};
e.setLabelOutline = function(e, t, o) {
void 0 === o && (o = 1);
var n = this.getLabelOutline(e);
if (cc.isValid(n)) {
n.color = cc.color().fromHEX(t);
n.width = o;
}
};
e.getLabelOutline = function(e) {
if (cc.isValid(e)) {
var t = e, o = (t = e instanceof cc.Label ? e.node : e).getComponent(cc.LabelOutline);
o || (o = t.addComponent(cc.LabelOutline));
return o;
}
return e;
};
e.setLabelColor = function(e, t) {
if (cc.isValid(e)) {
e instanceof cc.Node || e instanceof cc.Label && (e = e.node);
cc.isValid(e) && (e.color = cc.color().fromHEX(t));
}
};
e.setLabelFontSize = function(e, t) {
if (cc.isValid(e)) {
e instanceof cc.Label || e instanceof cc.Node && (e = e.getComponent(cc.Label));
cc.isValid(e) && (e.fontSize = t);
}
};
e.setLabelString = function(e, t) {
if (cc.isValid(e)) {
e instanceof cc.Label || e instanceof cc.Node && (e = e.getComponent(cc.Label));
cc.isValid(e) && (e.string = t);
}
};
e.setRichText = function(e, t) {
if (cc.isValid(e)) {
e instanceof cc.RichText || e instanceof cc.Node && (e = e.getComponent(cc.RichText));
cc.isValid(e) && (e.string = t);
}
};
e.getLabelString = function(e) {
if (cc.isValid(e)) {
if (e instanceof cc.Label) return e.string;
if (e instanceof cc.Node) return e.getComponent(cc.Label).string;
}
return "";
};
e.initFont = function() {
this.getSourceSansProRegularFont();
this.getSourceSansProBoldFont();
this.getSourceSansProSemiBoldFont();
};
e.getSourceSansProRegularFont = function() {
var e = this;
e.getFont(CommonDepend.CommonRes.font.ssp_regular, function(t) {
e.sourceSansProRegularFont = t;
});
};
e.getSourceSansProBoldFont = function() {
var e = this;
e.getFont(CommonDepend.CommonRes.font.ssp_regular, function(t) {
e.sourceSansProBoldFont = t;
});
};
e.getSourceSansProSemiBoldFont = function() {
var e = this;
e.getFont(CommonDepend.CommonRes.font.ssp_regular, function(t) {
e.sourceSansProSemiBoldFont = t;
});
};
e.setFont = function(e, t, o) {
if (cc.isValid(e)) {
e instanceof cc.Label || e instanceof cc.Node && (e = e.getComponent(cc.Label));
if (cc.isValid(e)) {
e.font = t;
(o || 0 == o) && (e.spacingX = o);
}
}
};
e.getFont = function(e, t) {
cc.loader.loadRes(e, cc.Font, function(e, o) {
e ? cc.error(e.message || e) : o && "function" == typeof t && t(o);
});
};
e.loadFont = function(e, t, o, n) {
cc.loader.loadRes(t, cc.Font, function(t, a) {
if (t) cc.error(t.message || t); else if (cc.isValid(e)) {
e instanceof cc.Label || e instanceof cc.Node && (e = e.getComponent(cc.Label));
if (cc.isValid(e)) {
e.font = a;
(o || 0 == o) && (e.spacingX = o);
"function" == typeof n && n();
}
}
});
};
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
Language: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "6adbeVqVkRIcoe3L+sV8xX1", "Language");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.common = {
balanceNotEnough: "Balance not enough"
};
e.room = {
highestRecord: "Highest record: %s"
};
e.game = {
distance: "Distance: %sm"
};
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
Launcher: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "cc4f8FH8aJCdrQBQuLC05CZ", "Launcher");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../Framework/Utils/NativeUtil"), a = e("../../Framework/Business/UserManager"), i = e("../../Framework/Base/CommonAudioMgr"), c = cc._decorator, r = c.ccclass, s = (c.property, 
function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onLoad = function() {
i.default.init();
n.default.init();
cc.Camera.main.backgroundColor = cc.color().fromHEX("#FFFFFF");
a.default.guestLogin();
this.gotoHallDelay();
};
t.prototype.gotoHallDelay = function() {
setTimeout(function() {
cc.director.loadScene("Hall");
}, 3e3);
};
t.prototype.start = function() {};
return t = __decorate([ r ], t);
}(cc.Component));
o.default = s;
cc._RF.pop();
}, {
"../../Framework/Base/CommonAudioMgr": "CommonAudioMgr",
"../../Framework/Business/UserManager": "UserManager",
"../../Framework/Utils/NativeUtil": "NativeUtil"
} ],
Loading: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "b7e4780HsVNypzwv6PTvZdF", "Loading");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../Framework/Utils/NativeUtil"), a = e("../../Framework/Business/UserManager"), i = e("../../Framework/Base/CommonEventName"), c = e("../../Framework/Base/CommonFunction"), r = e("../../Framework/Base/CommonAudioMgr"), s = e("../../Framework/Resources/ResManager"), l = cc._decorator, u = l.ccclass, d = (l.property, 
function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onLoad = function() {};
t.prototype.onEnable = function() {
cc.director.on(i.default.EVENT_APPLE_LOGIN_RESULT, this.onAppLoginResult, this);
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
};
t.prototype.onDisable = function() {
cc.director.off(i.default.EVENT_APPLE_LOGIN_RESULT, this.onAppLoginResult, this);
cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
};
t.prototype.onKeyUp = function(e) {
e.keyCode == cc.macro.KEY.back && n.default.quitGame();
};
t.prototype.onGuestLogin = function(e) {
c.default.clickManager(e.target);
r.default.playEffect(s.default.common.audio.btnClick);
a.default.guestLogin() && cc.director.loadScene("Hall");
};
t.prototype.onAppleLogin = function(e) {
c.default.clickManager(e.target);
r.default.playEffect(s.default.common.audio.btnClick);
n.default.appleLogin();
};
t.prototype.onAppLoginResult = function(e, t) {};
return t = __decorate([ u ], t);
}(cc.Component));
o.default = d;
cc._RF.pop();
}, {
"../../Framework/Base/CommonAudioMgr": "CommonAudioMgr",
"../../Framework/Base/CommonEventName": "CommonEventName",
"../../Framework/Base/CommonFunction": "CommonFunction",
"../../Framework/Business/UserManager": "UserManager",
"../../Framework/Resources/ResManager": "ResManager",
"../../Framework/Utils/NativeUtil": "NativeUtil"
} ],
LocalStorageMgr: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "76cc7xRj6NBBbXuOYbH8IYy", "LocalStorageMgr");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../Base/CommonAudioMgr"), a = function() {
function e() {}
e.readData = function(e) {
return cc.sys.localStorage.getItem("_local" + e);
};
e.saveData = function(e, t) {
cc.sys.localStorage.setItem("_local" + e, t);
};
e.clearData = function(e) {
cc.sys.localStorage.removeItem("_local" + e);
};
e.readBoolean = function(e) {
var t = cc.sys.localStorage.getItem("_local" + e);
return 1 == t || "true" == t;
};
e.saveBoolean = function(e, t) {
1 == t || 0 == t || "true" == t || "false" == t ? console.log("LocalStorageMgr->saveBoolean key: " + e + " value: " + t) : console.log("警告: --\x3e LocalStorageMgr->saveBoolean,参数错误，请给定Boolean型参数-> key: " + e + " value: " + t);
cc.sys.localStorage.setItem("_local" + e, t);
};
e.getNativeClassName = function() {
return this.readData("_native_class_name");
};
e.getLoginUser = function() {
var e = this.readData("_login_user"), t = null;
e && (t = JSON.parse(e));
return t;
};
e.saveLoginUser = function(e) {
var t = "";
e && (t = JSON.stringify(e));
this.saveData("_login_user", t);
};
e.getCheckinState = function() {
var e = this.readData("_checkin_state"), t = null;
e && (t = JSON.parse(e));
return t;
};
e.saveCheckinState = function(e) {
var t = "";
e && (t = JSON.stringify(e));
this.saveData("_checkin_state", t);
};
e.getLastCheckinDate = function() {
var e = this.readData("_last_checkin_date"), t = 0;
e && (t = parseInt(e));
return t;
};
e.saveLastCheckinDate = function(e) {
this.saveData("_last_checkin_date", e);
};
e.getLastCheckinDay = function() {
var e = this.readData("_last_checkin_day"), t = 0;
e && (t = parseInt(e));
return t;
};
e.saveLastCheckinDay = function(e) {
this.saveData("_last_checkin_day", e);
};
e.saveMusicSwitch = function(e) {
this.saveData("_sound", e);
};
e.readMusicSwitch = function() {
return this.readData("_sound");
};
e.saveEffectSwitch = function(e) {
this.saveData("_effect", e);
n.default.changeEffectSwitch();
};
e.readEffectSwitch = function() {
return this.readData("_effect");
};
return e;
}();
o.default = a;
cc._RF.pop();
}, {
"../Base/CommonAudioMgr": "CommonAudioMgr"
} ],
NativeUtil: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "9cb6byZwNZPHKjrtMtR8XGx", "NativeUtil");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./LocalStorageMgr"), a = e("../Base/CommonEventName"), i = function() {
function e() {}
e.init = function() {
this.nativeClassName = n.default.getNativeClassName();
console.log("设置JavaUtil/OCUtil别名：" + this.nativeClassName);
};
e.nativeAndroidClassName = function() {
var e = "com/util/EngineBridge";
this.nativeClassName && (e = this.nativeClassName);
return e;
};
e.nativeiOSClasssName = function() {
var e = "EngineBridge";
this.nativeClassName && (e = this.nativeClassName);
return e;
};
e.quitGame = function() {
if (cc.sys.isNative) {
if (cc.sys.os == cc.sys.OS_ANDROID) {
var t = e.nativeAndroidClassName(), o = "quitGame";
jsb.reflection.callStaticMethod(t, o, "()V");
} else if (cc.sys.os == cc.sys.OS_IOS) {
t = e.nativeiOSClasssName(), o = "quitGame";
jsb.reflection.callStaticMethod(t, o);
}
} else console.log("quitGame");
};
e.appleLogin = function() {
if (cc.sys.isNative) {
if (cc.sys.os == cc.sys.OS_ANDROID) {
var t = e.nativeAndroidClassName(), o = "appleLogin";
jsb.reflection.callStaticMethod(t, o, "()V");
} else if (cc.sys.os == cc.sys.OS_IOS) {
t = e.nativeiOSClasssName(), o = "appleLogin";
jsb.reflection.callStaticMethod(t, o);
}
} else console.log("appleLogin");
};
return e;
}();
o.default = i;
cc.onAppleLoginResult = function(e, t) {
console.log("onAppleLoginResult: state=%s, data=%s", e, t);
var o = {};
t && (o = JSON.parse(t));
cc.director.emit(a.default.EVENT_APPLE_LOGIN_RESULT, e, o);
};
cc._RF.pop();
}, {
"../Base/CommonEventName": "CommonEventName",
"./LocalStorageMgr": "LocalStorageMgr"
} ],
NodeManager: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "b9f43P/XVNP+aWuPtFnPU02", "NodeManager");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.setVisible = function(e, t) {
void 0 === t && (t = !1);
cc.isValid(e) && (e instanceof cc.Node ? e.active = t : e.node.active = t);
};
e.setInteractable = function(e, t) {
if (cc.isValid(e)) {
var o = null;
e instanceof cc.Button ? o = e : e instanceof cc.Node && (o = e.getComponent(cc.Button));
cc.isValid(o) && (o.interactable = t);
}
};
e.setOpacity = function(e, t) {
cc.isValid(e) && (e instanceof cc.Node ? e.opacity = t : e.node.opacity = t);
};
e.createNode = function(e) {
var t = new cc.Node("node_" + e || "");
t.setName(e.toString() || "");
return t;
};
e.findChildByName = function(e, t) {
return cc.find(t, e);
};
e.loadNodeRes = function(e, t, o) {
if (cc.isValid(e) && t) {
if (t.sprite) {
console.log("NodeManager ======= 图片加载开始，父节点[%s] =======", e.name);
for (var n = 0; n < t.sprite.length; n++) {
var a = t.sprite[n].nodePath, i = t.sprite[n].resPath, c = t.sprite[n].spriteName, r = null;
r = "" == a || "/" == a ? e : cc.find(a, e);
if (cc.isValid(r) && i) {
var s = this.getAssetByPath(i, "sprite", c, o);
if (s) {
console.log("NodeManager ==》子节点[%s]，从内存中加载图片：%s", a, i);
UIDepend.SpriteManager.setSpriteFrame(r, s);
} else {
console.log("NodeManager ==》子节点[%s]，内存中找不到图片，动态加载：%s", a, i);
c ? UIDepend.SpriteManager.loadSpriteAtlasForNode(r, i, c) : UIDepend.SpriteManager.loadSpriteForNode(r, i);
}
}
}
}
if (t.font) {
console.log("NodeManager ======= 字体加载开始，父节点[%s] =======", e.name);
for (n = 0; n < t.font.length; n++) {
a = t.font[n].nodePath, i = t.font[n].resPath;
var l = t.font[n].spacingX, u = null;
u = "" == a || "/" == a ? e : cc.find(a, e);
if (cc.isValid(u) && i) {
var d = this.getAssetByPath(i, "font");
if (d) {
console.log("NodeManager ==》子节点[%s]，从内存中加载字体：%s", a, i);
UIDepend.LabelManager.setFont(u, d, l);
} else {
console.log("NodeManager ==》子节点[%s]，内存中找不到字体，动态加载：%s", a, i);
UIDepend.LabelManager.loadFont(u, i, l);
}
}
}
}
}
};
e.getAssetByPath = function(e, t, o, n) {
if (!e) return null;
if (o && "sprite" == t) {
return UIDepend.SpriteManager.getSpriteFromCommonAtlas(e, o);
}
var a = CommonDepend.ResourceManager.getResByGameId(n);
if (!a) return null;
var i = "";
if (-1 != e.indexOf("/")) {
var c = e.split("/");
i = c[c.length - 1];
} else i = e;
return a.find(function(e) {
return "sprite" == t ? e instanceof cc.SpriteFrame && e.name == i : "font" == t && (e instanceof cc.Font && e.name == i);
});
};
e.setLabelColor = function(e, t) {
cc.isValid(e) && (e.color = new cc.Color().fromHEX(t));
};
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
Plane: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "bd7ec2F+GBJv4L9x89SWP4N", "Plane");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../Framework/Business/GameManager"), a = e("../Common/CommonDragView"), i = cc.BoxCollider, c = e("../../Framework/Resources/ResManager"), r = cc._decorator, s = r.ccclass, l = r.property, u = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.commonDragView = null;
t.planeType = 0;
t.crashCallback = null;
return t;
}
t.prototype.onLoad = function() {
this.initPosition();
};
t.prototype.initPosition = function() {
var e = cc.winSize.width / 2, t = new cc.v2(e, -100);
this.setPosition(t);
};
t.prototype.setPosition = function(e) {
var t = this.node.parent.convertToNodeSpaceAR(e);
console.log("Plane init position: [%s,%s]", t.x, t.y);
this.node.position = t;
};
t.prototype.setDraggable = function(e) {
cc.isValid(this.commonDragView) && this.commonDragView.setDraggable(e);
};
t.prototype.enter = function(e) {
if (cc.isValid(this.node)) {
var t = cc.winSize.width / 2, o = this.node.parent.convertToNodeSpaceAR(new cc.v2(t, 137)), n = t, a = this.node.parent.convertToNodeSpaceAR(new cc.v2(n, 337));
this.node.runAction(cc.sequence(cc.moveTo(2, a), cc.moveTo(2, o), cc.callFunc(function() {
e && e();
}))).easing(cc.easeSineOut());
}
};
t.prototype.init = function(e, t) {
this.planeType = e;
this.crashCallback = t;
if (cc.isValid(this.node)) {
var o = this.node.getChildByName("tail_flame");
if (cc.isValid(o)) {
var a = o.getComponent(sp.Skeleton);
if (cc.isValid(a)) {
var r = "";
e == n.default.PLANE_TYPE.PLANE1 ? r = "feiji1" : e == n.default.PLANE_TYPE.PLANE2 ? r = "feiji2" : e == n.default.PLANE_TYPE.PLANE3 && (r = "feiji3");
console.log("Use plane: %s, skin: %s", e, r);
a.setAnimation(0, r, !0);
}
}
var s = this.node.getComponent(i);
if (cc.isValid(s)) {
var l = c.default.game.config.planeSize[e];
s.size.width = l[0];
s.size.height = l[1];
}
}
};
t.prototype.onCollisionEnter = function(e) {
console.log("Plane[%s]: 碰到了%s", this.planeType, e.node.name);
this.crashCallback && this.crashCallback(e.node);
};
t.prototype.onCollisionStay = function(e) {};
t.prototype.onCollisionExit = function(e) {};
__decorate([ l(a.default) ], t.prototype, "commonDragView", void 0);
return t = __decorate([ s ], t);
}(cc.Component);
o.default = u;
cc._RF.pop();
}, {
"../../Framework/Business/GameManager": "GameManager",
"../../Framework/Resources/ResManager": "ResManager",
"../Common/CommonDragView": "CommonDragView"
} ],
PrefabManager: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "716f7xKRjFHlK4xgnnRJNQr", "PrefabManager");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.loadPrefabToNode = function(e, t) {
if (cc.isValid(e) && cc.isValid(t)) {
var o = cc.instantiate(e);
cc.isValid(o) && t.addChild(o);
}
};
e.loadPrefab = function(e, t, o) {
o || (o = CommonDepend.CommonFunction.getSceneCanvas());
cc.loader.loadRes(e, function(e, n) {
if (e) cc.error(e.message || e); else if (n && cc.isValid(o)) {
var a = cc.instantiate(n);
if (a) {
o.addChild(a, Cocos20.Global.layerZOrder.Dialog);
"function" == typeof t && t(a);
}
}
});
};
e.getPrefab = function(e, t, o) {
cc.loader.loadRes(e, function(e, n) {
if (e) {
cc.error(e.message || e);
o && o();
} else n ? "function" == typeof t && t(n) : o && o();
});
};
e.getPrefabIns = function(e, t, o) {
cc.loader.loadRes(e, function(e, n) {
if (e) {
cc.error(e.message || e);
o && o();
} else if (n) {
var a = cc.instantiate(n);
a ? "function" == typeof t && t(a) : o && o();
} else o && o();
});
};
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
PurchaseBtn: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "09bcbvn9/RCkp/Q6uc4md23", "PurchaseBtn");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../Framework/UI/LabelManager"), a = e("../../Framework/UI/SpriteManager"), i = e("../../Framework/Resources/ResManager"), c = e("../../Framework/Base/CommonFunction"), r = e("../../Framework/Base/CommonAudioMgr"), s = e("../../Framework/Business/GameManager"), l = e("../../Framework/UI/NodeManager"), u = cc._decorator, d = u.ccclass, f = u.property, p = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.bgSprite = null;
t.usingNode = null;
t.useNode = null;
t.unlockNode = null;
t.goldLabel = null;
t.planeType = 0;
t.clickCallback = null;
t.state = 0;
return t;
}
o = t;
t.prototype.onLoad = function() {};
t.prototype.init = function(e, t, o) {
this.planeType = e;
this.clickCallback = o;
n.default.setLabelString(this.goldLabel, s.default.PLANE_CONFIG[e].price);
this.setState(t);
};
t.prototype.setState = function(e) {
var t = this;
t.state = e;
console.log("Purchase btn set state [%s] on plane-%s", e, t.planeType);
if (e == o.STATE.USING) {
l.default.setVisible(t.usingNode, !0);
l.default.setVisible(t.useNode, !1);
l.default.setVisible(t.unlockNode, !1);
a.default.loadSprite(t.bgSprite, i.default.common.texture.btn1, function() {
l.default.setInteractable(t.node, !0);
});
} else if (e == o.STATE.UNLOCKED) {
l.default.setVisible(t.usingNode, !1);
l.default.setVisible(t.useNode, !0);
l.default.setVisible(t.unlockNode, !1);
a.default.loadSprite(t.bgSprite, i.default.common.texture.btn3, function() {
l.default.setInteractable(t.node, !0);
});
} else if (e == o.STATE.LOCKED_CAN_BUY) {
l.default.setVisible(t.usingNode, !1);
l.default.setVisible(t.useNode, !1);
l.default.setVisible(t.unlockNode, !0);
a.default.loadSprite(t.bgSprite, i.default.common.texture.btn2, function() {
l.default.setInteractable(t.node, !0);
});
} else if (e == o.STATE.LOCKED_CAN_NOT_BUY) {
l.default.setVisible(t.usingNode, !1);
l.default.setVisible(t.useNode, !1);
l.default.setVisible(t.unlockNode, !0);
a.default.loadSprite(t.bgSprite, i.default.common.texture.btn2, function() {
l.default.setInteractable(t.node, !1);
});
}
};
t.prototype.onClickBtn = function(e) {
c.default.clickManager(e.target);
r.default.playEffect(i.default.common.audio.btnClick);
this.clickCallback && this.clickCallback(this.planeType, this.state);
};
var o;
t.STATE = cc.Enum({
USING: 0,
UNLOCKED: 1,
LOCKED_CAN_NOT_BUY: 2,
LOCKED_CAN_BUY: 3
});
__decorate([ f(cc.Sprite) ], t.prototype, "bgSprite", void 0);
__decorate([ f(cc.Node) ], t.prototype, "usingNode", void 0);
__decorate([ f(cc.Node) ], t.prototype, "useNode", void 0);
__decorate([ f(cc.Node) ], t.prototype, "unlockNode", void 0);
__decorate([ f(cc.Label) ], t.prototype, "goldLabel", void 0);
return t = o = __decorate([ d ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
}, {
"../../Framework/Base/CommonAudioMgr": "CommonAudioMgr",
"../../Framework/Base/CommonFunction": "CommonFunction",
"../../Framework/Business/GameManager": "GameManager",
"../../Framework/Resources/ResManager": "ResManager",
"../../Framework/UI/LabelManager": "LabelManager",
"../../Framework/UI/NodeManager": "NodeManager",
"../../Framework/UI/SpriteManager": "SpriteManager"
} ],
ResManager: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "69e38nI6MpPb67UX3teUryd", "ResManager");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.common = {
audio: {
bgm: "common/audio/bgm",
btnClick: "common/audio/btn_click"
},
prefab: {
toast: "common/prefab/Toast"
},
texture: {
userAvatars: [ "common/texture/head_female", "common/texture/head_male" ],
btn1: "common/texture/btn_1",
btn2: "common/texture/btn_2",
btn3: "common/texture/btn_3"
}
};
e.room = {
texture: {},
animation: {},
prefab: {}
};
e.game = {
texture: {
rockEasy: [ "game/texture/rock_easy/rock1", "game/texture/rock_easy/rock2", "game/texture/rock_easy/rock3" ],
rockOrdinary: [ "game/texture/rock_ordinary/rock1", "game/texture/rock_ordinary/rock2", "game/texture/rock_ordinary/rock3" ],
rockDifficulty: [ "game/texture/rock_difficulty/rock1", "game/texture/rock_difficulty/rock2", "game/texture/rock_difficulty/rock3" ]
},
config: {
rockEasy: [ [ 53, 67 ], [ 72, 80 ], [ 38, 36 ] ],
rockOrdinary: [ [ 72, 71 ], [ 51, 51 ], [ 96, 96 ] ],
rockDifficulty: [ [ 69, 43 ], [ 93, 89 ], [ 109, 138 ] ],
planeSize: [ [ 136, 139 ], [ 148, 161 ], [ 181, 161 ] ]
},
animation: {},
prefab: {
gameOverDialog: "game/prefab/GameOverDialog"
}
};
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
RockScene: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "9b1f8ZgOXlFcqmMYQYfn228", "RockScene");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../Framework/Business/GameManager"), a = cc._decorator, i = a.ccclass, c = (a.property, 
function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.speed = 5;
t.paused = !0;
t.lastElapsedTime = 0;
t.randomInterval = 0;
t.outPositionY = 0;
return t;
}
t.prototype.onLoad = function() {
var e = this.node.convertToNodeSpaceAR(new cc.v2(0, -50));
this.outPositionY = e.y;
console.log("RockScene: outPositionY=" + this.outPositionY);
};
t.prototype.startGame = function() {
this.node.removeAllChildren();
this.setPaused(!1);
};
t.prototype.stopGame = function() {
this.node.removeAllChildren();
this.setPaused(!0);
};
t.prototype.setSpeed = function(e) {
this.speed = e;
console.log("Rock speed set to: " + e);
};
t.prototype.setPaused = function(e) {
this.paused = e;
};
t.prototype.update = function(e) {
if (!this.paused) {
this.createRandomRocks(e);
this.renderRocks();
}
};
t.prototype.createRandomRocks = function(e) {
this.lastElapsedTime += e;
if (this.lastElapsedTime >= this.randomInterval) {
var t = n.default.createRockNode();
t.y = cc.winSize.height / 2 + 50;
t.x = Math.random() * this.node.width - this.node.width / 2;
this.node.addChild(t);
this.randomInterval = 3 * Math.random();
this.lastElapsedTime = 0;
console.log("Create %s, next rock in %s seconds", t.name, this.randomInterval);
}
};
t.prototype.renderRocks = function() {
for (var e = [], t = 0; t < this.node.children.length; t++) {
var o = this.node.children[t];
o.y -= this.speed;
o.y <= this.outPositionY && e.push(o);
}
for (t = 0; t < e.length; t++) e[t].removeFromParent();
};
return t = __decorate([ i ], t);
}(cc.Component));
o.default = c;
cc._RF.pop();
}, {
"../../Framework/Business/GameManager": "GameManager"
} ],
Rock: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "85adeHsj/lJ7Yx3czOy3k9t", "Rock");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../Framework/Resources/ResManager"), a = e("../../Framework/UI/SpriteManager"), i = e("../../Framework/Business/GameManager"), c = cc.BoxCollider, r = cc._decorator, s = r.ccclass, l = (r.property, 
function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onLoad = function() {};
t.prototype.init = function(e) {
this.node.group = "rock";
var t = this.node.addComponent(c), o = [];
e == i.default.ROOM_KIND.EASY ? o = n.default.game.texture.rockEasy : e == i.default.ROOM_KIND.ORDINARY ? o = n.default.game.texture.rockOrdinary : e == i.default.ROOM_KIND.DIFFICULTY && (o = n.default.game.texture.rockDifficulty);
var r = [];
e == i.default.ROOM_KIND.EASY ? r = n.default.game.config.rockEasy : e == i.default.ROOM_KIND.ORDINARY ? r = n.default.game.config.rockOrdinary : e == i.default.ROOM_KIND.DIFFICULTY && (r = n.default.game.config.rockDifficulty);
var s = parseInt((Math.random() * o.length).toString()), l = o[s], u = r[s];
t.size.width = u[0];
t.size.height = u[1];
this.node.name = "rock" + s;
a.default.loadSpriteForNode(this.node, l, function() {});
};
t.prototype.onCollisionEnter = function(e) {};
t.prototype.onCollisionStay = function(e) {};
t.prototype.onCollisionExit = function(e) {};
return t = __decorate([ s ], t);
}(cc.Component));
o.default = l;
cc._RF.pop();
}, {
"../../Framework/Business/GameManager": "GameManager",
"../../Framework/Resources/ResManager": "ResManager",
"../../Framework/UI/SpriteManager": "SpriteManager"
} ],
Room: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "f5a20IT/nVA54Tm2cHDZGM2", "Room");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../Framework/Base/CommonFunction"), a = e("../../Framework/Base/CommonAudioMgr"), i = e("../../Framework/Resources/ResManager"), c = e("../../Framework/Business/UserManager"), r = e("../../Framework/UI/LabelManager"), s = cc.js.formatStr, l = e("../../Framework/Resources/Language"), u = e("../../Framework/Business/GameManager"), d = cc._decorator, f = d.ccclass, p = d.property, m = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.easyRecord = null;
t.ordinaryRecord = null;
t.difficultyRecord = null;
return t;
}
t.prototype.onLoad = function() {
var e = c.default.getLoginUser();
r.default.setLabelString(this.easyRecord, s(l.default.room.highestRecord, e.records[u.default.ROOM_KIND.EASY]));
r.default.setLabelString(this.ordinaryRecord, s(l.default.room.highestRecord, e.records[u.default.ROOM_KIND.ORDINARY]));
r.default.setLabelString(this.difficultyRecord, s(l.default.room.highestRecord, e.records[u.default.ROOM_KIND.DIFFICULTY]));
};
t.prototype.onClickEasyBtn = function(e) {
n.default.clickManager(e.target);
a.default.playEffect(i.default.common.audio.btnClick);
this.enterRoom(u.default.ROOM_KIND.EASY);
};
t.prototype.onClickOrdinaryBtn = function(e) {
n.default.clickManager(e.target);
a.default.playEffect(i.default.common.audio.btnClick);
this.enterRoom(u.default.ROOM_KIND.ORDINARY);
};
t.prototype.onClickDifficultyBtn = function(e) {
n.default.clickManager(e.target);
a.default.playEffect(i.default.common.audio.btnClick);
this.enterRoom(u.default.ROOM_KIND.DIFFICULTY);
};
t.prototype.enterRoom = function(e) {
u.default.setCurRoom(e);
u.default.enterRoom();
};
t.prototype.onClickBackBtn = function(e) {
n.default.clickManager(e.target);
a.default.playEffect(i.default.common.audio.btnClick);
cc.director.loadScene("Hall");
};
__decorate([ p(cc.Label) ], t.prototype, "easyRecord", void 0);
__decorate([ p(cc.Label) ], t.prototype, "ordinaryRecord", void 0);
__decorate([ p(cc.Label) ], t.prototype, "difficultyRecord", void 0);
return t = __decorate([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
}, {
"../../Framework/Base/CommonAudioMgr": "CommonAudioMgr",
"../../Framework/Base/CommonFunction": "CommonFunction",
"../../Framework/Business/GameManager": "GameManager",
"../../Framework/Business/UserManager": "UserManager",
"../../Framework/Resources/Language": "Language",
"../../Framework/Resources/ResManager": "ResManager",
"../../Framework/UI/LabelManager": "LabelManager"
} ],
Shop: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "fe9abYJDxdHIZxJAGzYNABO", "Shop");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../../Framework/Base/CommonFunction"), a = e("../../Framework/Base/CommonAudioMgr"), i = e("../../Framework/Resources/ResManager"), c = e("./PurchaseBtn"), r = e("../../Framework/Business/GameManager"), s = e("../../Framework/Business/UserManager"), l = e("../../Framework/Base/CommonPrefabMgr"), u = e("../../Framework/Resources/Language"), d = cc._decorator, f = d.ccclass, p = d.property, m = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.purchaseBtns = [];
return t;
}
t.prototype.onLoad = function() {
this.initPurchaseState();
};
t.prototype.initPurchaseState = function() {
for (var e = 0; e < this.purchaseBtns.length; e++) {
var t = this.getPlanePurchaseState(e);
this.purchaseBtns[e].init(e, t, this.onPurchaseBtnClickCallback.bind(this));
}
};
t.prototype.getPlanePurchaseState = function(e) {
var t = s.default.getLoginUser(), o = c.default.STATE.LOCKED_CAN_BUY;
if (t.curPlane == e) o = c.default.STATE.USING; else if (-1 != t.planes.indexOf(e)) o = c.default.STATE.UNLOCKED; else {
var n = r.default.PLANE_CONFIG[e].price;
o = t.coin < n ? c.default.STATE.LOCKED_CAN_NOT_BUY : c.default.STATE.LOCKED_CAN_BUY;
}
return o;
};
t.prototype.onPurchaseBtnClickCallback = function(e, t) {
console.log("Click on plane type: " + e);
if (t != c.default.STATE.USING) {
var o = s.default.getLoginUser();
if (t == c.default.STATE.UNLOCKED) {
o.curPlane = e;
s.default.updateLoginUser(o);
} else if (t == c.default.STATE.LOCKED_CAN_BUY) {
var n = r.default.PLANE_CONFIG[e].price;
if (o.coin < n) {
l.default.createToast(u.default.common.balanceNotEnough);
return;
}
o.coin = o.coin - n;
o.planes = o.planes.concat(e);
s.default.updateLoginUser(o);
}
this.initPurchaseState();
}
};
t.prototype.onClickBackBtn = function(e) {
n.default.clickManager(e.target);
a.default.playEffect(i.default.common.audio.btnClick);
cc.director.loadScene("Hall");
};
__decorate([ p(c.default) ], t.prototype, "purchaseBtns", void 0);
return t = __decorate([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
}, {
"../../Framework/Base/CommonAudioMgr": "CommonAudioMgr",
"../../Framework/Base/CommonFunction": "CommonFunction",
"../../Framework/Base/CommonPrefabMgr": "CommonPrefabMgr",
"../../Framework/Business/GameManager": "GameManager",
"../../Framework/Business/UserManager": "UserManager",
"../../Framework/Resources/Language": "Language",
"../../Framework/Resources/ResManager": "ResManager",
"./PurchaseBtn": "PurchaseBtn"
} ],
SpineManager: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "b110cDWcpxFKLFa8MaWyPOT", "SpineManager");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.getSpine = function(e) {
var t = null;
cc.isValid(e) && (e instanceof sp.Skeleton ? t = e : e instanceof cc.Node && ((t = e.getComponent(sp.Skeleton)) || (t = e.addComponent(sp.Skeleton))));
return t;
};
e.loadSpine = function(e, t, o, n, a) {
var i = this.getSpine(e);
cc.isValid(i) && t && cc.loader.loadRes(t, sp.SkeletonData, function(e, t) {
if (e) cc.error(e.message || e); else if (cc.isValid(i)) {
var c = 0, r = "", s = !0;
if (o) {
c = o.trackIndex || 0;
r = o.name || "";
null != o.loop && void 0 != o.loop && (s = o.loop);
}
i.skeletonData = t;
i.setAnimation(c, r, s);
"function" == typeof a && i.setEventListener(function(e, t) {
a(e, t);
});
"function" == typeof n && i.setCompleteListener(function() {
n();
});
}
});
};
e.loadSkeleton = function(e, t, o, n) {
void 0 === n && (n = null);
var a = this.getSpine(e);
cc.isValid(a) && cc.loader.loadRes(t, sp.SkeletonData, function(e, t) {
if (e) {
cc.log(e.message || e);
n && n();
} else if (cc.isValid(a)) {
a.skeletonData = t;
o && o();
}
});
};
e.loadSpineWithSkin = function(e, t, o, n, a) {
var i = this.getSpine(e);
cc.isValid(i) && t && cc.loader.loadRes(t, sp.SkeletonData, function(e, t) {
if (e) cc.error(e.message || e); else if (cc.isValid(i)) {
var c = 0, r = "", s = !0, l = "";
if (o) {
c = o.trackIndex || 0;
r = o.name || "";
null != o.loop && void 0 != o.loop && (s = o.loop);
l = o.skin || "";
}
i.skeletonData = t;
"" != l && i.setSkin(l);
"function" == typeof a && i.setCompleteListener(function() {
a();
});
i.findAnimation(r) ? i.setAnimation(c, r, s) : cc.log("[SpineManager] 找不到动画名称: " + r);
"function" == typeof n && n();
}
});
};
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
SpriteManager: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "3c11cDw8I5A2pSdxo0VSftu", "SpriteManager");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.init = function() {
this.atlasCache = {};
};
e.createSpriteNode = function(e) {
var t = new cc.Node("sprite_" + e || "");
t.addComponent(cc.Sprite);
t.setName(e || "");
return t;
};
e.setSpriteFrame = function(e, t) {
var o = null;
if (cc.isValid(e)) {
e instanceof cc.Sprite ? o = e : e instanceof cc.Node && ((o = e.getComponent(cc.Sprite)) || (o = e.addComponent(cc.Sprite)));
cc.isValid(o) && (o.spriteFrame = t);
}
};
e.loadSpriteForNode = function(e, t, o) {
if (cc.isValid(e)) {
var n = e.getComponent(cc.Sprite);
this.loadSprite(n, t, o);
}
};
e.loadSprite = function(e, t, o, n) {
cc.isValid(e) && t && cc.loader.loadRes(t, cc.SpriteFrame, function(t, a) {
if (t) {
cc.error(t.message || t);
"function" == typeof n && n();
} else if (cc.isValid(e)) {
e.spriteFrame = a;
"function" == typeof o && o();
}
});
};
e.loadSpriteAtlasForNode = function(e, t, o, n, a) {
if (cc.isValid(e)) {
var i = e.getComponent(cc.Sprite);
this.loadSpriteAtlas(i, t, o, n, a);
}
};
e.loadSpriteAtlas = function(e, t, o, n, a) {
var i = this;
if (cc.isValid(e) && t && o) {
var c = i.atlasCache[t];
if (c) {
var r = c.getSpriteFrame(o);
if (r) {
e.spriteFrame = r;
"function" == typeof n && n();
} else "function" == typeof a && a();
} else cc.loader.loadRes(t, cc.SpriteAtlas, function(c, r) {
if (!c && r) {
i.restrictAtlasCache();
i.atlasCache[t] = r;
var s = r.getSpriteFrame(o);
if (s) {
e.spriteFrame = s;
"function" == typeof n && n();
} else "function" == typeof a && a();
} else "function" == typeof a && a();
});
}
};
e.restrictAtlasCache = function() {
var e = this, t = Object.keys(e.atlasCache);
t && t.length > 5 && t.forEach(function(t) {
if (!(Object.keys(e.atlasCache).length <= 5)) {
e.atlasCache[t] && delete e.atlasCache[t];
console.log("SpriteManager ==》 删除缓存图集：" + t + "，剩余：" + Object.keys(e.atlasCache).length);
}
});
};
e.getSprite = function(e, t) {
cc.loader.loadRes(e, cc.SpriteFrame, function(e, o) {
e ? cc.error(e.message || e) : o && "function" == typeof t && t(o);
});
};
e.loadRemoteUrl = function(e, t, o, n) {
var a = null;
cc.isValid(e) && (e instanceof cc.Sprite ? a = e : e instanceof cc.Node && ((a = e.getComponent(cc.Sprite)) || (a = e.addComponent(cc.Sprite))));
null != a ? cc.loader.load(t, function(e, t) {
if (e) {
cc.error(e.message || e);
"function" == typeof n && n();
} else if (t && t.url && cc.isValid(a) && cc.isValid(a.node)) {
var i = new cc.SpriteFrame(t);
if (i) {
a.spriteFrame = i;
"function" == typeof o && o();
} else "function" == typeof n && n();
} else "function" == typeof n && n();
}) : "function" == typeof n && n();
};
e.atlasCache = {};
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
Toast: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "b4cf67cDZpLZpwLFmucq9Tw", "Toast");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, a = n.ccclass, i = n.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.message = null;
return t;
}
t.prototype.init = function(e) {
cc.isValid(this.node) && (this.node.active = !0);
cc.isValid(this.message) && (this.message.string = e);
if (this.hideToast) {
console.log("show toast: " + e);
this.unschedule(this.hideToast);
this.schedule(this.hideToast, 0, 1, 2);
}
var t = cc.winSize;
if (t) {
this.node.x = t.width / 2;
this.node.y = t.height / 2;
}
};
t.prototype.hideToast = function() {
console.log("hide toast......");
this.node.active = !1;
};
__decorate([ i(cc.Label) ], t.prototype, "message", void 0);
return t = __decorate([ a ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
}, {} ],
UserManager: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "e9d0a6ZPV9E35L2SR5nWjRo", "UserManager");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("../Resources/ResManager"), a = e("../Utils/LocalStorageMgr"), i = e("./User"), c = e("../Base/CommonEventName"), r = e("./GameManager"), s = function() {
function e() {}
e.createRandomUser = function(e) {
var t = new i.default(), o = 1e4 + parseInt((1e4 * Math.random()).toString()), a = parseInt((2 * Math.random()).toString()), c = Math.random() * this.userNames.length, s = this.userNames[parseInt(c.toString())], l = (parseInt((Math.random() * n.default.common.texture.userAvatars.length).toString()), 
this.INIT_COIN);
e && (l = parseInt((Math.random() * this.INIT_COIN * 10).toString()));
t.id = o;
t.name = s;
t.gender = a;
t.coin = l;
t.avatar = a;
t.records = [ 0, 0, 0 ];
t.planes = [ r.default.PLANE_TYPE.PLANE1 ];
t.curPlane = r.default.PLANE_TYPE.PLANE1;
return t;
};
e.initLoginUser = function() {
this.currentUser = a.default.getLoginUser();
return this.currentUser;
};
e.guestLogin = function() {
this.currentUser = a.default.getLoginUser();
if (!this.currentUser) {
this.currentUser = this.createRandomUser();
a.default.saveLoginUser(this.currentUser);
}
return this.currentUser;
};
e.getLoginUser = function() {
return this.currentUser;
};
e.updateLoginUser = function(e) {
if (e) {
a.default.saveLoginUser(this.currentUser);
this.currentUser = e;
cc.director.emit(c.default.EVENT_REFRESH_USER_INFO);
}
};
e.userNames = [ "Sam", "Barney", "Lily", "Kate", "Katherine", "James", "Bob", "Carl" ];
e.INIT_COIN = 0;
e.currentUser = null;
return e;
}();
o.default = s;
cc._RF.pop();
}, {
"../Base/CommonEventName": "CommonEventName",
"../Resources/ResManager": "ResManager",
"../Utils/LocalStorageMgr": "LocalStorageMgr",
"./GameManager": "GameManager",
"./User": "User"
} ],
User: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "1185bjrNkNHvp4mXmXed2OY", "User");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
return function() {};
}();
o.default = n;
cc._RF.pop();
}, {} ]
}, {}, [ "CommonDragView", "CountDown", "Toast", "BaseDialog", "DistanceCounter", "Game", "GameOverDialog", "Plane", "Rock", "RockScene", "Hall", "Launcher", "Loading", "Room", "PurchaseBtn", "Shop", "CommonAudioMgr", "CommonEventName", "CommonFunction", "CommonPrefabMgr", "Global", "GameManager", "User", "UserManager", "Language", "ResManager", "DateFormat", "LabelManager", "NodeManager", "PrefabManager", "SpineManager", "SpriteManager", "CountDownUtil", "LocalStorageMgr", "NativeUtil" ]);