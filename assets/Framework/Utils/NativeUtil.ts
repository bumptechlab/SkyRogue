import LocalStorageMgr from "./LocalStorageMgr";
import CommonEventName from "../Base/CommonEventName";

class NativeUtil {

    static nativeClassName;

    static init() {
        this.nativeClassName = LocalStorageMgr.getNativeClassName();
        console.log("设置JavaUtil/OCUtil别名：" + this.nativeClassName);
    }

    static nativeAndroidClassName() {
        let className = "com/util/EngineBridge";
        if (this.nativeClassName) {
            className = this.nativeClassName;
        }
        return className;
    }

    static nativeiOSClasssName() {
        let className = "EngineBridge";
        if (this.nativeClassName) {
            className = this.nativeClassName;
        }
        return className;
    }


    static quitGame() {
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                let className = NativeUtil.nativeAndroidClassName();
                let methodName = "quitGame";
                let methodSignature = "()V";
                jsb.reflection.callStaticMethod(className, methodName, methodSignature);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                let className = NativeUtil.nativeiOSClasssName();
                let methodName = "quitGame";
                jsb.reflection.callStaticMethod(className, methodName);
            }
        } else {
            console.log("quitGame");
        }
    }

    static appleLogin() {
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                let className = NativeUtil.nativeAndroidClassName();
                let methodName = "appleLogin";
                let methodSignature = "()V";
                jsb.reflection.callStaticMethod(className, methodName, methodSignature);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                let className = NativeUtil.nativeiOSClasssName();
                let methodName = "appleLogin";
                jsb.reflection.callStaticMethod(className, methodName);
            }
        } else {
            console.log("appleLogin");
        }
    }

}

export default NativeUtil;

/**
 * Native端返回AppleLogin结果
 * @param state
 * @param data
 */
cc.onAppleLoginResult = function (state, data) {
    console.log("onAppleLoginResult: state=%s, data=%s", state, data);
    let dataJson = {};
    if (data) {
        dataJson = JSON.parse(data);
    }
    cc.director.emit(CommonEventName.EVENT_APPLE_LOGIN_RESULT, state, dataJson);
};