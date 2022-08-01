class SpriteManager {

    public static atlasCache = {};

    public static init(): void {
        let self = this;
        self.atlasCache = {};
    }


    public static createSpriteNode(name?) {
        let node = new cc.Node("sprite_" + name || "");
        node.addComponent(cc.Sprite);
        // @ts-ignore
        node.setName(name || "");
        return node;
    }

    public static setSpriteFrame(node, spriteFrame) {
        let spriteNode = null;
        if (cc.isValid(node)) {
            if (node instanceof cc.Sprite) {
                spriteNode = node;
            } else if (node instanceof cc.Node) {
                spriteNode = node.getComponent(cc.Sprite);
                if (!spriteNode) {
                    spriteNode = node.addComponent(cc.Sprite);
                }
            }
            if (cc.isValid(spriteNode)) {
                spriteNode.spriteFrame = spriteFrame;
            }
        }
    }

    public static loadSpriteForNode(node, path, callback?) {
        let self = this;
        if (cc.isValid(node)) {
            let sprite = node.getComponent(cc.Sprite);
            self.loadSprite(sprite, path, callback);
        }
    }

    public static loadSprite(sprite, path, callback?, errorCallback?) {
        if (cc.isValid(sprite) && path) {
            cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    cc.error(err.message || err);
                    if (typeof errorCallback === "function") {
                        errorCallback();
                    }
                    return;
                }
                if (cc.isValid(sprite)) {
                    sprite.spriteFrame = spriteFrame;
                    if (typeof callback === "function") {
                        callback();
                    }
                }
            });
        }
    }

    /**
     * 动态加载图集资源，为节点加载图集中的图片
     * @param node
     * @param path 图集资源路径
     * @param spriteName 图集里面的图片名称
     * @param callback
     * @param errorCallback
     */
    public static loadSpriteAtlasForNode(node, path, spriteName, callback?, errorCallback?) {
        let self = this;
        if (cc.isValid(node)) {
            let sprite = node.getComponent(cc.Sprite);
            self.loadSpriteAtlas(sprite, path, spriteName, callback, errorCallback);
        }
    }


    /**
     * 动态加载图集资源，为Sprite组件加载图集中的图片
     * 由于图集资源加载缓慢，需要加入缓存机制
     * @param sprite
     * @param path 图集资源路径
     * @param spriteName 图集里面的图片名称
     * @param callback
     * @param errorCallback
     */
    public static loadSpriteAtlas(sprite, path, spriteName, callback?, errorCallback?) {
        let self = this;
        if (cc.isValid(sprite) && path && spriteName) {

            let atlasCache = self.atlasCache[path];
            if (atlasCache) {
                let spriteFrame = atlasCache.getSpriteFrame(spriteName);
                if (spriteFrame) {
                    sprite.spriteFrame = spriteFrame;
                    if (typeof callback === "function") {
                        callback();
                    }
                } else {
                    if (typeof errorCallback === "function") {
                        errorCallback();
                    }
                }
            } else {
                cc.loader.loadRes(path, cc.SpriteAtlas, function (err, atlas) {
                    if (err || !atlas) {
                        if (typeof errorCallback === "function") {
                            errorCallback();
                        }
                        return;
                    }
                    self.restrictAtlasCache();
                    self.atlasCache[path] = atlas;

                    let spriteFrame = atlas.getSpriteFrame(spriteName);
                    if (spriteFrame) {
                        sprite.spriteFrame = spriteFrame;
                        if (typeof callback === "function") {
                            callback();
                        }
                    } else {
                        if (typeof errorCallback === "function") {
                            errorCallback();
                        }
                    }
                });

            }
        }
    }


    /**
     * 保证图集资源最多缓存5个，按照先进先出的原则进行管理
     */
    private static restrictAtlasCache() {
        let self = this;
        let limitCount = 5;
        let keys = Object.keys(self.atlasCache);
        if (keys && keys.length > limitCount) {
            keys.forEach((key) => {
                if (Object.keys(self.atlasCache).length <= limitCount) {
                    return;
                }
                if (self.atlasCache[key]) {
                    delete (self.atlasCache[key]); // 删除对象的key。
                }
                console.log("SpriteManager ==》 删除缓存图集：" + key + "，剩余：" + Object.keys(self.atlasCache).length);
            });
        }
    }


    /**
     * 只获取SpriteFrame，不对组件进行赋值
     * @param path
     * @param callback
     */
    public static getSprite(path, callback?) {
        cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            if (spriteFrame) {
                if (typeof callback === "function") {
                    callback(spriteFrame);
                }
            }
        });
    }

    public static loadRemoteUrl(node, path, callback?, errorCallback?) {
        let spriteNode = null;
        if (cc.isValid(node)) {
            if (node instanceof cc.Sprite) {
                spriteNode = node;
            } else if (node instanceof cc.Node) {
                spriteNode = node.getComponent(cc.Sprite);
                if (!spriteNode) {
                    spriteNode = node.addComponent(cc.Sprite);
                }
            }
        }

        if (spriteNode == null) {
            if (typeof errorCallback === "function") {
                errorCallback();
            }
            return;
        }

        cc.loader.load(path, function (err, tex) {
            if (err) {
                cc.error(err.message || err);
                if (typeof errorCallback === "function") {
                    errorCallback();
                }
                return;
            }

            if (tex && tex.url && cc.isValid(spriteNode) && cc.isValid(spriteNode.node)) {
                let spriteFrame = new cc.SpriteFrame(tex);
                if (spriteFrame) {
                    spriteNode.spriteFrame = spriteFrame;
                    if (typeof callback === "function") {
                        callback();
                    }
                } else {
                    if (typeof errorCallback === "function") {
                        errorCallback();
                    }
                }
            } else {
                if (typeof errorCallback === "function") {
                    errorCallback();
                }
            }
        });
    }
}

export default SpriteManager;
