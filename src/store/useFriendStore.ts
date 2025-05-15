import {
	addFriendApi,
	agreeFriendApi,
	blockFriendApi,
	findUserByNameApi,
	getBlockListApi,
	getFriendListApi,
	getRequestListApi,
	unblockFriendApi,
} from "@/apis/friend";
import {
	I_AgreeFriendApiResult,
	I_FindUserByNameApiResult,
	I_GetRequestListApiResult,
} from "@/apis/types/friend.types";
import { T_Friend } from "@/types/model/friend.types";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import { useGroupStore } from "./userGroupStore";
// 具体和api交互的代码，统一放在store中。
// vue文件只需要考虑和store进行交互即可

export const useFriendStore = defineStore(
	"use-friend-store",
	() => {
		const groupStore = useGroupStore();
		const friendList = ref<T_Friend[]>([]);
		const blockList = ref<T_Friend[]>([]);

		const isSearching = ref(false);
		const searchValue = ref("");
		// 搜索中的好友群聊列表
		const searchGroupFriendList = ref<T_Friend[]>([]);
		const isSearchingGroupFriend = ref(false);

		const getFriendById = async (id: string, tryAgain = true) => {
			const friend = friendList.value.find((friend) => friend.id === id);
			if (friend) return friend;
			const blockFriend = blockList.value.find((blockFriend) => blockFriend.id === id);
			if (blockFriend) return blockFriend;
			if (!tryAgain) return null;
			// 如果没有找到，可能刚刚同意的好友，所以需要再刷新好友列表
			await getAllFriend();
			return getFriendById(id, false); // 第二遍获取的时候，就不需要再尝试了
		};

		// 获取所有好友列表
		const getAllFriend = async () => {
			const list = await getFriendListApi();
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

		// 获取请求列表
		const getRequestList = async (): Promise<[string | null, I_GetRequestListApiResult["data"]]> => {
			try {
				const res = await getRequestListApi();
				return [null, res.data] as any;
			} catch (error) {
				ElMessage.warning(error || "获取好友申请列表失败");
				return [error, null] as any;
			}
		};

		// 获取拉黑列表
		const getBlackList = async () => {
			const list = await getBlockListApi();
			blockList.value = list.data;
		};

		// 同意好友请求
		const agreeFriend = async (
			friendId: string
		): Promise<[string | null, I_AgreeFriendApiResult["data"] | null]> => {
			try {
				const res = await agreeFriendApi({ friendId });
				await getAllFriend();
				return [null, res.data];
			} catch (error) {
				ElMessage.warning(error || "获取好友申请列表失败");
				return [error, null] as any;
			}
		};

		// 拉黑好友
		const blockFriend = async (friendId: string) => {
			try {
				const res = await blockFriendApi({ friendId });
				ElMessage.success(res.message);
				return [null, res.data] as any;
			} catch (error) {
				ElMessage.warning(error || "拉黑好友失败");
				return [error, null] as any;
			}
		};

		// 恢复好友关系
		const unblockFriend = async (friendId: string) => {
			try {
				const res = await unblockFriendApi({ friendId });
				ElMessage.success(res.message);
			} catch (error) {
				ElMessage.warning(error || "拉黑好友失败");
			}
		};

		const searchFriend = (value: string) => {
			if (value.trim() === "") {
				isSearching.value = false;
				return;
			}
			isSearching.value = true;
			searchValue.value = value;
		};

		const searchResult = computed(() => {
			if (isSearching.value) {
				// 根据value搜索好友
				const friends = friendList.value.filter((friend) => {
					return friend.username.toLowerCase().includes(searchValue.value.toLowerCase());
				});
				// 根据value搜索群名
				const groups = groupStore.groupList.filter((group) => {
					return group.name.toLowerCase().includes(searchValue.value.toLowerCase());
				});

				return {
					searchedFriendList: friends,
					searchedGroupList: groups,
				};
			} else {
				return {
					searchedFriendList: [],
					searchedGroupList: [],
				};
			}
		});
		const searchedFriendList = computed(() => searchResult.value.searchedFriendList);
		const searchedGroupList = computed(() => searchResult.value.searchedGroupList);

		const searchGroupFriend = async (name: string) => {
			if (typeof name !== "string") return;
			if (!name.trim()) {
				isSearchingGroupFriend.value = false;
				return;
			}
			const session = friendList.value.filter((session) => {
				return session.username.toLowerCase().includes(name.toLowerCase());
			});

			searchGroupFriendList.value = session;
			isSearchingGroupFriend.value = true;
		};

		return {
			friendList,
			isSearching,
			searchedFriendList,
			searchedGroupList,
			isSearchingGroupFriend,
			searchGroupFriendList,
			getAllFriend,
			addFriend,
			searchUserByName,
			getRequestList,
			agreeFriend,
			blockList,
			getBlackList,
			blockFriend,
			unblockFriend,
			getFriendById,
			searchFriend,
			searchGroupFriend,
		};
	},
	{
		persist: {
			storage: localStorage,
		},
	}
);
