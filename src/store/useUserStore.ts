import { fetchUpdateUserInfo, fetchUserInfo } from "@/apis/auth";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";

export const useUserStore = defineStore(
  "user-info-store",
  () => {
    const userInfo = ref<null | {
      id: string;
      username: string;
      email: string;
      avatar: string;
      sex: string;
      description: string;
    }>(null);

    const getUserInfo = async () => {
      const info = await fetchUserInfo();
      userInfo.value = info;
    };

    const updateUserInfo = async (
      avatar: string,
      sex: string,
      description: string
    ) => {
      try {
        const res = await fetchUpdateUserInfo({ avatar, sex, description });
        ElMessage.success(res.data);
        return [null, res.data];
      } catch (error) {
        ElMessage.warning(error || "更新消息失败");
        return [error, null];
      }
    };

    return {
      userInfo,
      getUserInfo,
      updateUserInfo,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
