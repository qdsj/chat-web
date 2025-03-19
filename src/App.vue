<script setup lang="ts">
import { useUserStore } from "./store/useUserStore";
import { useFriendStore } from "./store/useFriendStore";
import { setThemeColor } from "./util/setTheme";
const userStore = useUserStore();
const friendStore = useFriendStore();

onMounted(() => {
  // get user info
  userStore.getUserInfo();
  friendStore.getAllFriend();
  setThemeColor("#08bf61", "#129611");
});
</script>

<template>
  <div>
    <RouterView></RouterView>
  </div>
</template>

<style scoped></style>
