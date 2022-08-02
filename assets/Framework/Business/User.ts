import GameManager from "./GameManager";

class User {

    public id: number;         //id
    public name: string;       //名字
    public gender: number;     //性别：0：女，1：男
    public coin: number;       //金币
    public avatar: number;     //头像
    public records: number[];  //每个游戏难度下的最高记录
    public planes: number[];   //解锁的飞机型号

    //以下属性跟游戏控制相关
    public score: number;      //在一局里获得的分数（飞过的距离）

}

export default User;