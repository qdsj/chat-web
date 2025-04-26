import { getFetch, postFetch } from "./http.ts";
import {
  I_AddFriendApiResult,
  I_AgreeFriendApiResult,
  I_BlockFriendResultApi,
  I_FindUserByNameApiResult,
  I_GetBlockListResultApi,
  I_GetFriendListApiResult,
  I_GetRequestListApiResult,
  I_UnblockFriendResultApi,
} from "./types/friend.types.ts";

// 通过名字查找用户
export const findUserByNameApi = (
  username: string
): Promise<I_FindUserByNameApiResult> => {
  return getFetch(`/user/findUserByName?username=${username}`);
};

// 添加好友
export const addFriendApi = (data: {
  friendId: string;
  requestMessage: string;
}): Promise<I_AddFriendApiResult> => {
  return postFetch("/user/addFriend", data);
};

// 获取请求列表
export const getRequestListApi = (): Promise<I_GetRequestListApiResult> => {
  return getFetch("/user/getRequestList");
};

// 同意好友申请
export const agreeFriendApi = (data: {
  friendId: string;
}): Promise<I_AgreeFriendApiResult> => {
  return postFetch("/user/agreeFriend", data);
};

// 获取好友列表
export const getFriendListApi = (): Promise<I_GetFriendListApiResult> => {
  return getFetch("/user/getFriendList");
};

// 获取拉黑好友列表
export const getBlockListApi = (): Promise<I_GetBlockListResultApi> => {
  return getFetch("/user/getBlockList");
};

// 拉黑好友
export const blockFriendApi = (data: {
  friendId: string;
}): Promise<I_BlockFriendResultApi> => {
  return postFetch("/user/blockFriend", data);
};

// 恢复好友关系
export const unblockFriendApi = (data: {
  friendId: string;
}): Promise<I_UnblockFriendResultApi> => {
  return postFetch("/user/unblockFriend", data);
};
