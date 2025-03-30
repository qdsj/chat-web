import {
  createGroupChatApi,
  getGroupChatListApi,
  getGroupMemberInfoApi,
  updateGroupChatInfoApi,
} from "@/apis/group";
import {
  I_CreateGroupChatApiResult,
  I_GetGroupMemberInfoApiResult,
} from "@/apis/types/group.type";
import { T_GroupList } from "@/types/model/group.type";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";

export const useGroupStore = defineStore(
  "use-group-store",
  () => {
    const groupList = ref<T_GroupList[]>([]);

    const getGroupById = (id: string) => {
      return groupList.value.find((group) => group.id === id);
    };

    const createGroupChat = async (
      data: string[]
    ): Promise<I_CreateGroupChatApiResult["data"]> => {
      const result = await createGroupChatApi({ userId: data });
      return result.data;
    };

    const getGroupChatList = async () => {
      const result = await getGroupChatListApi();
      groupList.value = result.data;
    };

    const updateGroupChatInfo = async (
      roomId: string,
      description: string,
      type: string
    ) => {
      try {
        const result = await updateGroupChatInfoApi({
          roomId,
          description,
          type,
        });
        ElMessage.success(result.message);
        return [null, result.status];
      } catch (error) {
        ElMessage.warning(error || "更新群聊消息失败");
        return [error, false] as any;
      }
    };

    const getGroupMemberInfo = async (
      roomId: string,
      type: string
    ): Promise<[string | null, I_GetGroupMemberInfoApiResult["data"]]> => {
      try {
        const result = await getGroupMemberInfoApi({ roomId, type });
        return [null, result.data];
      } catch (error) {
        return [error, false] as any;
      }
    };

    return {
      groupList,
      getGroupById,
      createGroupChat,
      getGroupChatList,
      updateGroupChatInfo,
      getGroupMemberInfo,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
