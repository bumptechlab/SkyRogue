import ResManager from "../Resources/ResManager";
import LocalStorageMgr from "../Utils/LocalStorageMgr";
import User from "./User";
import GameManager from "./GameManager";
import CommonEventName from "../Base/CommonEventName";

class UserManager {


    private static userNames = ["Sam", "Barney", "Lili", "Kate", "Katherine", "James", "Bob", "Carl"];
    private static INIT_COIN = 1000;
    private static currentUser: User = null;

    public static createRandomUser(randomCoin?): User {
        let user = new User();
        let id = 10000 + parseInt((Math.random() * 10000).toString());//10000 - 19999
        let randomNameIndex = Math.random() * this.userNames.length;
        let name = this.userNames[parseInt(randomNameIndex.toString())];
        let avatarIndex = parseInt((Math.random() * ResManager.common.texture.userAvatars.length).toString());
        let coin = this.INIT_COIN;
        if (randomCoin) {
            coin = parseInt((Math.random() * this.INIT_COIN * 10).toString());
        }
        user.id = id;
        user.name = name;
        user.coin = coin;
        user.avatar = avatarIndex;
        user.life = 0;
        user.isWinner = false;
        user.gesture = GameManager.GESTURE.NONE;
        user.winCount = 0;
        return user;
    }

    public static initLoginUser(): User {
        this.currentUser = LocalStorageMgr.getLoginUser();
        return this.currentUser;
    }

    public static guestLogin(): User {
        this.currentUser = LocalStorageMgr.getLoginUser();
        if (!this.currentUser) {
            this.currentUser = this.createRandomUser();
            LocalStorageMgr.saveLoginUser(this.currentUser);
        }
        return this.currentUser;
    }

    public static getLoginUser(): User {
        return this.currentUser;
    }

    public static updateUserCoin(coin: number) {
        if (this.currentUser) {
            this.currentUser.coin = coin;
            LocalStorageMgr.saveLoginUser(this.currentUser);
            cc.director.emit(CommonEventName.EVENT_REFRESH_USER_INFO);
        }
    }

}

export default UserManager