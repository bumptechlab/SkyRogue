import CommonFunction from "./CommonFunction";
import ResManager from "../Resources/ResManager";
import PrefabManager from "../UI/PrefabManager";
import Global from "./Global";

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


}

export default CommonPrefabMgr;