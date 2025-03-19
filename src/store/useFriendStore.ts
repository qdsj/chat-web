import { getFriendList } from "@/apis/friend";
import { defineStore } from "pinia";

export const useFriendStore = defineStore(
  "use-friend-store",
  () => {
    const friendList = ref([]);

    const getAllFriend = async () => {
      const list = await getFriendList();
      friendList.value = list.data;
    };

    return {
      friendList,
      getAllFriend,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
