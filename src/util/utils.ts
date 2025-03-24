import moment from "moment";
const formatTime = (timestamp: number) => {
  const timestampTime = moment(timestamp);
  const days =
    Number.parseInt(moment().format("YYYYMMDD")) -
    Number.parseInt(timestampTime.format("YYYYMMDD"));
  if (days === 0) {
    return timestampTime.format("HH:mm");
  } else if (days === 1) {
    return "昨天" + timestampTime.format("HH:mm");
  } else if (days >= 2 && days <= 7) {
    //大于1天小于7天显示星期几
    return timestampTime.format("dddd") + timestampTime.format("HH:mm");
  } else if (days > 7) {
    // 显示年月日
    return timestampTime.format("YY/MM/DD") + timestampTime.format("HH:mm");
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

export { formatTime, isEmpty, getAreaInfo };
