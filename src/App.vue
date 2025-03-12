<script setup lang="ts">
import { setThemeColor } from "./util/setTheme";

onMounted(() => {
  setThemeColor("#08bf61", "#129611");
});
</script>

<template>
  <div>
    <RouterView></RouterView>
  </div>
</template>

<style scoped></style>
