<script setup lang="ts">
import emojiLists from "@/util/Emoji";
import { ref } from "vue";

defineProps({
  currentChatSession: {
    type: Object,
    default: () => {},
  },
});

const activeEmoji = ref("笑脸");
// 隐藏和展示Popover面板
const showEmojiPopover = ref(false);
const showSendMsgPopover = ref(false);
const hidePopover = () => {
  console.log("hide");
  showEmojiPopover.value = false;
  showSendMsgPopover.value = false;
};
// 发送表情包
const sendEmoji = () => {
  showEmojiPopover.value = false;
};
const showEmojiPopoverHandle = () => {
  showEmojiPopover.value = true;
};

//限制文件上传个数
const fileLimit = ref();
// 允许文件自动上传
const uploadFile = ref();
// 文件上传超出限制
const uploadExceed = () => {};

// 输入框内容
const msgContent = ref();
// 发送消息
const sendMessage = (e: any) => {
  e.preventDefault();
  if (e.shiftKey && e.keyCode === 13) {
    return;
  }
  const messageContent = msgContent.value ? msgContent.value.trim() : "";
  if (messageContent == "") {
    showSendMsgPopover.value = true;
    return;
  }
};
// 复制文件
const pasteFile = () => {};
</script>

<template>
  <div class="send-panel">
    <div class="toolbar">
      <!-- 表情包 -->
      <el-popover
        :visible="showEmojiPopover"
        trigger="click"
        placement="top"
        :teleported="false"
        @hide="hidePopover"
        :popper-style="{
          padding: '0px 10px 10px 10px',
          width: '490px',
        }"
      >
        <template #reference>
          <div
            class="iconfont icon-chat_emoji_icon"
            @click.stop="showEmojiPopoverHandle"
          ></div>
        </template>
        <template #default>
          <el-tabs v-model="activeEmoji" @click.stop>
            <el-tab-pane
              v-for="emoji in emojiLists"
              :label="emoji.name"
              :name="emoji.name"
            >
              <div class="emoji-list">
                <div
                  class="emoji-item"
                  v-for="item in emoji.emojiList"
                  @click.stop="sendEmoji"
                >
                  {{ item }}
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-popover>
      <!-- 文件上传 -->
      <el-upload
        ref="uploadRef"
        name="file"
        :show-file-list="false"
        :multiple="true"
        :limit="fileLimit"
        :http-request="uploadFile"
        :on-exceed="uploadExceed"
      >
        <div class="iconfont icon-icon_folder"></div>
      </el-upload>
    </div>
    <!-- 输入框 -->
    <div class="input-area">
      <el-input
        :rows="7"
        v-model="msgContent"
        type="textarea"
        resize="none"
        maxlength="500"
        show-word-limit
        spellcheck="true"
        input-style="background-color:#f5f5f5;border:none"
        @keydown.enter="sendMessage"
        @paste="pasteFile"
      ></el-input>
    </div>
    <!-- 按钮 -->
    <div class="send-btn-panel">
      <el-popover
        trigger="click"
        :visible="showSendMsgPopover"
        :hide-after="1000"
        placement="top-end"
        :teleported="false"
        @hide="hidePopover"
        :popper-style="{
          'min-width': '0px',
          width: '140px',
        }"
      >
        <template #reference>
          <span class="send-btn" @click.stop="sendMessage">发送(S)</span>
        </template>
        <template #default>
          <span class="empty-msg">不能发送空白消息</span>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<style scoped lang="scss">
.emoji-list {
  .emoji-item {
    float: left;
    font-size: 23px;
    padding: 2px;
    text-align: center;
    border-radius: 3px;
    margin-left: 10px;
    margin-top: 5px;
    cursor: pointer;
    &:hover {
      background-color: #ddd;
    }
  }
}
.send-panel {
  height: 200px;
  border-top: 1px solid #ddd;
  .toolbar {
    height: 40px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    .iconfont {
      color: #494949;
      font-size: 20px;
      margin-left: 10px;
      cursor: pointer;
    }
    :deep(.el-tabs__header) {
      margin-bottom: 0px;
    }
  }
  .input-area {
    padding: 0px 10px;
    outline: none;
    width: 100%;
    height: 170px;
    overflow: auto;
    word-wrap: break-word;
    word-break: break-all;

    :deep(.el-textarea__inner) {
      box-shadow: none;
    }
    :deep(.el-input__count) {
      background: none;
      right: 12px;
    }
  }
  .send-btn-panel {
    text-align: right;
    padding-top: 10px;
    margin-right: 22px;
    .send-btn {
      cursor: pointer;
      color: #07c160;
      background: #e9e9e9;
      border-radius: 5px;
      padding: 8px 25px;
      &:hover {
        background: #d2d2d2;
      }
    }
    .empty-msg {
      font-size: 14px;
    }
  }
}
</style>
