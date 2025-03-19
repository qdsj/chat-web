import { fetchUserInfo } from "@/apis/auth";
import { defineStore } from "pinia";

export const useUserStore = defineStore(
  "user-info-store",
  () => {
    const userInfo = ref<null | {
      id: string;
      username: string;
      email: string;
    }>(null);

    const getUserInfo = async () => {
      const info = await fetchUserInfo();
      userInfo.value = info;
    };

    return {
      userInfo,
      getUserInfo,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
