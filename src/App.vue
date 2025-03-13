<script setup lang="ts">
import { useUserInfoStore } from "./store/useUserInfo.store";
import { setThemeColor } from "./util/setTheme";
const userInfoStore = useUserInfoStore();
onMounted(() => {
	setThemeColor("green");

	// get user info
	userInfoStore.getUserInfo();
});
</script>

<template>
	<div>
		<RouterView></RouterView>
	</div>
</template>

<style scoped></style>
