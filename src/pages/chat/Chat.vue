<script setup lang="ts">
import Blank from "@/components/Blank.vue";
import { useChatStore } from "@/store/useChatStore";
import { formatMessageTime } from "@/util/utils";
import { Pane, Splitpanes } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import { ref } from "vue";
import CreateGroup from "../group/CreateGroupDialog.vue";
import MessageSend from "./MessageSend.vue";
import SessionList from "./SessionList.vue";
import MsgItem from "./components/MsgItem.vue";
import type { DrawerProps } from "element-plus";
import GroupInfo from "../group/GroupInfo.vue";

const chatStore = useChatStore();

const searchKey = ref("");

// 搜索好友 or 群聊
const search = () => {
  chatStore.searchSession(searchKey.value);
};

// 监听搜索状态变化，清空搜索框
watch(
  () => chatStore.isSearching,
  () => {
    if (chatStore.isSearching === false) {
      searchKey.value = "";
    }
  }
);

const messageContainer = ref<HTMLElement | null>(null);

// 监听当前会话的消息变化
watch(
  () => chatStore.currentConversation?.messages,
  () => {
    nextTick(() => {
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value!.scrollHeight;
      }
    });
  },
  { deep: true, immediate: true } // 深度监听，确保每次消息变化都触发滚动操作
);

const dialogListVisible = ref(false);
const updateDialogListVisible = (data: boolean) => {
  dialogListVisible.value = data;
};

const drawer = ref(false);
const direction = ref<DrawerProps["direction"]>("rtl");
const showGroupDetail = () => {
  drawer.value = true;
};
</script>

<template>
  <Layout>
    <!-- 左边 -->
    <template #left-content>
      <!-- 搜索框 -->
      <div class="top-search">
        <!-- TODO: 点击搜索按钮，或者回车，才触发搜索动作 -->
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
        <div
          class="iconfont icon-style icon-plus"
          @click="dialogListVisible = true"
        ></div>
      </div>
      <div class="friendList-box">
        <CreateGroup
          :dialogListVisible="dialogListVisible"
          @update-dialog-list-visible="updateDialogListVisible"
        >
        </CreateGroup>
      </div>
      <!-- 会话列表 -->
      <SessionList />
    </template>

    <!-- 右边 -->
    <template #right-content>
      <splitpanes horizontal class="default-theme">
        <pane size="75">
          <div class="title-panel" v-if="chatStore.currentConversation">
            <div class="title">
              <span>{{ chatStore.currentConversation.name }}</span>
              <!-- 群聊 -->
              <span v-if="chatStore.currentConversation.type === 'group'">
                ({{ chatStore.currentConversation.memberCount }})
              </span>
            </div>
            <!-- 群聊 -->
            <div
              v-if="chatStore.currentConversation.type == 'group'"
              class="iconfont icon-icon_more"
              @click="showGroupDetail"
            ></div>
          </div>
          <el-container class="chat-container">
            <el-main class="chat-box" v-show="chatStore.currentConversation">
              <el-drawer
                v-model="drawer"
                :direction="direction"
                :show-close="false"
              >
                <GroupInfo
                  :roomId="chatStore.currentConversation?.id"
                  @close-drawer="drawer = false"
                ></GroupInfo>
              </el-drawer>
              <div class="messages-container" ref="messageContainer">
                <template
                  v-for="msg in chatStore.currentConversation?.messages"
                  :key="msg"
                >
                  <div class="message-time">
                    <span>{{
                      formatMessageTime(new Date(msg.createdAt).getTime())
                    }}</span>
                  </div>
                  <MsgItem :msg="msg" />
                </template>
              </div>
            </el-main>
          </el-container>
          <Blank v-if="!chatStore.currentConversation"></Blank>
        </pane>
        <pane min-size="15" size="25" v-if="chatStore.currentConversation">
          <!-- 发送组件 -->
          <MessageSend />
        </pane>
      </splitpanes>
    </template>
  </Layout>
</template>

<style scoped lang="scss">
.splitpanes__pane {
  transition: none;
  /* 禁用过渡效果 */
}

.top-search {
  padding: 20px 10px;
  background-color: #f7f7f7;
  display: flex;
  align-items: center;

  .iconfont {
    font-size: 18px;
    cursor: pointer;
  }

  .icon-style {
    background: #d2d2d2;
    margin-left: 10px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #a2a2a2;
    border-radius: 3px;

    &:hover {
      background: #c2c2c2;
    }
  }
}

.friendList-box {
  position: absolute;
  top: 5%;
  left: 15%;
}

.chat-container {
  height: 100vh;
  border: 1px solid #dcdfe6;
}

::-webkit-scrollbar {
  width: 10px;
  /* 滚动条宽度 */
  height: 10px;
  /* 滚动条高度 */
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
  height: 80px;
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

.chat-container {
  height: calc(100% - 80px);
}
</style>
