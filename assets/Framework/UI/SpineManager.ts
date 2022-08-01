class SpineManager {

    private static getSpine(node) {
        let resultSpine = null;
        if (cc.isValid(node)) {
            if (node instanceof sp.Skeleton) {
                resultSpine = node;
            } else if (node instanceof cc.Node) {
                resultSpine = node.getComponent(sp.Skeleton);
                if (!resultSpine) {
                    resultSpine = node.addComponent(sp.Skeleton);
                }
            }
        }
        return resultSpine;
    }

    public static loadSpine(node, path, animationOption, completeCallback?, eventListener?) {
        let self = this;
        let spine = self.getSpine(node);

        if (cc.isValid(spine) && path) {
            cc.loader.loadRes(path, sp.SkeletonData, function (err, res) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
                if (cc.isValid(spine)) {
                    let trackIndex: number = 0;
                    let name: string = "";
                    let loop: boolean = true;
                    if (animationOption) {
                        trackIndex = animationOption.trackIndex || 0;
                        name = animationOption.name || "";
                        if (animationOption.loop != null && animationOption.loop != undefined) {
                            loop = animationOption.loop;
                        }
                    }
                    spine.skeletonData = res;
                    spine.setAnimation(trackIndex, name, loop);

                    if (typeof eventListener == "function") {
                        spine.setEventListener(function (trackEntry, eventData) {
                            eventListener(trackEntry, eventData);
                        });
                    }
                    if (typeof completeCallback === 'function') {
                        spine.setCompleteListener(function () {
                            completeCallback();
                        });
                    }
                }

            });
        }
    }


    /**
     * 动态加载Skeleton，只加载，不执行
     * @param skeletonNode :sp.Skeleton
     * @param skeletonPath :String
     * @param successCallback
     * @param failedCallback
     */
    public static loadSkeleton(skeletonNode, skeletonPath, successCallback, failedCallback = null) {
        let self = this;
        let skeleton = self.getSpine(skeletonNode);

        if (cc.isValid(skeleton)) {
            cc.loader.loadRes(skeletonPath, sp.SkeletonData, function (err, skeletonData) {
                if (err) {
                    cc.log(err.message || err);
                    if (failedCallback) {
                        failedCallback();
                    }
                    return;
                }

                if (cc.isValid(skeleton)) {
                    skeleton.skeletonData = skeletonData;
                    if (successCallback) {
                        successCallback();
                    }
                }
            });
        }
    }

    public static loadSpineWithSkin(node, path, animationOption, loadCallback?, completeCallback?) {
        let self = this;
        let spine = self.getSpine(node);

        if (cc.isValid(spine) && path) {
            cc.loader.loadRes(path, sp.SkeletonData, function (err, res) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
                if (cc.isValid(spine)) {
                    let trackIndex: number = 0;
                    let name: string = "";
                    let loop: boolean = true;
                    let skin: string = "";
                    if (animationOption) {
                        trackIndex = animationOption.trackIndex || 0;
                        name = animationOption.name || "";
                        if (animationOption.loop != null && animationOption.loop != undefined) {
                            loop = animationOption.loop;
                        }
                        skin = animationOption.skin || "";
                    }
                    spine.skeletonData = res;
                    if (skin != "") {
                        spine.setSkin(skin);
                    }
                    if (typeof completeCallback === 'function') {
                        spine.setCompleteListener(function () {
                            completeCallback();
                        });
                    }

                    let isExistAnimationName = spine.findAnimation(name);
                    if (isExistAnimationName) {
                        spine.setAnimation(trackIndex, name, loop);
                    } else {
                        cc.log("[SpineManager] 找不到动画名称: " + name);
                    }

                    if (typeof loadCallback === 'function') {
                        loadCallback();
                    }
                }
            });
        }
    }


}

export default SpineManager;
