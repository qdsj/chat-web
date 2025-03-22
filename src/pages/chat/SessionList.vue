<script setup lang="ts">
import { useChatStore } from "@/store/useChatStore";
import ChatSession from "./ChatSession.vue";

const chatStore = useChatStore();

// 点击会话
const chatSessionClickHandle = (conversationId: string) => {
	chatStore.setCurrentConversation(conversationId);
};
</script>

<template>
	<template v-for="item in chatStore.conversationsList" :key="item.id">
		<ChatSession
			:currentSession="chatStore.currentConversation?.id === item.id"
			:data="item"
			@click="chatSessionClickHandle(item.id)"></ChatSession>
	</template>
</template>

<style scoped lang="scss">
.chat-session-list {
	overflow-y: auto;
	.chat-session {
		cursor: pointer;
		&:hover {
			background-color: #f0f0f0;
		}
	}
}
</style>
