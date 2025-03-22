import { addFriendApi, findUserByNameApi, getFriendList } from "@/apis/friend";
import { defineStore } from "pinia";
// 具体和api交互的代码，统一放在store中。
// vue文件只需要考虑和store进行交互即可

export const useFriendStore = defineStore(
	"use-friend-store",
	() => {
		const friendList = ref([]);

		const getAllFriend = async () => {
			const list = await getFriendList();
			friendList.value = list.data;
		};

		// 添加新的好友
		const addFriend = async (friendId: string, requestMessage: string) => {
			try {
				await addFriendApi({
					friendId,
					requestMessage,
				});
				return true;
			} catch (error) {
				return false;
			}
		};

		// 搜索好友
		const searchUserByName = async (username: string) => {
			try {
				const res = await findUserByNameApi(username);
				return res.data;
			} catch (error) {
				return null;
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
