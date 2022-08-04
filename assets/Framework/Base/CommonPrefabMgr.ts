import CommonFunction from "./CommonFunction";
import ResManager from "../Resources/ResManager";
import PrefabManager from "../UI/PrefabManager";
import Global from "./Global";
import GameOverDialog from "../../Component/Game/GameOverDialog";

class CommonPrefabMgr {

    static createToast(message, indexZ = Global.Config.layerZOrder.Toast) {
        let canvas = CommonFunction.getSceneCanvas();
        if (cc.isValid(canvas)) {
            let oldToast = canvas.getChildByName("Toast");
            if (oldToast) {
                canvas.removeChild(oldToast);
            }
        }

        let prefabPath = ResManager.common.prefab.toast;
        PrefabManager.getPrefabIns(prefabPath, function (prefab) {
            if (cc.isValid(canvas) && prefab) {
                canvas.addChild(prefab, indexZ);
                if (prefab.getComponent("Toast")) {
                    prefab.getComponent("Toast").init(message);
                }
                prefab.x = 0;
                prefab.y = 0;
            }
        });
    }


    static showGameOverDialog(distance: number, gold: number, backCallback, continueCallback) {
        let canvas = CommonFunction.getSceneCanvas();
        PrefabManager.getPrefab(ResManager.game.prefab.gameOverDialog, function (prefab) {
            if (prefab) {
                let propBox = cc.instantiate(prefab);
                if (propBox) {
                    if (cc.isValid(canvas)) {
                        canvas.addChild(propBox, Global.Config.layerZOrder.Dialog);
                    }
                    if (propBox.getComponent(GameOverDialog)) {
                        propBox.getComponent(GameOverDialog).showDialog(distance, gold, backCallback, continueCallback);
                    }
                }
            }
        });
    }


}

export default CommonPrefabMgr;