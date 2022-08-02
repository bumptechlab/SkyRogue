class ResManager {


    public static common = {
        audio: {
            bgm: "common/audio/bgm",
            btnClick: "common/audio/btn_click"
        },
        prefab: {
            toast: "common/prefab/Toast",
            userDialog: "common/prefab/UserDialog",
            settingDialog: "common/prefab/SettingDialog",
            ruleDialog: "common/prefab/RuleDialog",
            checkinDialog: "common/prefab/CheckinDialog",
        },
        texture: {
            userAvatars: [
                "common/texture/head_female",
                "common/texture/head_male",
            ],
            userAvatarsVS: [
                "common/texture/home_img_head2",
                "common/texture/home_img_head3",
            ],
            numbers: [
                "common/texture/number/0",
                "common/texture/number/1",
                "common/texture/number/2",
                "common/texture/number/3",
                "common/texture/number/4",
                "common/texture/number/5",
                "common/texture/number/6",
                "common/texture/number/7",
                "common/texture/number/8",
                "common/texture/number/9",
            ],
            off: "common/texture/icon_off",
            on: "common/texture/icon_on",
            checkin:{
                bgCheckable: "common/texture/checkin/bg_checkable",
                bgNotSelect: "common/texture/checkin/bg_not_selected"
            }
        }
    };

    public static room = {
        texture: {
            roomTitle: [
                "gameRoom/texture/title_room_one",
                "gameRoom/texture/title_room_three",
                "gameRoom/texture/title_room_five"
            ],
            gesture: [
                "gameRoom/texture/scissor",
                "gameRoom/texture/rock",
                "gameRoom/texture/paper"
            ],
            life: "gameRoom/texture/life",
            winner: "gameRoom/texture/winner",
            draw: "gameRoom/texture/draw"
        },
        animation: {
            vs: "gameRoom/animation/VS"
        },
        prefab: {
            winDialog: "gameRoom/prefab/WinDialog",
            lostDialog: "gameRoom/prefab/LostDialog",
            drawDialog: "gameRoom/prefab/DrawDialog"
        }
    };

}

export default ResManager;