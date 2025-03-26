<script setup lang="ts">
import { useUserStore } from "./store/useUserStore";
import { setThemeColor } from "./util/setTheme";
import { useSocketStore } from "./store/useSocketStore";
const userStore = useUserStore();
const socketStore = useSocketStore();
onMounted(async () => {
  setThemeColor("#08bf61", "#129611");
  // app initial
  await userStore.getUserInfo();
  socketStore.socketInitial();
});
</script>

<template>
  <div>
    <RouterView></RouterView>
  </div>
</template>

<style scoped></style>
