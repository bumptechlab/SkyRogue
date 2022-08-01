import LocalStorageMgr from "../Utils/LocalStorageMgr";
import DateFormat from "../UI/DateFormat";

export default class CheckinManager {

    public static DAY_REWARDS = [100, 200, 300, 400, 500, 600, 700];

    public static checkin(day: number) {
        let success = false;
        let lastCheckinDay = LocalStorageMgr.getLastCheckinDay();
        let checkinState = LocalStorageMgr.getCheckinState();
        if (day <= lastCheckinDay || day > checkinState.length) {
            return success;
        }
        LocalStorageMgr.saveLastCheckinDate(new Date().getTime());
        LocalStorageMgr.saveLastCheckinDay(day);
        this.getCheckinState();
        success = true;
        return success;
    }


    public static canCheckinToday() {
        let lastCheckinDate = LocalStorageMgr.getLastCheckinDate();
        let lastCheckinDayInYear = DateFormat.getDayInYear(lastCheckinDate);
        let now = new Date();
        let nowDayInYear = DateFormat.getDayInYear(now.getTime());
        console.log("lastCheckinDayInYear=%s, nowDayInYear=%s", lastCheckinDayInYear, nowDayInYear);
        let canCheckin = false;
        if (nowDayInYear > lastCheckinDayInYear) {
            canCheckin = true;
        }
        return canCheckin;
    }

    public static getCheckinState() {
        let checkinState = LocalStorageMgr.getCheckinState();

        let lastCheckinDay = LocalStorageMgr.getLastCheckinDay();
        let lastCheckinDayIndex = lastCheckinDay - 1;
        for (let i = 0; i < checkinState.length; i++) {
            if (i <= lastCheckinDayIndex) {
                checkinState[i].checked = true;
                checkinState[i].canCheck = false;
            } else if (i == (lastCheckinDayIndex + 1) && this.canCheckinToday()) {//今天还未签到
                checkinState[i].checked = false;
                checkinState[i].canCheck = true;
            } else {
                checkinState[i].checked = false;
                checkinState[i].canCheck = false;
            }
        }

        LocalStorageMgr.saveCheckinState(checkinState);
        return checkinState;
    }

    public static initCheckinState(days: number = 7) {
        let checkinState = LocalStorageMgr.getCheckinState();
        if (!checkinState) {
            checkinState = [];
            for (let i = 0; i < days; i++) {
                let reward = this.DAY_REWARDS[i];
                if (!reward) {
                    reward = 100;
                }
                checkinState[i] = {
                    checked: false, //是否已经签到过
                    canCheck: false, //未签到的情况下，是否可以签到
                    reward: reward, //每天的奖励
                }
            }
            LocalStorageMgr.saveCheckinState(checkinState);
        }
        return checkinState;
    }
}