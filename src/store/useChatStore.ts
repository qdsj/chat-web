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
  deleteSessionApi,
  getGroupChatHistoryApi,
  getSessionListApi,
  getSingleChatHistoryApi,
  updateChatWindowsTimeApi,
} from "@/apis/chat";
import { useGroupStore } from "./userGroupStore";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { I_AddSessionResultApi } from "@/apis/types/chat.type";

export const useChatStore = defineStore(
  "chat",
  () => {
    const userStore = useUserStore();
    const socketStore = useSocketStore();
    const friendStore = useFriendStore();
    const groupStore = useGroupStore();
    const router = useRouter();
    const route = useRoute();
    // 会话列表
    const conversationsList = ref<Conversation[]>([]);
    // 搜索中的会话列表
    const searchSessionList = ref<Conversation[]>([]); // 搜索中的会话列表
    const isSearching = ref(false); // 是否正在搜索
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
        const res = await updateChatWindowsTimeApi({
          roomId: currentConversation.value.id,
          type: currentConversation.value!.type,
        });
        currentConversation.value!.openTime = res.data.openTime;
      }

      // 更新当前窗口的时间
      const targetConversation = conversationsList.value.find(
        (conv) => conv.id === conversationId
      );
      currentConversation.value = targetConversation || null;
      currentConversation.value!.unreadCount = 0;
      const res = await updateChatWindowsTimeApi({
        roomId: currentConversation.value!.id,
        type: currentConversation.value!.type,
      });
      currentConversation.value!.openTime = res.data.openTime;

      // 退出搜索状态
      isSearching.value = false;
      // 设置query
      router.push(
        "/chat" +
          `?id=${currentConversation.value!.id}&username=${
            currentConversation.value?.name
          }`
      );
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

    const addSession = async (
      roomId: string,
      type: ConversationType
    ): Promise<[string | null, I_AddSessionResultApi["data"] | null]> => {
      try {
        const res = await addSessionApi({
          roomId,
          type,
        });
        return [null, res.data];
      } catch (error) {
        ElMessage.warning(error || "添加会话失败");
        return [error, null] as any;
      }
    };

    // 添加新的会话
    const addConversation = (conversation: Conversation) => {
      conversationsList.value.push(conversation);
    };

    // 通用会话处理逻辑
    const handleConversation = async (params: {
      id: string;
      name: string;
      avatar?: string;
      type?: ConversationType;
      memberCount?: number;
      msgType?: MsgType;
    }) => {
      try {
        const hasConversation = conversationsList.value.some(
          (item) => item.id === params.id
        );
        // 如果不存在，则添加到会话列表中
        if (!hasConversation) {
          await addSession(params.id, params.type || "person");
          const messages = await getChatHistoryByRoomId(
            params.id,
            params.type || "person"
          );
          addConversation({
            id: params.id,
            name: params.name,
            avatar: params.avatar || "",
            messages: messages,
            type: params.type || "person",
            memberCount: params.memberCount,
          });
        }
        setCurrentConversation(params.id);
      } catch (error) {
        console.log(error);
      } finally {
        // 关闭好友列表的搜索状态
        friendStore.isSearching = false;
      }
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
      currentConversation.value!.unreadCount = 0;
    };

    // 创建消息类型与处理的映射关系
    const messageHandlers = {
      "new-message": {
        action: async (message: SocketMessage) => {
          const temp = JSON.parse(message.msg);
          return {
            title: temp.title,
            content: temp.content,
          };
        },
      },
      "request-friend": {
        action: async (message: SocketMessage) => {
          return {
            title: "系统消息",
            content: message.msg,
          };
        },
      },
      "agree-friend": {
        action: async (message: SocketMessage) => {
          await friendStore.getAllFriend();
          return {
            title: "系统消息",
            content: message.msg,
          };
        },
      },
      "enter-group": {
        action: async (message: SocketMessage) => {
          await groupStore.getGroupChatList();
          return {
            title: "系统消息",
            content: message.msg,
          };
        },
      },
      // 被踢出群聊
      "be-blocked-group": {
        action: async (message: SocketMessage) => {
          const msg = JSON.parse(message.msg);
          await groupStore.getGroupChatList();
          const hasConversation = conversationsList.value.some(
            (item) => item.id === msg.roomId
          );
          if (hasConversation) {
            await deleteSession({ roomId: msg.roomId, type: "group" });
            await getSessionList();
          }
          return {
            title: msg.title,
            content: msg.content,
          };
        },
      },
      // 加入新群聊
      "be-enter-group": {
        action: async (message: SocketMessage) => {
          const msg = JSON.parse(message.msg);
          await groupStore.getGroupChatList();
          await groupStore.getGroupMemberByList(msg.roomId, "group", false);
          const hasConversation = conversationsList.value.some(
            (item) => item.id === msg.roomId
          );
          if (!hasConversation) {
            await addSession(msg.roomId, "group");
            await getSessionList();
          }
          return {
            title: msg.title,
            content: msg.content,
          };
        },
      },
      // 默认处理
      default: {
        action: async (message: SocketMessage) => ({
          title: "系统消息",
          content: message.msg,
        }),
      },
    };

    // 用来处理接收到的消息
    const addMessage = async (message: SocketMessage) => {
      if (message.type == "server") {
        // 获取对应的处理器（参考网页3的条件判断优化）
        const handler =
          messageHandlers[message.msgType as keyof typeof messageHandlers] ||
          messageHandlers["default"];

        try {
          // 执行对应操作并获取通知内容
          const { title, content } = await handler.action(message);

          // 统一展示通知
          ElNotification({
            title,
            message: content,
          });
        } catch (error) {
          console.error("消息处理失败:", error);
        }

        return;
      }
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
        await addSession(message.roomId, message.type);
        let memberCount = null;
        if (message.type === "group") {
          const [_, res] = await groupStore.getGroupMemberCountByList(
            message.roomId,
            message.type
          );
          memberCount = res;
        }

        const chatInfo = await getChatInfoByRoomId({
          roomId: message.roomId,
          type: message.type,
        });

        addConversation({
          id: message.roomId,
          name: chatInfo.name,
          avatar: chatInfo.avatar,
          messages: [_message],
          type: message.type,
          memberCount: memberCount || undefined,
          unreadCount: 0,
        });
      } else {
        // 追加聊天记录
        appendMessageToConversation(message.roomId, _message);
      }
      const targetSession = conversationsList.value.find(
        (session) => session.id === message.roomId
      );
      if (
        targetSession &&
        message.senderId !== userStore.userInfo?.id &&
        message.roomId !== currentConversation.value?.id
      ) {
        targetSession.unreadCount! += 1;
      }
    };

    const getChatInfoByRoomId = async (params: {
      roomId: string;
      type: string;
    }) => {
      const { roomId, type } = params;
      if (type === "group") {
        const group = await groupStore.getGroupById(roomId);
        return {
          name: group?.name || "未知群聊",
          avatar: group?.avatar || "",
        };
      } else {
        const friend = await friendStore.getFriendById(roomId);
        return {
          name: friend?.username || "未知好友",
          avatar: friend?.avatar || "",
        };
      }
    };

    // 获取会话列表
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

        // 计算未读消息数（createAt晚于openTime的消息数量）
        if (
          currentConversation.value?.id &&
          item.id !== currentConversation.value?.id
        ) {
          item.unreadCount = item.messages.filter((msg) => {
            const msgTime = new Date(msg.createdAt).getTime();
            const openTime = new Date(item.openTime!).getTime();
            return msgTime > openTime;
          }).length;
        }
      }
    };
    // 删除会话记录
    const deleteSession = async (data: {
      roomId: string;
      type: ConversationType;
    }) => {
      try {
        const res = await deleteSessionApi(data);
        ElMessage.success(res.message);
        await resetCurrentConversation(false);
      } catch (error) {
        ElMessage.warning(error || "删除会话失败");
      }
    };

    const searchSession = async (name: string) => {
      if (name.trim()) {
        isSearching.value = false;
        return;
      }
      const session = conversationsList.value.filter((session) => {
        return session.name.toLowerCase().includes(name.toLowerCase());
      });
      searchSessionList.value = session;
      isSearching.value = true;
    };

    const resetCurrentConversation = async (isReloadPage = true) => {
      // 获取最新的session
      await getSessionList();
      // 当前session已经退出，所以要置空。以免在`setCurrentConversation`方法中，更新不存在的session的窗口时间
      currentConversation.value = null;
      // 将currentConversation设置成第一个session，如果没有，就刷新当前页面并删除当前的query
      if (conversationsList.value.length > 0) {
        setCurrentConversation(conversationsList.value[0].id);
      } else if (isReloadPage) {
        groupStore.reloadPage(true);
      }
    };

    const initialSessionPage = async () => {
      // 获取最新的session
      await getSessionList();

      // 设置当前会话列表，更新当前会话列表的窗口时间
      if (route.name === "聊天" && conversationsList.value.length > 0) {
        if (currentConversation.value) {
          setCurrentConversation(currentConversation.value.id);
        } else {
          setCurrentConversation(conversationsList.value[0].id);
        }
      } else {
        currentConversation.value = null;
      }
    };

    return {
      conversationsList,
      searchSessionList,
      isSearching,
      currentConversation,
      setCurrentConversation,
      appendMessageToConversation,
      addConversation,
      appendMessageToCurrentConversation,
      handleConversation,
      sendMessage,
      addMessage,
      getSessionList,
      deleteSession,
      searchSession,
      resetCurrentConversation,
      initialSessionPage,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
