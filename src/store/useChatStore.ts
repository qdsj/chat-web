import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";
import { useFriendStore } from "./useFriendStore";
import { useSocketStore } from "./useSocketStore";
import { useUserStore } from "./useUserStore";
import { Conversation, Message, SocketMessage } from "@/types/model/chat.type";
import { getChatHistoryApi } from "@/apis/chat";

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

    const getChatHistory = async (roomId: string) => {
      try {
        const res = await getChatHistoryApi({ roomId });
        return [null, res.data] as any;
      } catch (error) {
        return [error, null] as any;
      }
    };

    const getChatHistoryByRoomId = async (roomId: string) => {
      const targetGroup = conversationsList.value.find(
        (obj) => obj.id === roomId
      );
      if (targetGroup && targetGroup.messages.length == 0) {
        const [_, result] = await getChatHistory(roomId);
        targetGroup!.messages = result.flat(2).reverse();
      }
    };

    // 设置当前会话
    const setCurrentConversation = async (conversationId: string) => {
      const targetConversation = conversationsList.value.find(
        (conv) => conv.id === conversationId
      );
      await getChatHistoryByRoomId(conversationId);
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
        // targetConversation.messages ??= [];
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

    // 通用会话处理逻辑
    const handleConversation = (params: {
      id: string;
      name: string;
      avatar?: string;
    }) => {
      // 检查是否是否在会话列表中
      const conversation = conversationsList.value.filter((item) => {
        return item.id === params.id;
      });

      // 如果不存在，则添加到会话列表中
      if (conversation.length == 0) {
        addConversation({
          id: params.id,
          name: params.name,
          avatar: params.avatar || "",
          messages: [],
        });
      }
      setCurrentConversation(params.id);
    };

    const createMessage = (params: {
      senderId: string;
      receiverId: string;
      content: string;
      msgType: string;
    }): Message => {
      const { senderId, receiverId, content, msgType = "text" } = params;
      return {
        id: uuidv4(),
        roomId: currentConversation.value!.id,
        senderId,
        receiverId,
        content,
        createAt: Date.now().toString(), // 时间戳
        msgType,
      };
    };

    const sendMessage = (params: {
      senderId?: string;
      receiverId?: string;
      content: string;
      msgType?: string;
      conversationId?: string;
    }) => {
      const {
        senderId = userStore.userInfo!.id,
        receiverId = currentConversation.value!.id,
        conversationId = currentConversation.value!.id,
        msgType = "text",
        content,
      } = params;

      const message = createMessage({
        senderId,
        receiverId,
        content,
        msgType,
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
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.msg,
        msgType: message.msgType,
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
      }
      // 设置当前会话对象，并追加聊天记录
      setCurrentConversation(message.senderId);
      appendMessageToConversation(message.senderId, _message);
    };

    return {
      getChatHistory,
      conversationsList,
      currentConversation,
      setCurrentConversation,
      appendMessageToConversation,
      addConversation,
      appendMessageToCurrentConversation,
      handleConversation,
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
