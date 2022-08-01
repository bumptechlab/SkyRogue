// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import UserManager from "../../Framework/Business/UserManager";
import LabelManager from "../../Framework/UI/LabelManager";
import GameManager from "../../Framework/Business/GameManager";
import CommonPrefabMgr from "../../Framework/Base/CommonPrefabMgr";
import SpriteManager from "../../Framework/UI/SpriteManager";
import ResManager from "../../Framework/Resources/ResManager";
import Language from "../../Framework/Resources/Language";
import NativeUtil from "../../Framework/Utils/NativeUtil";
import formatStr = cc.js.formatStr;
import CommonAudioMgr from "../../Framework/Base/CommonAudioMgr";
import CommonFunction from "../../Framework/Base/CommonFunction";
import CommonEventName from "../../Framework/Base/CommonEventName";
import RandomAvatar from "../Common/RandomAvatar";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hall extends cc.Component {

    private STATE_HALL = 0;
    private STATE_MATCH = 1;

    @property(cc.Node)
    hallLayout: cc.Node = null;

    @property(cc.Sprite)
    avatarSprite: cc.Sprite = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    idLabel: cc.Label = null;

    @property(cc.Label)
    coinLabel: cc.Label = null;

    @property(cc.Node)
    homeLogo: cc.Node = null;

    @property(cc.Node)
    matchLayout: cc.Node = null;

    @property(cc.Sprite)
    roomTitleSprite: cc.Sprite = null;

    @property(cc.Sprite)
    meMatchAvatarSprite: cc.Sprite = null;

    @property(cc.Label)
    betTipsLabel: cc.Label = null;

    @property(RandomAvatar)
    randomAvatar: RandomAvatar = null;

    protected onLoad() {
        let self = this;
        console.log("=== Hall onLoad ===");
        CommonAudioMgr.playMusic(ResManager.common.audio.bgm, true, 1);
        self.initUserInfo();
    }

    protected onEnable(): void {
        let self = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, self.onKeyUp, this);
        cc.director.on(CommonEventName.EVENT_REFRESH_USER_INFO, self.initUserInfo, self);
    }

    protected onDisable(): void {
        let self = this;
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, self.onKeyUp, self);
        cc.director.off(CommonEventName.EVENT_REFRESH_USER_INFO, self.initUserInfo, self);
    }

    private initUserInfo(): void {
        let self = this;
        let user = UserManager.getLoginUser();
        let avatarPath = ResManager.common.texture.userAvatars[user.avatar];
        SpriteManager.loadSprite(self.avatarSprite, avatarPath);
        LabelManager.setLabelString(self.nameLabel, user.name);
        LabelManager.setLabelString(self.idLabel, user.id);
        LabelManager.setLabelString(self.coinLabel, user.coin);
    }

    protected onClickCheckin(event): void {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

        CommonPrefabMgr.showCheckinDialog();
    }

    protected onClickGuide(event): void {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

        CommonPrefabMgr.showRuleDialog();
    }

    protected onClickSetting(event): void {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

        CommonPrefabMgr.showSettingDialog();
    }

    protected onClickRoomOne(event): void {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

        let user = UserManager.getLoginUser();
        if (user.coin < GameManager.roomInfo.roomOne.limit) {
            CommonPrefabMgr.createToast(Language.common.notEnoughMoney);
            return;
        }
        this.setCurShowState(this.STATE_MATCH, GameManager.ROOM_KIND.ONE);
    }

    protected onClickRoomThree(event): void {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

        let user = UserManager.getLoginUser();
        if (user.coin < GameManager.roomInfo.roomThree.limit) {
            CommonPrefabMgr.createToast(Language.common.notEnoughMoney);
            return;
        }
        this.setCurShowState(this.STATE_MATCH, GameManager.ROOM_KIND.THREE);
    }

    protected onClickRoomFive(event): void {
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

        let user = UserManager.getLoginUser();
        if (user.coin < GameManager.roomInfo.roomFive.limit) {
            CommonPrefabMgr.createToast(Language.common.notEnoughMoney);
            return;
        }
        this.setCurShowState(this.STATE_MATCH, GameManager.ROOM_KIND.FIVE);
    }

    private currentRoomKind;
    private isRandomAvatarRunning = false;

    protected onClickBeginMatch(event): void {
        let self = this;
        CommonFunction.clickManager(event.target);
        CommonAudioMgr.playEffect(ResManager.common.audio.btnClick);

        if (!cc.isValid(self.randomAvatar) || self.isRandomAvatarRunning) {
            return;
        }

        let room = GameManager.createRoom(self.currentRoomKind);
        if (room == null) {
            CommonPrefabMgr.createToast(Language.common.notEnoughMoney);
            return;
        }

        self.isRandomAvatarRunning = true;
        self.randomAvatar.startRandomAnimation(room.opponent.avatar, function () {
            // let avatarPath = ResManager.common.texture.userAvatarsVS[room.opponent.avatar];
            // SpriteManager.loadSpriteForNode(self.randomAvatar.node, avatarPath);

            let timeout = setTimeout(function () {
                clearTimeout(timeout);
                if (!cc.isValid(self.node)) {
                    return;
                }
                self.isRandomAvatarRunning = false;
                GameManager.enterRoom();
            }, 1000);
        })

    }

    public setCurShowState(state: number, roomKind?: number) {
        if (state == this.STATE_HALL) {
            this.hallLayout.active = true;
            this.homeLogo.active = true;
            this.matchLayout.active = false;
        } else {
            this.hallLayout.active = false;
            this.homeLogo.active = false;
            this.matchLayout.active = true;

            let loginUser = UserManager.getLoginUser();
            SpriteManager.loadSprite(this.roomTitleSprite, ResManager.room.texture.roomTitle[roomKind]);
            SpriteManager.loadSprite(this.meMatchAvatarSprite, ResManager.common.texture.userAvatars[loginUser.avatar]);
            LabelManager.setLabelString(this.betTipsLabel, formatStr(Language.common.betAmountTips, GameManager.betAmount));
            this.currentRoomKind = roomKind;
        }
    }

    public onKeyUp(event): void {
        if (event.keyCode == cc.macro.KEY.back) {
            NativeUtil.quitGame();
        }
    }

    protected onDestroy(): void {

    }
}
