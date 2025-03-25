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
    <div :class="{ active: chatStore.currentConversation?.id === item.id }">
      <ChatSession
        :data="item"
        @click="chatSessionClickHandle(item.id)"
      ></ChatSession>
    </div>
  </template>
</template>

<style scoped lang="scss">
.active {
  background: #f0f0f0;
}
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
