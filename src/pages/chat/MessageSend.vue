<script setup lang="ts">
import { uploadFile } from "@/apis/oss";
import { useChatStore } from "@/store/useChatStore";
import emojiLists from "@/util/Emoji";

const chatStore = useChatStore();

const activeEmoji = ref("笑脸");
// 隐藏和展示Popover面板
const showEmojiPopover = ref(false);
const showSendMsgPopover = ref(false);
const hidePopover = () => {
  showEmojiPopover.value = false;
  showSendMsgPopover.value = false;
};

const inputRef = ref();
// 发送表情包
const chooseEmoji = async (emoji: string) => {
  const inputElement = inputRef.value?.$el?.querySelector("textarea");
  if (!inputElement) return;
  // 获取当前光标的起始和结束位置
  const start = inputElement.selectionStart;
  const end = inputElement.selectionEnd;
  // 将输入框的文本按光标位置拆分为前后两部分
  const before = msgContent.value.slice(0, start);
  const after = msgContent.value.slice(end);
  // 插入表情
  msgContent.value = before + emoji + after;

  setTimeout(() => {
    if (inputElement) {
      inputElement.focus();
      inputElement.selectionStart = inputElement.selectionEnd =
        start + emoji.length;
    }
  }, 100);
  showEmojiPopover.value = false;
};
const showEmojiPopoverHandle = () => {
  showEmojiPopover.value = true;
};

const onSuccess = (res: any) => {
  if (res) {
    console.log("上传成功", res);
    const fileUrl = res.url;
    let type = res.type;
    if (type.includes("pdf")) {
      type = "pdf";
    } else if (type.includes("image")) {
      type = "image";
    } else if (type.includes("video")) {
      type = "video";
    } else if (type.includes("audio")) {
      type = "audio";
    } else {
      type = "text";
    }

    chatStore.sendMessage({
      content: fileUrl,
      msgType: type,
    });
  }
};

// 输入框内容
const msgContent = ref("");

// 发送消息
const sendMessage = (e: any) => {
  e.preventDefault();
  if (e.shiftKey && e.keyCode === 13) {
    return;
  }
  const messageContent = msgContent.value ? msgContent.value.trim() : "";
  if (messageContent == "") {
    showSendMsgPopover.value = true;
    setTimeout(() => {
      hidePopover();
    }, 1000);
    return;
  }

  chatStore.sendMessage({
    content: messageContent,
  });

  msgContent.value = "";
};
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
          <el-tabs v-model="activeEmoji">
            <el-tab-pane
              v-for="emoji in emojiLists"
              :label="emoji.name"
              :name="emoji.name"
            >
              <div class="emoji-list">
                <div
                  class="emoji-item"
                  v-for="item in emoji.emojiList"
                  @click.stop="chooseEmoji(item)"
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
        :http-request="uploadFile"
        :on-success="onSuccess"
      >
        <div class="iconfont icon-icon_folder"></div>
      </el-upload>
    </div>
    <!-- 输入框 -->
    <div class="input-area">
      <el-input
        ref="inputRef"
        autofocus
        v-model="msgContent"
        type="textarea"
        resize="none"
        spellcheck="true"
        input-style="background-color:#f5f5f5;border:none;font-size:18px"
        @keydown.enter="sendMessage"
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
  height: 100%;
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
    min-height: 180px;
    overflow: auto;
    word-wrap: break-word;
    word-break: break-all;

    :deep(.el-textarea__inner) {
      box-shadow: none;
      min-height: 180px !important;
      background: #f2f2f2 !important;
    }

    :deep(.el-input__count) {
      background: none;
      right: 12px;
    }
  }

  .send-btn-panel {
    position: absolute;
    bottom: 10px;
    /* 距离底部的距离 */
    right: 10px;

    /* 可选：如果需要控制宽度 */
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
