class PrefabManager {


    public static loadPrefabToNode(prefab, node): void {
        if (cc.isValid(prefab) && cc.isValid(node)) {
            let prefabIns = cc.instantiate(prefab);
            if (cc.isValid(prefabIns)) {
                node.addChild(prefabIns);
            }
        }
    }

    public static loadPrefab(path, callback, node?) {
        if (!node) {
            node = CommonDepend.CommonFunction.getSceneCanvas();
        }
        cc.loader.loadRes(path, function (err, prefab) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            if (prefab && cc.isValid(node)) {
                let prefabIns = cc.instantiate(prefab);
                if (prefabIns) {
                    node.addChild(prefabIns, Cocos20.Global.layerZOrder.Dialog);
                    if (typeof callback === 'function') {
                        callback(prefabIns);
                    }
                }
            }
        });
    }

    static getPrefab(path, successCallback?, failCallback?) {
        cc.loader.loadRes(path, function (err, prefab) {
            if (err) {
                cc.error(err.message || err);
                if (failCallback) {
                    failCallback();
                }
                return;
            }
            if (prefab) {
                if (typeof successCallback === 'function') {
                    successCallback(prefab);
                }
            } else {
                if (failCallback) {
                    failCallback();
                }
            }
        });
    }

    public static getPrefabIns(path, successCallback?, failCallback?) {
        cc.loader.loadRes(path, function (err, prefab) {
            if (err) {
                cc.error(err.message || err);
                if (failCallback) {
                    failCallback();
                }
                return;
            }
            if (prefab) {
                let prefabIns = cc.instantiate(prefab);
                if (prefabIns) {
                    if (typeof successCallback === 'function') {
                        successCallback(prefabIns);
                    }
                } else {
                    if (failCallback) {
                        failCallback();
                    }
                }
            } else {
                if (failCallback) {
                    failCallback();
                }
            }
        });
    }
}

export default PrefabManager;