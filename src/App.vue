<script setup lang="ts">
import { useUserStore } from "./store/useUserStore";
import { useFriendStore } from "./store/useFriendStore";
import { setThemeColor } from "./util/setTheme";
import { useSocketStore } from "./store/useSocketStore";
const userStore = useUserStore();
const friendStore = useFriendStore();
const socketStore = useSocketStore();
onMounted(async () => {
	setThemeColor("#08bf61", "#129611");
	// app initial
	await userStore.getUserInfo();
	await friendStore.getAllFriend();
	socketStore.socketInitial();
});
</script>

<template>
	<div>
		<RouterView></RouterView>
	</div>
</template>

<style scoped></style>
