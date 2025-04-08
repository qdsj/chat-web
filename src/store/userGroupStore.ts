import {
  addGroupMemberApi,
  createGroupChatApi,
  getGroupChatListApi,
  getGroupMemberCountApi,
  getGroupMemberInfoApi,
  updateGroupChatInfoApi,
} from "@/apis/group";
import {
  I_AddGroupMemberApiResult,
  I_CreateGroupChatApiResult,
  I_GetGroupMemberCountApiResult,
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
      userId: string[]
    ): Promise<I_CreateGroupChatApiResult["data"]> => {
      const result = await createGroupChatApi({ userId: userId });
      return result.data;
    };

    const addGroupMember = async (
      roomId: string,
      userId: string[],
      type: string
    ): Promise<I_AddGroupMemberApiResult["data"]> => {
      try {
        const res = await addGroupMemberApi({ roomId, userId, type });
        ElMessage.success(res.message);
        return [null, true] as any;
      } catch (error) {
        ElMessage.warning(error || "添加群成员失败");
        return [error, false] as any;
      }
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

    const getGroupMemberByList = async (
      roomId: string,
      type: string
    ): Promise<
      [string | null, I_GetGroupMemberInfoApiResult["data"] | null]
    > => {
      const group = groupList.value.find(
        (item) => item.id === roomId && item.type === "group"
      );
      if (!group) {
        return ["targetGroup is null", null] as any;
      }
      try {
        const result = await getGroupMemberInfoApi({ roomId, type });
        group.member = result.data;
        return [null, result.data];
      } catch (error) {
        return [error, null] as any;
      }
    };

    const getGroupMemberCountByList = async (
      roomId: string,
      type: string
    ): Promise<
      [string | null, I_GetGroupMemberCountApiResult["data"] | null]
    > => {
      const targetGroup = groupList.value.find(
        (obj) => obj.id === roomId && obj.type === type
      );
      if (!targetGroup) {
        return ["targetGroup is null", null] as any;
      }

      if (targetGroup.memberCount === undefined) {
        try {
          const result = await getGroupMemberCountApi({ roomId, type });
          targetGroup.memberCount = result.data;
          return [null, result.data];
        } catch (error) {
          return [error, null] as any;
        }
      }

      return [null, targetGroup.memberCount] as any;
    };

    return {
      groupList,
      getGroupById,
      createGroupChat,
      getGroupChatList,
      updateGroupChatInfo,
      getGroupMemberByList,
      getGroupMemberCountByList,
      addGroupMember,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
