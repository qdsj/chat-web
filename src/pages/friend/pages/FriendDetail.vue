<script setup lang="ts">
import { useChatStore } from "@/store/useChatStore";
import { useFriendStore } from "@/store/useFriendStore";
import { ConversationType } from "@/types/model/chat.type";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";

const friendStore = useFriendStore();
const router = useRouter();
const route = useRoute();

const chatStore = useChatStore();

interface FriendInfo {
  id: string;
  username: string;
  type: ConversationType;
  avatar: string;
  email: string;
}

const friendInfo = ref<FriendInfo>({
  id: "",
  username: "",
  avatar: "",
  email: "",
  type: "person",
});

// 更新 userInfo 的函数
function updateUserInfo() {
  friendInfo.value = {
    id: (route.query.id as string) || "",
    username: (route.query.username as string) || "",
    avatar: "",
    email: friendStore.getFriendById(route.query.id as string)?.email as string,
    type: "person",
  };
}
// 监听 route.query.id 的变化
watch(
  () => route.query.id,
  () => {
    updateUserInfo();
  },
  { immediate: true }
);

const handleBlockFriend = () => {
  ElMessageBox.confirm(
    `你确定要拉黑好友${friendInfo.value.username}吗?`,
    "Warning",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      await friendStore.blockFriend(friendInfo.value.id);
      await friendStore.getAllFriend();
      await friendStore.getBlackList();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消拉黑",
      });
    });
};

const handleUnblockFriend = async () => {
  await friendStore.unblockFriend(friendInfo.value.id);
  await friendStore.getAllFriend();
  await friendStore.getBlackList();
};

const sendmessage = () => {
  chatStore.handleConversation({
    id: friendInfo.value.id,
    name: friendInfo.value.username,
    avatar: "",
    type: friendInfo.value.type,
  });

  // 跳转到聊天页面
  router.push("/chat");
};

const friendStatus = computed(() => {
  const id = route.query.id;
  // 优先级：blocked > accepted（确保互斥）
  const isBlocked = friendStore.blockList.some(
    (item) => item.id === id && item.friendShip?.status === "blocked"
  );
  const isAccepted =
    !isBlocked &&
    friendStore.friendList.some(
      (item) => item.id === id && item.friendShip?.status === "accepted"
    );
  return { isAccepted, isBlocked };
});
</script>

<template>
  <ContentPanel :showTopBorder="false">
    <div class="user-info">
      <UserBaseInfo :userInfo="friendInfo"></UserBaseInfo>
      <div class="more-op">
        <el-dropdown placement="bottom-end" trigger="click">
          <span class="el-dropdown-link">
            <div class="iconfont icon-icon_more"></div>
          </span>
          <template #dropdown>
            <el-dropdown-item
              v-if="friendStatus.isAccepted"
              @click="handleBlockFriend"
              >拉黑好友</el-dropdown-item
            >
            <el-dropdown-item
              v-if="friendStatus.isBlocked"
              @click="handleUnblockFriend"
              >恢复好友关系</el-dropdown-item
            >
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- <div class="part-item">
      <div class="part-title">个性签名</div>
      <div class="part-content">{{ userInfo.personalSignature || "-" }}</div>
    </div> -->
    <div class="send-message" @click="sendmessage">
      <div class="iconfont icon-icon_chat"></div>
      <div class="text">发消息</div>
    </div>
  </ContentPanel>
</template>

<style scoped lang="scss">
.user-info {
  position: relative;
  .more-op {
    position: absolute;
    right: 0px;
    top: 20px;
    .icon-icon_more {
      color: #9e9e9e;
      font-size: 20px;
      &:hover {
        background-color: #ddd;
      }
    }
  }
}
.part-item {
  display: flex;
  border-bottom: 10x solid #eaeaea;
  padding: 20px 0px;
  .part-title {
    width: 80px;
    color: #9e9e9e;
  }
  .part-content {
    flex: 1;
    margin-left: 15px;
    color: #161616;
  }
}

.send-message {
  width: 80px;
  margin: 0px auto;
  text-align: center;
  margin-top: 20px;
  color: #7d8cac;
  padding: 5px;
  .icon-icon_chat {
    font-size: 28px;
  }
  .text {
    font-size: 16px;
    margin-top: 5px;
  }
  &:hover {
    background: #e9e9e9;
    cursor: pointer;
  }
}
</style>
