import { addFriendApi, findUserByNameApi, getFriendList, I_FindUserByNameApiResult } from "@/apis/friend";
import { T_User } from "@/types/model/friend.types";
import { defineStore } from "pinia";
// 具体和api交互的代码，统一放在store中。
// vue文件只需要考虑和store进行交互即可

export const useFriendStore = defineStore(
	"use-friend-store",
	() => {
		const friendList = ref<T_User[]>([]);

		const getAllFriend = async () => {
			const list = await getFriendList();
			friendList.value = list.data;
		};

		// 添加新的好友
		const addFriend = async (friendId: string, requestMessage: string): Promise<[string | null, boolean]> => {
			try {
				await addFriendApi({
					friendId,
					requestMessage,
				});
				return [null, true];
			} catch (error) {
				return [error, false] as any;
			}
		};

		// 搜索好友
		const searchUserByName = async (
			username: string
		): Promise<[string | null, I_FindUserByNameApiResult["data"]]> => {
			try {
				const res = await findUserByNameApi(username);

				// []表示返回两个值，第一个是error，第二个是data
				return [null, res.data] as any;
			} catch (error) {
				return [error, null] as any;
			}
		};

		return {
			friendList,
			getAllFriend,
			addFriend,
			searchUserByName,
		};
	},
	{
		persist: {
			storage: localStorage,
		},
	}
);
