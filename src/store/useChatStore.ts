import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { Conversation, Friend, Message } from "@/util/types";

export const useChatStore = defineStore("chat", () => {
  // 会话列表
  const conversations = ref<Conversation[]>([]);
  // 当前会话对象
  const currentConversation = ref<Conversation | null>(null);
  // 好友列表
  const friends = ref<Friend[]>([]);

  // 初始化会话列表
  const initConversations = (newConversations: Conversation[]) => {
    conversations.value = newConversations;
  };

  // 初始化好友列表
  const initFriends = (newFriends: Friend[]) => {
    friends.value = newFriends;
  };

  // 设置当前会话
  const setCurrentConversation = (conversationId: string) => {
    const targetConversation = conversations.value.find(
      (conv) => conv.id === conversationId
    );
    currentConversation.value = targetConversation || null;
  };

  // 追加聊天记录到指定会话
  const appendMessageToConversation = (
    conversationId: string,
    message: Message
  ) => {
    const targetConversation = conversations.value.find(
      (conv) => conv.id === conversationId
    );
    if (targetConversation) {
      targetConversation.messages.push(message);
      targetConversation.lastMessage = message.content;
      targetConversation.time = message.time;
      if (currentConversation.value?.id === conversationId) {
        currentConversation.value = targetConversation;
      }
    }
  };

  // 追加聊天记录到当前会话
  const appendMessageToCurrentConversation = (message: Message) => {
    const currentConv = currentConversation.value;
    if (!currentConv) {
      console.warn("No current conversation selected.");
      return;
    }
    currentConversation.value!.messages.push(message);
    currentConv.lastMessage = message.content;
    currentConv.time = message.time;
  };

  // 添加新的会话
  const addConversation = (conversation: Conversation) => {
    conversations.value.push(conversation);
  };

  // 添加新的好友
  const addFriend = (friend: Friend) => {
    friends.value.push(friend);
  };

  // 计算属性：获取所有会话
  const allConversations = computed(() => conversations.value);
  // 计算属性：获取当前会话
  const getCurrentConversation = computed(() => currentConversation.value);
  // 计算属性：获取所有好友
  const allFriends = computed(() => friends.value);

  return {
    initConversations,
    initFriends,
    setCurrentConversation,
    appendMessageToConversation,
    addConversation,
    addFriend,
    allConversations,
    getCurrentConversation,
    allFriends,
    appendMessageToCurrentConversation,
  };
});
