import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";
import { useFriendStore } from "./useFriendStore";
import { useSocketStore } from "./useSocketStore";
import { useUserStore } from "./useUserStore";
import { Conversation, Message, SocketMessage } from "@/types/model/chat.type";

export const useChatStore = defineStore(
  "chat",
  () => {
    const userStore = useUserStore();
    const socketStore = useSocketStore();
    const friendStore = useFriendStore();
    // 会话列表
    const conversationsList = ref<Conversation[]>([]);
    // 当前会话对象
    const currentConversation = ref<Conversation | null>(null);

    // 初始化会话列表
    const initConversations = (newConversations: Conversation[]) => {
      conversationsList.value = newConversations;
    };

    // 设置当前会话
    const setCurrentConversation = (conversationId: string) => {
      const targetConversation = conversationsList.value.find(
        (conv) => conv.id === conversationId
      );
      currentConversation.value = targetConversation || null;
    };

    // 追加聊天记录到指定会话
    const appendMessageToConversation = (
      conversationId: string,
      message: Message
    ) => {
      const targetConversation = conversationsList.value.find(
        (conv) => conv.id === conversationId
      );
      if (targetConversation) {
        targetConversation.messages ??= [];
        targetConversation.messages.push(message);
        if (currentConversation.value?.id === conversationId) {
          currentConversation.value = targetConversation;
        }
      }
    };

    // 追加聊天记录到当前会话
    const appendMessageToCurrentConversation = (message: Message) => {
      if (!currentConversation.value) {
        console.warn("No current conversation selected.");
        return;
      }
      // 如果当前会话没有消息列表，则初始化一个空数组
      currentConversation.value!.messages ??= [];
      currentConversation.value!.messages.push(message);
    };

    // 添加新的会话
    const addConversation = (conversation: Conversation) => {
      conversationsList.value.push(conversation);
    };

    const createMessage = (params: {
      sender: string;
      receiver: string;
      content: string;
      type: string;
    }): Message => {
      const { sender, receiver, content, type = "text" } = params;
      return {
        id: uuidv4(),
        sender,
        receiver,
        content,
        time: Date.now().toString(), // 时间戳
        type,
      };
    };

    const sendMessage = (params: {
      sender?: string;
      receiver?: string;
      content: string;
      type?: string;
      conversationId?: string;
    }) => {
      const {
        sender = userStore.userInfo!.id,
        receiver = currentConversation.value!.id,
        conversationId = currentConversation.value!.id,
        type = "text",
        content,
      } = params;

      const message = createMessage({
        sender,
        receiver,
        content,
        type,
      });
      appendMessageToConversation(conversationId, message);

      // told socket
      socketStore.socketSend({
        type: "person",
        roomId: conversationId,
        msg: content,
      });
    };

    // 用来处理接收到的消息
    const addMessage = (message: SocketMessage) => {
      // 发送消息的人是否在会话列表中
      const isSenderInConversations = conversationsList.value.some(
        (conv) => conv.id === message.senderId
      );
      const _message = createMessage({
        sender: message.senderId,
        receiver: message.receiverId,
        content: message.msg,
        type: message.msgType,
      });
      // 如果不在，添加新的会话
      if (!isSenderInConversations) {
        addConversation({
          id: message.senderId,
          name:
            friendStore.getFriendById(message.senderId)?.username || "未知用户",
          avatar: "",
          messages: [_message],
        });
      } else {
        // 如果在，追加消息到对应会话
        appendMessageToConversation(message.senderId, _message);
      }
    };

    return {
      conversationsList,
      currentConversation,
      initConversations,
      setCurrentConversation,
      appendMessageToConversation,
      addConversation,
      appendMessageToCurrentConversation,
      sendMessage,
      addMessage,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
