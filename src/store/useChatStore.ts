import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";
import { useFriendStore } from "./useFriendStore";
import { useSocketStore } from "./useSocketStore";
import { useUserStore } from "./useUserStore";
import {
  Conversation,
  ConversationType,
  Message,
  MsgType,
  SocketMessage,
} from "@/types/model/chat.type";
import {
  addSessionApi,
  getGroupChatHistoryApi,
  getSessionListApi,
  getSingleChatHistoryApi,
  updateChatWindowsTimeApi,
} from "@/apis/chat";
import { useGroupStore } from "./userGroupStore";

export const useChatStore = defineStore(
  "chat",
  () => {
    const userStore = useUserStore();
    const socketStore = useSocketStore();
    const friendStore = useFriendStore();
    const groupStore = useGroupStore();
    // 会话列表
    const conversationsList = ref<Conversation[]>([]);
    // 当前会话对象
    const currentConversation = ref<Conversation | null>(null);

    const getSingleChatHistory = async (roomId: string) => {
      try {
        const res = await getSingleChatHistoryApi({ roomId });
        return [null, res.data] as any;
      } catch (error) {
        return [error, null] as any;
      }
    };

    const getGroupChatHistory = async (roomId: string) => {
      try {
        const res = await getGroupChatHistoryApi({ roomId });
        return [null, res.data] as any;
      } catch (error) {
        return [error, null] as any;
      }
    };

    const getChatHistoryByRoomId = async (
      roomId: string,
      type: ConversationType
    ) => {
      const fetchHistory =
        type === "group" ? getGroupChatHistory : getSingleChatHistory;
      const [_, result] = await fetchHistory(roomId);
      return result.flat(2);
    };

    // 设置当前会话
    const setCurrentConversation = async (conversationId: string) => {
      // 更新关闭窗口的时间
      if (
        currentConversation.value &&
        currentConversation.value.id !== conversationId
      ) {
        updateChatWindowsTimeApi({
          roomId: currentConversation.value.id,
          type: currentConversation.value!.type || "person",
        });
      }
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

    // 通用会话处理逻辑
    const handleConversation = (params: {
      id: string;
      name: string;
      avatar?: string;
      type?: ConversationType;
      memberCount?: number;
      msgType?: MsgType;
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
          type: params.type || "person",
          memberCount: params.memberCount,
        });

        addSessionApi({
          roomId: params.id,
          type: params.type || "person",
        });
      }
      setCurrentConversation(params.id);
    };

    const createMessage = (
      params: Omit<Message, "id" | "createdAt">
    ): Message => {
      const {
        senderId,
        roomId = currentConversation.value!.id,
        content,
        msgType,
      } = params;
      return {
        id: uuidv4(),
        roomId,
        senderId,
        content,
        createdAt: new Date(Date.now()).toISOString(), // 时间戳
        msgType,
      };
    };

    const sendMessage = (params: {
      senderId?: string;
      roomId?: string;
      content: string;
      msgType?: MsgType;
      conversationId?: string;
    }) => {
      const {
        senderId = userStore.userInfo!.id,
        roomId = currentConversation.value!.id,
        msgType = "text",
        content,
      } = params;

      // told socket
      socketStore.socketSend({
        type: currentConversation.value!.type,
        roomId: roomId,
        msg: content,
        senderId: senderId,
        msgType,
      });
    };

    // 用来处理接收到的消息
    const addMessage = async (message: SocketMessage) => {
      // 接收消息的人是否在会话列表中
      const isSenderInConversations = conversationsList.value.some(
        (conv) => conv.id === message.roomId
      );

      const _message = createMessage({
        senderId: message.senderId,
        roomId: message.roomId,
        content: message.msg,
        msgType: message.msgType,
      });

      // 如果不在，添加新的会话
      if (!isSenderInConversations) {
        let memberCount = null;
        if (message.type === "group") {
          const [_, res] = await groupStore.getGroupMemberCountByList(
            message.roomId,
            message.type
          );
          memberCount = res;
        }
        addConversation({
          id: message.roomId,
          name: await getChatNameByRoomId({
            roomId: message.roomId,
            type: message.type,
          }),
          avatar: "",
          messages: [_message],
          type: message.type,
          memberCount: memberCount || undefined,
          unreadCount: 0,
        });
      }
      // 追加聊天记录
      appendMessageToConversation(message.roomId, _message);
      // 若消息所属会话非当前活跃会话，增加未读计数
      if (currentConversation.value?.id !== message.roomId) {
        const targetConversation = conversationsList.value.find(
          (conv) => conv.id === message.roomId
        );
        if (targetConversation) {
          targetConversation.unreadCount =
            (targetConversation.unreadCount || 0) + 1;
        }
      }
    };

    const getChatNameByRoomId = async (params: {
      roomId: string;
      type: string;
    }) => {
      const { roomId, type } = params;
      if (type === "group") {
        const group = await groupStore.getGroupById(roomId);
        return group?.name || "未知群聊";
      } else {
        const friend = await friendStore.getFriendById(roomId);
        return friend?.username || "未知好友";
      }
    };

    const getSessionList = async () => {
      const sessionList = await getSessionListApi();

      conversationsList.value = sessionList.data.map((item) => {
        return {
          id: item.roomId,
          name:
            item.type === "group"
              ? item.roomInfo.name
              : item.roomInfo.username || "",
          avatar: item.roomInfo.avatar,
          openTime: item.openTime,
          type: item.type as ConversationType,
          messages: [],
          memberCount: item.roomInfo?.count || 0,
          unreadCount: 0,
        };
      });

      // 获取聊天记录
      for (let i = 0; i < conversationsList.value.length; i++) {
        const item = conversationsList.value[i];
        const messages = await getChatHistoryByRoomId(
          item.id,
          item.type as ConversationType
        );
        item.messages = messages.map((msg: any) => {
          return {
            ...msg,
            isSelf: msg.senderId === userStore.userInfo?.id,
          };
        });
      }
    };

    return {
      conversationsList,
      currentConversation,
      setCurrentConversation,
      appendMessageToConversation,
      addConversation,
      appendMessageToCurrentConversation,
      handleConversation,
      sendMessage,
      addMessage,
      getSessionList,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
