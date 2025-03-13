<script setup lang="ts">
import { useUserInfoStore } from "./store/useUserInfo.store";
import { setThemeColor } from "./util/setTheme";
const userInfoStore = useUserInfoStore();
onMounted(() => {
	// get user info
	userInfoStore.getUserInfo();
	setThemeColor("#08bf61", "#129611");
});
</script>

<template>
	<div>
		<RouterView></RouterView>
	</div>
</template>

<style scoped></style>
