<script setup lang="ts">
import AvatarBase from "@/components/AvatarBase.vue";
import { formatChatTime } from "@/util/utils";

const props = defineProps({
  avatar: {
    type: String,
    default: "",
  },
  data: {
    type: Object,
    default: () => {},
  },
});
const hasMessages = computed(() => props.data?.messages?.length > 0);
</script>

<template>
  <div :class="['chat-session-item']">
    <div class="contact-tag" v-if="data.contactType == 1">群</div>
    <!-- 头像 -->
    <AvatarBase :avatar="avatar" :alt="`${data.name}`" :width="50"></AvatarBase>
    <div class="user-info">
      <div class="user-name-panel">
        <div class="user-name">{{ data.name }}</div>
        <div class="message-time" v-if="hasMessages">
          {{
            formatChatTime(new Date(data.messages.at(-1).createdAt).getTime())
          }}
        </div>
      </div>
      <div
        class="last-message"
        v-if="hasMessages"
        v-html="data.messages.at(-1).content"
      ></div>
    </div>
    <!-- 置顶 -->
    <div class="chat-top iconfont icon-icon-top" v-if="data.topType == 1"></div>
  </div>
</template>

<style scoped lang="scss">
.chat-session-item {
  padding: 10px;
  position: relative;
  display: flex;
  border-bottom: 1px solid #ddd;
  .contact-tag {
    position: absolute;
    left: 8px;
    top: 8px;
    z-index: 1px;
    background-color: #24acf2;
    color: #fff;
    font-size: 12px;
    padding: 1px 2px 1px 1px;
    border-radius: 0px 3px 3px 0px;
    line-height: 12px;
  }
  &:hover {
    cursor: pointer;
    background-color: #d8d8d7;
    .message-time {
      color: #9a9898 !important;
    }
  }
  &:active {
    background: #d8d8d7;
  }
  .user-info {
    flex: 1;
    margin: 0 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .user-name-panel {
      display: flex;
      justify-content: space-between;
      .user-name {
        width: 280px;
        color: #000;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .message-time {
        width: 60px;
        color: #b6b6b6;
        font-size: 14px;
        text-align: right;
      }
    }
    .last-message {
      max-width: 95%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      color: #999;
      margin-top: 5px;
    }
  }
  // 置顶
  .chat-top {
    position: absolute;
    right: 8px;
    top: 8px;
    font-size: 12px;
    color: #8f8f8f;
  }
}
.active {
  cursor: pointer;
  background-color: #c9c8c6;
  .message-time {
    color: #999 !important;
  }
  &:hover {
    background-color: #c9c8c6;
    .message-time {
      color: #999 !important;
    }
  }
}
</style>
