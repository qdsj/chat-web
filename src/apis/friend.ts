import { getFetch, postFetch } from "./http.ts";
import {
	I_AddFriendApiResult,
	I_AgreeFriendApiResult,
	I_FindUserByNameApiResult,
	I_GetFriendListApiResult,
	I_GetRequestListApiResult,
} from "./types/friend.types.ts";

// 通过名字查找用户
export const findUserByNameApi = (username: string): Promise<I_FindUserByNameApiResult> => {
	return getFetch(`/user/findUserByName?username=${username}`);
};

// 添加好友
export const addFriendApi = (data: { friendId: string; requestMessage: string }): Promise<I_AddFriendApiResult> => {
	return postFetch("/user/addFriend", data);
};

// 获取请求列表
export const getRequestList = (): Promise<I_GetRequestListApiResult> => {
	return getFetch("/user/getRequestList");
};

// 同意好友申请
export const agreeFriend = (data: Object): Promise<I_AgreeFriendApiResult> => {
	return postFetch("/user/agreeFriend", data);
};

// 获取好友列表
export const getFriendList = (): Promise<I_GetFriendListApiResult> => {
	return getFetch("/user/getFriendList");
};

// 拉黑好友
export const blockFriend = (data: Object) => {
	return postFetch("/user/blockFriend", data);
};

// 恢复好友关系
export const unblockFriend = (data: object) => {
	return postFetch("/user/unblockFriend", data);
};
