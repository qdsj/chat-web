import moment from "moment";

// 工具函数改为全UTC模式
const getCommonTimeInfo = (timestamp: number) => {
  // 核心修复：所有时间计算基于UTC时区
  const timestampTime = moment.utc(timestamp); // ✅ 保持UTC时间
  const now = moment.utc(); // ✅ 使用UTC当前时间

  // 修复关键：基于UTC的自然日计算
  const nowStart = now.clone().startOf("day");
  const timestampStart = timestampTime.clone().startOf("day");
  const days = nowStart.diff(timestampStart, "days");

  // UTC星期数组（0=周日）
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

  return {
    timestampTime,
    weekdays,
    dayNumber: timestampTime.weekday(), // UTC周索引
    days: Math.abs(days),
  };
};

const formatMessageTime = (timestamp: number) => {
  const { timestampTime, weekdays, dayNumber, days } =
    getCommonTimeInfo(timestamp);

  if (days === 0) {
    return timestampTime.format("HH:mm"); // UTC时间直接显示
  } else if (days === 1) {
    return "昨天 " + timestampTime.format("HH:mm");
  } else if (days <= 7) {
    return `星期${weekdays[dayNumber]} ${timestampTime.format("HH:mm")}`;
  } else {
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
