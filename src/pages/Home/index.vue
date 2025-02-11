<script setup lang="ts">
import { ref } from 'vue';

const message = ref('');
const activeConversation = ref('1');
const conversations = ref([
  { id: '1', name: '张三', lastMessage: '你好！', time: '10:00' },
  { id: '2', name: '李四', lastMessage: '在吗？', time: '09:30' },
  { id: '3', name: '王五', lastMessage: '好的', time: '昨天' },
]);

const messages = ref([
  { id: 1, content: '你好！', isSelf: false, time: '10:00' },
  { id: 2, content: '你好，有什么可以帮你的吗？', isSelf: true, time: '10:01' },
]);

function sendMessage() {
  if (message.value.trim()) {
    messages.value.push({
      id: messages.value.length + 1,
      content: message.value,
      isSelf: true,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    });
    message.value = '';
  }
}

function handleFileUpload(file:any) {
  console.log('File uploaded:', file);
}

const emojis = ['😊', '😂', '🤔', '👍', '❤️', '😎'];
const showEmojiPanel = ref(false);

function insertEmoji(emoji: any) {
  message.value += emoji;
  showEmojiPanel.value = false;
}
</script>

<template>
  <el-container class="chat-container">
    <el-aside width="250px" class="sidebar">
      <el-menu :default-active="activeConversation" class="conversation-list">
        <el-menu-item v-for="conv in conversations" :key="conv.id" :index="conv.id">
          <el-avatar size="small">{{ conv.name[0] }}</el-avatar>
          <div class="conversation-info">
            <span class="name">{{ conv.name }}</span>
            <span class="last-message">{{ conv.lastMessage }}</span>
          </div>
          <span class="time">{{ conv.time }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-main class="chat-box">
        <div class="messages-container">
          <div v-for="msg in messages" :key="msg.id" 
               :class="['message', msg.isSelf ? 'message-self' : 'message-other']">
            <el-avatar size="small">{{ msg.isSelf ? 'Me' : '对方' }}</el-avatar>
            <el-card class="message-content" shadow="never">
              {{ msg.content }}
              <div class="message-time">{{ msg.time }}</div>
            </el-card>
          </div>
        </div>
      </el-main>
      
      <el-footer height="auto" class="input-box">
        <div class="toolbar">
          <el-upload
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleFileUpload">
            <el-button type="primary" plain>
              <el-icon><upload-filled /></el-icon>
            </el-button>
          </el-upload>
          
          <el-popover
            placement="top"
            :width="200"
            trigger="click"
            v-model:visible="showEmojiPanel">
            <template #reference>
              <el-button type="primary" plain>
                <el-icon><emoji /></el-icon>
              </el-button>
            </template>
            <div class="emoji-panel">
              <span v-for="emoji in emojis" 
                    :key="emoji" 
                    class="emoji"
                    @click="insertEmoji(emoji)">
                {{ emoji }}
              </span>
            </div>
          </el-popover>
        </div>
        
        <el-input
          v-model="message"
          placeholder="输入消息..."
          :rows="3"
          type="textarea"
          @keyup.enter.native="sendMessage"
        />
        <el-button type="primary" @click="sendMessage">发送</el-button>
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
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
  padding: 0;
  display: flex;
  flex-direction: column;
  
  .messages-container {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    
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
        .message-time {
          font-size: 12px;
          color: #909399;
          margin-top: 4px;
          text-align: right;
        }
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
</style>
