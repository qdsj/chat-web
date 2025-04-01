import moment from "moment";

const getCommonTimeInfo = (timestamp: number) => {
  const timestampTime = moment(timestamp);
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const dayNumber = timestampTime.weekday();
  const days =
    Number.parseInt(moment().format("YYYYMMDD")) -
    Number.parseInt(timestampTime.format("YYYYMMDD"));
  return { timestampTime, weekdays, dayNumber, days };
};

const formatMessageTime = (timestamp: number) => {
  const { timestampTime, weekdays, dayNumber, days } =
    getCommonTimeInfo(timestamp);
  if (days === 0) {
    return timestampTime.format("HH:mm");
  } else if (days === 1) {
    return "昨天" + timestampTime.format("HH:mm");
  } else if (days >= 2 && days <= 7) {
    return `星期${weekdays[dayNumber]} ${timestampTime.format("HH:mm")}`;
  } else if (days > 7) {
    return timestampTime.format("YYYY年MM月DD日 HH:mm");
  }
};

const formatChatTime = (timestamp: number) => {
  const { timestampTime, weekdays, dayNumber, days } =
    getCommonTimeInfo(timestamp);
  if (days === 0) {
    return timestampTime.format("HH:mm");
  } else if (days === 1) {
    return "昨天";
  } else if (days >= 2 && days <= 7) {
    return `星期${weekdays[dayNumber]}`;
  } else if (days > 7) {
    return timestampTime.format("YY/MM/DD");
  }
};

const isEmpty = (str: string) => {
  if (str == null || str == "" || str == undefined) {
    return true;
  }
  return false;
};

const getAreaInfo = (data: string) => {
  if (isEmpty(data)) {
    return "-";
  }
  return data.replace(",", " ");
};

export { formatMessageTime, formatChatTime, isEmpty, getAreaInfo };
