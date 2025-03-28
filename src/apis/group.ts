import { postFetch } from "./http";
import {
  I_CreateGroupChatApiResult,
  I_GetGroupListApiResult,
} from "./types/group.type";

// 创建群聊
export const createGroupChatApi = (data: {
  userId: Array<string>;
}): Promise<I_CreateGroupChatApiResult> => {
  return postFetch("/chat/createGroupChat", data);
};

// 获取群聊列表
export const getGroupChatListApi = (): Promise<I_GetGroupListApiResult> => {
  return postFetch("/chat/getGroupList", {});
};
