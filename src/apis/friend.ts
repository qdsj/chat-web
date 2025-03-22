import { getFetch, postFetch } from "./http.ts";

// 通过名字查找用户
export const findUserByName = (username: string) => {
	return getFetch(`/user/findUserByName?username=${username}`);
};

// 添加好友
export const addFriendApi = (data: { friendId: string; requestMessage: string }) => {
	return postFetch("/user/addFriend", data);
};

// 获取请求列表
export const getRequestList = () => {
	return getFetch("/user/getRequestList");
};

// 同意好友申请
export const agreeFriend = (data: Object) => {
	return postFetch("/user/agreeFriend", data);
};

// 获取好友列表
export const getFriendList = () => {
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
