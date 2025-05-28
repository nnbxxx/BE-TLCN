import { TYPE_TIME_FILTER } from 'src/constants/schema.enum';

export function getTimeRangeFromDate(
    type: TYPE_TIME_FILTER,
    to: Date = new Date()
): { from: Date; to: Date } {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999); // về cuối ngày
    const from = new Date(toDate);
    switch (type) {
        case TYPE_TIME_FILTER.DAY:
            from.setDate(from.getDate() - 1);
            break;
        case TYPE_TIME_FILTER.WEEK:
            from.setDate(from.getDate() - 7);
            break;
        case TYPE_TIME_FILTER.MONTH:
            from.setMonth(from.getMonth() - 1);
            break;
        case TYPE_TIME_FILTER.YEAR:
            from.setFullYear(from.getFullYear() - 1);
            break;
        default:
            throw new Error('Invalid time filter type');
    }

    from.setHours(0, 0, 0, 0); // về đầu ngày
    console.log("🚀 ~ from:", from)
    console.log("🚀 ~ to:", to)
    return { from, to: toDate };
}
