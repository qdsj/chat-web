<script setup lang="ts">
defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  currentSession: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div :class="['chat-session-item', currentSession ? 'active' : '']">
    <div class="contact-tag" v-if="data.contactType == 1">群</div>
    <!-- 头像 -->
    <el-avatar :size="50" />
    <div class="user-info">
      <div class="user-name-panel">
        <div class="user-name">{{ data.name }}</div>
        <div class="message-time">{{ data.time }}</div>
      </div>
      <div class="last-message" v-html="data.lastMessage"></div>
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
  .user-info {
    flex: 1;
    margin-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .user-name-panel {
      display: flex;
      .user-name {
        width: 280px;
        color: #000;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .message-time {
        width: 55px;
        color: #b6b6b6;
        font-size: 14px;
        text-align: right;
      }
    }
    .last-message {
      width: 280px;
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
