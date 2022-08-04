class NodeManager {

    public static setVisible(node, visiable = false) {
        if (cc.isValid(node)) {
            if (node instanceof cc.Node) {
                node.active = visiable;
            } else {
                node.node.active = visiable;
            }
        }
    }

    public static setInteractable(node, interactable: boolean) {
        if (cc.isValid(node)) {
            let button = null;
            if (node instanceof cc.Button) {
                button = node;
            } else if (node instanceof cc.Node) {
                button = node.getComponent(cc.Button);
            }
            if (cc.isValid(button)) {
                button.interactable = interactable;
                //button.disabledColor = cc.color(124, 124, 124);
            }
        }
    }

    public static setOpacity(node, opacity) {
        if (cc.isValid(node)) {
            if (node instanceof cc.Node) {
                node.opacity = opacity;
            } else {
                node.node.opacity = opacity;
            }
        }
    }

    public static createNode(name) {
        let node = new cc.Node("node_" + name || "");
        // @ts-ignore
        node.setName(name.toString() || "");
        return node;
    }

    public static findChildByName(node, urlPath): cc.Node {
        return cc.find(urlPath, node);
    }

    /**
     * 给某节点下的所以子节点设置相关资源：
     * Sprite组件设置SpriteFrame,
     * Label组件设置Font
     *
     * @param node 需要加载资源的父节点
     * @param nodeRes 节点对应的资源路径
     * {
     *  sprite: [{
     *       nodePath: "leftbg",
     *       resPath: "skin-heijin/club-vn/un/colordish/texture/hj_sd_img_bg_table",
     *       spriteName: "head_boy1"
     *  }],
     *  font: [{
     *       nodePath: "leftbg",
     *       resPath: "skin-heijin/club-vn/un/colordish/texture/hj_sd_img_bg_table",
     *       spacingX: -1,
     *  }]
     * }
     * @param gameId 根据GameId获取缓存中的资源
     */
    public static loadNodeRes(parent: cc.Node, nodeRes, gameId?): void {
        let self = this;
        if (!cc.isValid(parent) || !nodeRes) {
            return;
        }

        //加载图片
        if (nodeRes.sprite) {
            console.log("NodeManager ======= 图片加载开始，父节点[%s] =======", parent.name);
            for (let i = 0; i < nodeRes.sprite.length; i++) {
                let nodePath = nodeRes.sprite[i].nodePath;
                let resPath = nodeRes.sprite[i].resPath;
                let spriteName = nodeRes.sprite[i].spriteName;

                let spriteNode = null;
                if (nodePath == "" || nodePath == "/") { //表明是根节点
                    spriteNode = parent;
                } else {
                    spriteNode = cc.find(nodePath, parent);
                }

                if (cc.isValid(spriteNode) && resPath) {
                    let spriteFrame = self.getAssetByPath(resPath, "sprite", spriteName, gameId);

                    if (spriteFrame) {
                        console.log("NodeManager ==》子节点[%s]，从内存中加载图片：%s", nodePath, resPath);
                        UIDepend.SpriteManager.setSpriteFrame(spriteNode, spriteFrame);
                    } else {
                        console.log("NodeManager ==》子节点[%s]，内存中找不到图片，动态加载：%s", nodePath, resPath);
                        if (spriteName) {
                            UIDepend.SpriteManager.loadSpriteAtlasForNode(spriteNode, resPath, spriteName);
                        } else {
                            UIDepend.SpriteManager.loadSpriteForNode(spriteNode, resPath);
                        }

                    }
                }
            }
        }
        //加载字体
        if (nodeRes.font) {
            console.log("NodeManager ======= 字体加载开始，父节点[%s] =======", parent.name);
            for (let i = 0; i < nodeRes.font.length; i++) {
                let nodePath = nodeRes.font[i].nodePath;
                let resPath = nodeRes.font[i].resPath;
                let spacingX = nodeRes.font[i].spacingX;

                let fontNode = null;
                if (nodePath == "" || nodePath == "/") { //表明是根节点
                    fontNode = parent;
                } else {
                    fontNode = cc.find(nodePath, parent);
                }

                if (cc.isValid(fontNode) && resPath) {
                    let font = self.getAssetByPath(resPath, "font");
                    if (font) {
                        console.log("NodeManager ==》子节点[%s]，从内存中加载字体：%s", nodePath, resPath);
                        UIDepend.LabelManager.setFont(fontNode, font, spacingX);
                    } else {
                        console.log("NodeManager ==》子节点[%s]，内存中找不到字体，动态加载：%s", nodePath, resPath);
                        UIDepend.LabelManager.loadFont(fontNode, resPath, spacingX);
                    }
                }
            }
        }
    }


    /**
     * 从图集缓存或者场景缓存中获取图片/字体
     * @param resPath 资源路径，可以是图片、字体、图集的路径
     * @param type 表明是图片、字体资源；取值："sprite", "font"
     * @param spriteName 从图集中获取图片，需要传入图片名
     * @param gameId 当前场景ID，传入ID可以获取获取场景缓存
     */
    private static getAssetByPath(resPath, type, spriteName?, gameId?) {
        if (!resPath) {
            return null;
        }

        if (spriteName && type == "sprite") {
            //有spriteName说明要求从图集中获取图片
            let spriteFrame = UIDepend.SpriteManager.getSpriteFromCommonAtlas(resPath, spriteName);
            return spriteFrame;
        } else {
            // 没有spriteName说明从缓存获取图片/字体
            let cacheAssets = CommonDepend.ResourceManager.getResByGameId(gameId);
            if (!cacheAssets) {
                return null;
            }

            //截取路径后面的文件名
            let assetName = "";
            if (resPath.indexOf("/") != -1) {
                let parts = resPath.split("/");
                assetName = parts[parts.length - 1];
            } else {
                assetName = resPath;
            }

            return cacheAssets.find(asset => {
                if (type == "sprite") {
                    return asset instanceof cc.SpriteFrame && asset.name == assetName;
                } else if (type == "font") {
                    return asset instanceof cc.Font && asset.name == assetName;
                }
                return false;
            });
        }

    }

    public static setLabelColor(node, color) {
        if (cc.isValid(node)) {
            node.color = new cc.Color().fromHEX(color);
        }
    }
}

export default NodeManager;
