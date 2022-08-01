import GameManager from "./GameManager";

class User {

    public id: number;
    public name: string;
    public coin: number;
    public avatar: number;

    //以下属性跟游戏控制相关
    public life: number;      //现有生命值
    public isWinner: boolean; //是否赢家
    public gesture: number;    //出拳
    public winCount: number  //赢的局数

}

export default User;