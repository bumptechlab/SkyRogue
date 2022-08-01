class LabelManager {
    private static sourceSansProRegularFont: cc.Font;
    private static sourceSansProBoldFont: cc.Font;
    private static sourceSansProSemiBoldFont: cc.Font;

    public static initLabelManager() {
        let self = this;
        self.initFont();
    }

    public static createLabelNode(name?) {
        let node = new cc.Node("label_" + name || "");
        node.addComponent(cc.Label);
        // @ts-ignore
        node.setName(name || "");
        return node;
    }

    public static setLabelOutline(node, color, width = 1) {
        let self = this;
        let labelOutline = self.getLabelOutline(node);
        if (cc.isValid(labelOutline)) {
            labelOutline.color = cc.color().fromHEX(color);
            labelOutline.width = width;
        }
    }

    public static getLabelOutline(node) {
        if (cc.isValid(node)) {
            let destNode = node;
            if (node instanceof cc.Label) {
                destNode = node.node;
            } else {
                destNode = node;
            }

            let result = destNode.getComponent(cc.LabelOutline);
            if (!result) {
                result = destNode.addComponent(cc.LabelOutline);
            }
            return result;
        }
        return node;
    }

    public static setLabelColor(label, hexColor) {
        if (cc.isValid(label)) {
            if (label instanceof cc.Node) {
                // do nothing
            } else if (label instanceof cc.Label) {
                label = label.node;
            }
            if (cc.isValid(label)) {
                label.color = cc.color().fromHEX(hexColor);
            }
        }
    }

    public static setLabelFontSize(label, fontSize) {
        if (cc.isValid(label)) {
            if (label instanceof cc.Label) {
                // do nothing
            } else if (label instanceof cc.Node) {
                label = label.getComponent(cc.Label);
            }
            if (cc.isValid(label)) {
                label.fontSize = fontSize;
            }
        }
    }

    public static setLabelString(label, labelTxt) {
        if (cc.isValid(label)) {
            if (label instanceof cc.Label) {
                // do nothing
            } else if (label instanceof cc.Node) {
                label = label.getComponent(cc.Label);
            }
            if (cc.isValid(label)) {
                label.string = labelTxt;
            }
        }
    }

    public static setRichText(label, labelTxt) {
        if (cc.isValid(label)) {
            if (label instanceof cc.RichText) {
                // do nothing
            } else if (label instanceof cc.Node) {
                label = label.getComponent(cc.RichText);
            }
            if (cc.isValid(label)) {
                label.string = labelTxt;
            }
        }
    }

    public static getLabelString(label) {
        if (cc.isValid(label)) {
            if (label instanceof cc.Label) {
                return label.string;
            } else if (label instanceof cc.Node) {
                return label.getComponent(cc.Label).string;
            }
        }
        return "";
    }

    private static initFont() {
        let self = this;
        self.getSourceSansProRegularFont();
        self.getSourceSansProBoldFont();
        self.getSourceSansProSemiBoldFont();
    }

    private static getSourceSansProRegularFont() {
        let self = this;
        self.getFont(CommonDepend.CommonRes.font.ssp_regular, (fontAsset) => {
            self.sourceSansProRegularFont = fontAsset;
        });
    }

    private static getSourceSansProBoldFont() {
        let self = this;
        self.getFont(CommonDepend.CommonRes.font.ssp_regular, (fontAsset) => {
            self.sourceSansProBoldFont = fontAsset;
        });
    }

    private static getSourceSansProSemiBoldFont() {
        let self = this;
        self.getFont(CommonDepend.CommonRes.font.ssp_regular, (fontAsset) => {
            self.sourceSansProSemiBoldFont = fontAsset;
        });
    }

    public static setFont(label, font, spacingX?) {
        if (cc.isValid(label)) {
            if (label instanceof cc.Label) {
                // do nothing
            } else if (label instanceof cc.Node) {
                label = label.getComponent(cc.Label);
            }
            if (cc.isValid(label)) {
                label.font = font;
                if (spacingX || spacingX == 0) {
                    label.spacingX = spacingX;
                }
            }
        }
    }

    public static getFont(path, callback?) {
        cc.loader.loadRes(path, cc.Font, function (err, fontAsset) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            if (fontAsset) {
                if (typeof callback === 'function') {
                    callback(fontAsset);
                }
            }
        });
    }

    public static loadFont(label, path, spacingX?, callback?) {
        cc.loader.loadRes(path, cc.Font, function (err, fontAsset) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            if (cc.isValid(label)) {
                if (label instanceof cc.Label) {
                    // do nothing
                } else if (label instanceof cc.Node) {
                    label = label.getComponent(cc.Label);
                }
                if (cc.isValid(label)) {
                    label.font = fontAsset;
                    if (spacingX || spacingX == 0) {
                        label.spacingX = spacingX;
                    }
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            }
        });
    }

}

export default LabelManager;