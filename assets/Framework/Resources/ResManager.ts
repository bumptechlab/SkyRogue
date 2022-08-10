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
        audio: {
            crash: "game/audio/crash"
        },
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
        config: {
            rockEasy: [
                [53, 67],
                [72, 80],
                [38, 36],
            ],
            rockOrdinary: [
                [72, 71],
                [51, 51],
                [96, 96],
            ],
            rockDifficulty: [
                [69, 43],
                [93, 89],
                [109, 138],
            ],
            planeSize: [
                [136, 139],
                [148, 161],
                [181, 161]
            ]
        },
        animation: {},
        prefab: {
            gameOverDialog: "game/prefab/GameOverDialog"
        }
    };
}


export default ResManager;