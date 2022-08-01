class CommonFunction {

    static getSceneCanvas() {
        if (cc.director) {
            let directorScene = cc.director.getScene();
            if (cc.isValid(directorScene)) {
                let canvas = directorScene.getChildByName('Canvas');
                if (cc.isValid(canvas)) {
                    return canvas;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
        return null;
    }

    //防止按钮多次点击
    static clickManager(btnNode, timeout = 1500) {
        if (!cc.isValid(btnNode)) {
            return;
        }
        let noteBtn = btnNode.getComponent(cc.Button);
        if (cc.isValid(noteBtn)) {
            noteBtn.interactable = false;
        }
        let timer = setTimeout(function () {
            if (cc.isValid(noteBtn)) {
                noteBtn.interactable = true;
            }
            clearInterval(timer);
        }, timeout);
    }

}

export default CommonFunction;