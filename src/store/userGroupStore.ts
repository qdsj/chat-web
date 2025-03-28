import { createGroupChatApi, getGroupChatListApi } from "@/apis/group";
import { I_CreateGroupChatApiResult } from "@/apis/types/group.type";
import { T_GroupList } from "@/types/model/group.type";
import { defineStore } from "pinia";

export const useGroupStore = defineStore(
  "use-group-store",
  () => {
    const groupList = ref<T_GroupList[]>([]);

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

    return {
      groupList,
      createGroupChat,
      getGroupChatList,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
