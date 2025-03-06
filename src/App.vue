<script setup lang="ts">
import { setThemeColor } from "./util/setTheme";

onMounted(() => {
  setThemeColor("green");
});
</script>

<template>
  <div>
    <RouterView></RouterView>
  </div>
</template>

<style scoped></style>
