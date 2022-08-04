class ResManager {


    public static common = {
        audio: {
            bgm: "common/audio/bgm",
            btnClick: "common/audio/btn_click"
        },
        prefab: {
            toast: "common/prefab/Toast",
        },
        texture: {
            userAvatars: [
                "common/texture/head_female",
                "common/texture/head_male",
            ],
            btn1: "common/texture/btn_1",
            btn2: "common/texture/btn_2",
            btn3: "common/texture/btn_3",
        }
    };

    public static room = {
        texture: {},
        animation: {},
        prefab: {}
    };

    public static game = {
        texture: {
            rockEasy: [
                "game/texture/rock_easy/rock1",
                "game/texture/rock_easy/rock2",
                "game/texture/rock_easy/rock3",
            ],
            rockOrdinary: [
                "game/texture/rock_ordinary/rock1",
                "game/texture/rock_ordinary/rock2",
                "game/texture/rock_ordinary/rock3",
            ],
            rockDifficulty: [
                "game/texture/rock_difficulty/rock1",
                "game/texture/rock_difficulty/rock2",
                "game/texture/rock_difficulty/rock3",
            ]
        },
        animation: {},
        prefab: {}
    };
}


export default ResManager;