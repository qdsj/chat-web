<script setup lang="ts">
import { useChatStore } from "@/store/useChatStore";
import ChatSession from "./ChatSession.vue";

import ContextMenu from "./components/ContextMenu.vue";
import { ElMessageBox } from "element-plus";
import { Conversation } from "@/types/model/chat.type";

interface MenuItem {
  label: string;
  action: () => void;
}

const getMenuItems = (item: Conversation) => [
  {
    label: "删除会话",
    action: () => {
      // 先关闭菜单再弹出确认框
      closeContextMenu();
      ElMessageBox.confirm("确定删除该会话吗？", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await chatStore.deleteSession({
          roomId: item.id,
          type: item.type,
        });
        await chatStore.getSessionList();
        chatStore.currentConversation = null;
      });
    },
  },
];

const chatStore = useChatStore();

// 新增右键菜单相关状态
const contextMenuVisible = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });

// 新增状态
const currentMenuItems = ref<MenuItem[]>([]);

const handleRightClick = (event: MouseEvent, item: Conversation) => {
  event.preventDefault();
  contextMenuPosition.value = { x: event.clientX, y: event.clientY };
  currentMenuItems.value = getMenuItems(item); // 更新当前菜单项
  contextMenuVisible.value = true;
};

// 关闭菜单
const closeContextMenu = () => {
  contextMenuVisible.value = false;
};

// 点击会话
const chatSessionClickHandle = (conversationId: string) => {
  chatStore.setCurrentConversation(conversationId);
};
</script>

<template>
  <!-- 会话列表循环 -->
  <div v-for="item in chatStore.conversationsList" :key="item.id">
    <div
      @contextmenu.prevent="(e) => handleRightClick(e, item)"
      :class="{ active: chatStore.currentConversation?.id === item.id }"
    >
      <ChatSession
        :data="item"
        :avatar="item.avatar"
        @click="chatSessionClickHandle(item.id)"
      />
    </div>
  </div>

  <!-- 全局右键菜单（仅一个实例） -->
  <ContextMenu
    :menu-items="currentMenuItems"
    :position="contextMenuPosition"
    :visible="contextMenuVisible"
    @update:visible="closeContextMenu"
  />
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
