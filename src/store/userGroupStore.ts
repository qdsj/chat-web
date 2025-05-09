import {
  addGroupMemberApi,
  createGroupChatApi,
  getGroupChatListApi,
  getGroupMemberCountApi,
  getGroupMemberInfoApi,
  kickMemberApi,
  updateGroupChatInfoApi,
} from "@/apis/group";
import {
  I_AddGroupMemberApiResult,
  I_CreateGroupChatApiResult,
  I_GetGroupMemberCountApiResult,
  I_GetGroupMemberInfoApiResult,
  I_KickMemberApiResult,
} from "@/apis/types/group.type";
import { T_GroupList } from "@/types/model/group.type";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";

export const useGroupStore = defineStore(
  "use-group-store",
  () => {
    const groupList = ref<T_GroupList[]>([]);
    const isSearching = ref(false);
    const groupMemberList = ref<I_GetGroupMemberInfoApiResult["data"]>([]);

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

    // 获取群聊列表
    const getGroupChatList = async () => {
      const result = await getGroupChatListApi();
      groupList.value = result.data;
    };

    const updateGroupChatInfo = async (
      avatar: string,
      name: string,
      roomId: string,
      description: string,
      type: string
    ) => {
      try {
        const result = await updateGroupChatInfoApi({
          avatar,
          roomId,
          description,
          type,
          name,
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
        group.memberAvatar = group.member.map((item) => item.avatar);
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

    const searchGroupMember = async (roomId: string, name: string) => {
      if (!name.trim()) {
        isSearching.value = false;
        return;
      }

      const group = groupList.value.find(
        (item) => item.id === roomId && item.type === "group"
      );

      // 群组不存在处理
      if (!group) {
        return ["targetGroup is null", null];
      }

      // 检查群成员数据
      if (!group.member || group.member.length === 0) {
        return ["group members are empty", null];
      }
      const groupMember = group.member.filter((groupMember) => {
        return groupMember.username.toLowerCase().includes(name.toLowerCase());
      });

      groupMemberList.value = groupMember;
      isSearching.value = true;
    };

    // 群组踢除人
    const kickMember = async (
      roomId: string,
      userId: string,
      type: string
    ): Promise<[string | null, I_KickMemberApiResult["data"] | null]> => {
      try {
        const res = await kickMemberApi({ roomId, userId, type });
        ElMessage({
          type: "success",
          message: res.message,
        });
        return [null, res.data];
      } catch (error) {
        return [error, false] as any;
      }
    };

    return {
      groupList,
      isSearching,
      groupMemberList,
      getGroupById,
      createGroupChat,
      getGroupChatList,
      updateGroupChatInfo,
      getGroupMemberByList,
      getGroupMemberCountByList,
      addGroupMember,
      searchGroupMember,
      kickMember,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
