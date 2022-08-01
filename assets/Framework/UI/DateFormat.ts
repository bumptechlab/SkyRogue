export default class DateFormat {

    /**
     * 获取某个时间在一年中第几天
     */
    public static getDayInYear(dateTime) {
        const currentYear = new Date().getFullYear().toString();
        // 今天减今年的第一天（xxxx年01月01日）
        const hasTimestamp = new Date(dateTime) - new Date(currentYear);
        // 86400000 = 24 * 60 * 60 * 1000
        let hasDays = Math.ceil(hasTimestamp / 86400000);
        return hasDays;
    }
}