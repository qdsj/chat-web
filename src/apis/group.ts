import { postFetch } from "./http";
import {
  I_AddGroupMemberApiResult,
  I_CreateGroupChatApiResult,
  I_GetGroupListApiResult,
  I_GetGroupMemberCountApiResult,
  I_GetGroupMemberInfoApiResult,
  I_UpdateGroupChatInfoApiResult,
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

// 修改群聊信息
export const updateGroupChatInfoApi = (data: {
  roomId: string;
  description: string;
  type: string;
}): Promise<I_UpdateGroupChatInfoApiResult> => {
  return postFetch("/chat/updateGroupChatInfo", data);
};

// 获取群成员信息
export const getGroupMemberInfoApi = (data: {
  roomId: string;
  type: string;
}): Promise<I_GetGroupMemberInfoApiResult> => {
  return postFetch("/chat/getGroupMemberInfo", data);
};

// 获取群成员数量
export const getGroupMemberCountApi = (data: {
  roomId: string;
  type: string;
}): Promise<I_GetGroupMemberCountApiResult> => {
  return postFetch("/chat/getGroupMemberCount", data);
};

// 添加群成员
export const addGroupMemberApi = (data: {
  roomId: string;
  userId: string[];
  type: string;
}): Promise<I_AddGroupMemberApiResult> => {
  return postFetch("/chat/addGroupMember", data);
};
