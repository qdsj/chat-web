import { postFetch } from "./http";
import {
  I_AddGroupMemberApiResult,
  I_CancelGroupAdminApiResult,
  I_CreateGroupChatApiResult,
  I_DissolveGroupApiResult,
  I_GetGroupListApiResult,
  I_GetGroupMemberCountApiResult,
  I_GetGroupMemberInfoApiResult,
  I_KickMemberApiResult,
  I_QuitGroupApiResult,
  I_SetGroupAdminApiResult,
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
  avatar: string;
  name: string;
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

// 群主踢除人
export const kickMemberApi = (data: {
  roomId: string;
  userId: string;
  type: string;
}): Promise<I_KickMemberApiResult> => {
  return postFetch("/chat/kickMember", data);
};

// 群成员退出群聊
export const quitGroupApi = (data: {
  roomId: string;
  type: string;
}): Promise<I_QuitGroupApiResult> => {
  return postFetch("/chat/quitGroup", data);
};

// 群主解散群聊
export const dissolveGroupApi = (data: {
  roomId: string;
  type: string;
}): Promise<I_DissolveGroupApiResult> => {
  return postFetch("/chat/dissolveGroup", data);
};

// 群主设置群管理员
export const setGroupAdminApi = (data: {
  roomId: string;
  type: string;
  userId: string;
}): Promise<I_SetGroupAdminApiResult> => {
  return postFetch("/chat/setGroupAdmin", data);
};

// 群主取消群管理员
export const cancelGroupAdminApi = (data: {
  roomId: string;
  type: string;
  userId: string;
}): Promise<I_CancelGroupAdminApiResult> => {
  return postFetch("/chat/cancelGroupAdmin", data);
};
