<script setup lang="ts">
	import { useUserStore } from "./store/useUserStore";
	import { setThemeColor } from "./util/setTheme";
	import { useSocketStore } from "./store/useSocketStore";
	import { useFriendStore } from "./store/useFriendStore";
	import { useGroupStore } from "./store/userGroupStore";
	const userStore = useUserStore();
	const friendStore = useFriendStore();
	const groupStore = useGroupStore();
	const socketStore = useSocketStore();
	onMounted(async () => {
		setThemeColor("#08bf61", "#129611");
		// app initial
		await userStore.getUserInfo();
		friendStore.getBlackList(); // 获取拉黑列表
		friendStore.getAllFriend(); // 请求好友列表
		groupStore.getGroupChatList(); // 请求群聊列表
		socketStore.socketInitial();

		// test git push
	});
</script>

<template>
	<div>
		<RouterView></RouterView>
	</div>
</template>

<style scoped></style>
