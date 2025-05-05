<script setup lang="ts">
import { onMounted } from "vue";
import { setThemeColor } from "@/util/setTheme";
const THEME_COLORS = {
  primary: "#08bf61",
  secondary: "#129611",
};

onMounted(() => {
  setThemeColor(THEME_COLORS.primary, THEME_COLORS.secondary);
});
</script>

<template>
  <div>
    <RouterView></RouterView>
  </div>
</template>

<style scoped></style>
