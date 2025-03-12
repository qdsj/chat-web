<script setup lang="ts">
import { ref } from "vue";
import { useSocketStore } from "@/store/useSocketStore";
import { useChatStore } from "@/store/useChatStore";
import { useRoute } from "vue-router";
import ChatSession from "./ChatSession.vue";
import MessageSend from "./MessageSend.vue";
import Blank from "@/components/Blank.vue";
import { fetchTest } from "@/apis/auth";

import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import { Message } from "@/util/types";

const socketStore = useSocketStore();
const chatStore = useChatStore();

const route = useRoute();
const selfName = ref("");
const searchKey = ref("");

// 搜索好友 or 群聊
const search = () => {
  console.log(searchKey.value);
};

// 模拟初始化会话列表和好友列表
const initialConversations = [
  {
    id: "group-all",
    name: "所有人的群聊",
    contactType: 1,
    memberCount: 1,
    messages: [
      {
        id: 1,
        sender: "其他",
        receiver: "",
        content: "你好！",
        isSelf: false,
        time: "10:00",
      },
      {
        id: 2,
        sender: "我自己",
        receiver: "",
        content: "你好，有什么可以帮你的吗？",
        isSelf: true,
        time: "10:01",
      },
    ],
  },
  // 可以添加更多会话
  {
    id: "1",
    name: "张三",
    lastMessage:
      "你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！",
    time: "10:00",
    topType: 1,
    messages: [
      {
        id: 1,
        sender: "其他",
        receiver: "",
        content: "你好！",
        isSelf: false,
        time: "10:00",
      },
      {
        id: 2,
        sender: "我自己",
        receiver: "",
        content: "你好，有什么可以帮你的吗？",
        isSelf: true,
        time: "10:01",
      },
    ],
  },
  {
    id: "2",
    name: "Zenos",
    lastMessage: "在吗？",
    time: "09:30",
    messages: [
      {
        id: 1,
        sender: "其他",
        receiver: "",
        content: "你好！",
        isSelf: false,
        time: "10:00",
      },
      {
        id: 2,
        sender: "我自己",
        receiver: "",
        content: "你好，有什么可以帮你的吗？",
        isSelf: true,
        time: "10:01",
      },
    ],
  },
  {
    id: "3",
    name: "王五",
    lastMessage: "好的",
    time: "昨天",
    messages: [
      {
        id: 1,
        sender: "其他",
        receiver: "",
        content: "你好！",
        isSelf: false,
        time: "10:00",
      },
      {
        id: 2,
        sender: "我自己",
        receiver: "",
        content: "你好，有什么可以帮你的吗？",
        isSelf: true,
        time: "10:01",
      },
    ],
  },
];

const initialFriends = [
  { id: "1", name: "张三" },
  { id: "2", name: "Zenos" },
  { id: "3", name: "王五" },
];

chatStore.initConversations(initialConversations);
chatStore.initFriends(initialFriends);

// 点击会话
const chatSessionClickHandle = (conversationId: string) => {
  chatStore.setCurrentConversation(conversationId);
};

