import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const userInfo = ref({
    userId: "blue123",
    avatarFile: "",
    nickName: "blue",
    sex: 0,
    joinType: 0,
    area: "",
    personalSignature: "路过的都是风雨，留下的才是彩虹",
    contactType: "USER",
  });

  return {
    userInfo,
  };
});
