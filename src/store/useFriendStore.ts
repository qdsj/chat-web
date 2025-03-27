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
  I_FindUserByNameApiResult,
  I_GetRequestListApiResult,
} from "@/apis/types/friend.types";
import { T_Friend } from "@/types/model/friend.types";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import { useChatStore } from "./useChatStore";
import { useRouter } from "vue-router";
// 具体和api交互的代码，统一放在store中。
// vue文件只需要考虑和store进行交互即可

export const useFriendStore = defineStore(
  "use-friend-store",
  () => {
    const chatStore = useChatStore();
    const router = useRouter();
    const friendList = ref<T_Friend[]>([]);
    const blockList = ref<T_Friend[]>([]);

    // 获取所有好友列表
    const getAllFriend = async () => {
      const list = await getFriendListApi();
      friendList.value = list.data;
    };

    // 添加新的好友
    const addFriend = async (
      friendId: string,
      requestMessage: string
    ): Promise<[string | null, boolean]> => {
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
    const getRequestList = async (): Promise<
      [string | null, I_GetRequestListApiResult["data"]]
    > => {
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
    const agreeFriend = async (friendId: string) => {
      try {
        const res = await agreeFriendApi({ friendId });
        // 将好友加进会话列表
        chatStore.addConversation({
          id: res.data.id,
          name: res.data.username,
          avatar: "",
          messages: [],
        });
        // 跳转至会话列表，开始聊天
        router.push("/chat");
      } catch (error) {
        ElMessage.warning(error || "获取好友申请列表失败");
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

    const getFriendById = (id: string) => {
      const friend = friendList.value.find((friend) => friend.id === id);
      if (friend) return friend;
      return blockList.value.find((blockFriend) => blockFriend.id === id);
    };

    return {
      friendList,
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
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