onMounted(() => {
  fetchTest();
  selfName.value = (route.query.name || "") as string;

  // connect socket
  socketStore.socketInitial({
    onConnectCallbacks: [
      () => {
        socketStore.socketJoinRoom("group-all");
      },
    ],
    onMessageCallbacks: [
      (data: any) => {
        const message = reactive<Message>({
          id: chatStore.getCurrentConversation!.messages.length + 1,
          sender: data.sender,
          receiver: "",
          content: data.content,
          isSelf: false,
          time: new Date().toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
        console.log("message", data);
        chatStore.appendMessageToConversation(data.id, message);
      },
    ],
  });
});

// 显示群聊详情
const showGroupDetail = () => {};
</script>

<template>
  <Layout>
    <!-- 左边 -->
    <template #left-content>
      <!-- 搜索框 -->
      <div class="top-search">
        <el-input
          clearable
          placeholder="搜索"
          v-model="searchKey"
          size="large"
          @keyup="search"
        >
          <template #suffix>
            <span class="iconfont icon-search"></span>
          </template>
        </el-input>
      </div>
      <!-- 会话列表 -->
      <div class="chat-session-list">
        <template v-for="item in chatStore.allConversations" :key="item.id">
          <ChatSession
            :currentSession="chatStore.getCurrentConversation?.id === item.id"
            :data="item"
            @click="chatSessionClickHandle(item.id)"
          ></ChatSession>
        </template>
      </div>
    </template>

    <!-- 右边 -->
    <template #right-content>
      <splitpanes horizontal class="default-theme">
        <pane size="75">
          <div class="title-panel" v-if="chatStore.getCurrentConversation">
            <div class="title">
              <span>{{ chatStore.getCurrentConversation.name }}</span>
              <!-- 群聊 -->
              <span v-if="chatStore.getCurrentConversation.contactType == 1">
                ({{ chatStore.getCurrentConversation.memberCount }})
              </span>
            </div>
            <!-- 群聊 -->
            <div
              v-if="chatStore.getCurrentConversation.contactType == 1"
              class="iconfont icon-icon_more"
              @click="showGroupDetail"
            ></div>
          </div>
          <el-container>
            <el-main class="chat-box" v-show="chatStore.getCurrentConversation">
              <div class="messages-container">
                <template
                  v-for="msg in chatStore.getCurrentConversation?.messages"
                  :key="msg"
                >
                  <div class="message-time">
                    <span>{{ msg.time }}</span>
                  </div>
                  <div
                    :class="[
                      'message',
                      msg.isSelf ? 'message-self' : 'message-other',
                    ]"
                  >
                    <el-avatar size="small">{{
                      msg.isSelf ? "Me" : msg.sender
                    }}</el-avatar>
                    <div class="message-content" shadow="never">
                      {{ msg.content }}
                    </div>
                  </div>
                </template>
              </div>
            </el-main>
          </el-container>
          <Blank v-if="!chatStore.getCurrentConversation"></Blank>
        </pane>
        <pane min-size="15" size="25" v-if="chatStore.getCurrentConversation">
          <!-- 发送组件 -->
          <MessageSend
            :chatStore.getCurrentConversation="
              chatStore.getCurrentConversation || {}
            "
          >
          </MessageSend>
        </pane>
      </splitpanes>
    </template>
  </Layout>
</template>

<style scoped lang="scss">
.splitpanes__pane {
  transition: none; /* 禁用过渡效果 */
}

.top-search {
  padding: 20px 10px;
  background-color: #f7f7f7;
  display: flex;
  align-items: center;
  .iconfont {
    font-size: 18px;
  }
}
.chat-container {
  height: 100vh;
  border: 1px solid #dcdfe6;
}

.sidebar {
  border-right: 1px solid #dcdfe6;
  .conversation-list {
    border-right: none;
  }
  .el-menu-item {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    .conversation-info {
      margin-left: 12px;
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      line-height: 1;
      justify-content: space-between;

      .name {
        display: block;
        font-weight: bold;
      }
      .last-message {
        font-size: 12px;
        color: #909399;
      }
    }
    .time {
      font-size: 12px;
      color: #909399;
    }
  }
}

.chat-box {
  // height: calc(100vh - 360px);
  padding: 0;
  display: flex;
  flex-direction: column;

  .messages-container {
    flex: 1;
    padding: 20px;
    overflow-y: auto;

    .message-time {
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        padding: 2px 5px;
        background: #ddd;
        color: #fff;
        border-radius: 2px;
      }
    }

    .message {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;

      &.message-self {
        flex-direction: row-reverse;
        .message-content {
          margin-right: 12px;
          margin-left: 0;
          background-color: #ecf5ff;
        }
      }

      &.message-other .message-content {
        margin-left: 12px;
        background-color: #f4f4f5;
      }

      .message-content {
        max-width: 60%;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 12px 16px;
        white-space: normal;
        background: #e0e0e0;
        color: #000;
        border-radius: 24px 16px 16px 4px;
        box-shadow: 0 3px 3px rgba(0, 0, 0, 0.5);
      }
    }
  }
}

.input-box {
  border-top: 1px solid #dcdfe6;
  padding: 10px 20px;
  background-color: #fff;

  .toolbar {
    margin-bottom: 10px;
    display: flex;
    gap: 10px;
  }

  .el-input {
    margin-bottom: 10px;
  }

  .emoji-panel {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 5px;

    .emoji {
      cursor: pointer;
      font-size: 20px;
      text-align: center;
      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}

.title-panel {
  width: 100%;
  height: 81px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  font-size: 18px;
  color: #000000;
  border-bottom: 1px solid #ddd;
  .title {
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
