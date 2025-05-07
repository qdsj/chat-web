<script setup lang="ts">
import SearchAdd from "@/pages/friend/components/SearchAdd.vue";
import { useChatStore } from "@/store/useChatStore";
import { useFriendStore } from "@/store/useFriendStore";
import { useGroupStore } from "@/store/userGroupStore";
import { useUserStore } from "@/store/useUserStore";
import { ConversationType } from "@/types/model/chat.type";
import { useRouter } from "vue-router";
const userStroe = useUserStore();
const chatStore = useChatStore();
const friendStore = useFriendStore();
const groupStore = useGroupStore();
const router = useRouter();

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  width: {
    type: Number,
    default: 40,
  },
});

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
  type: "person",
  avatar: "",
  email: "",
});

const getContactInfo = () => {
  friendInfo.value.id = props.userId;
  // 获取联系人详情数据
  friendInfo.value.username = props.username;
  friendInfo.value.avatar = props.avatar;
  friendInfo.value.email = props.email;
};

const isFriend = friendStore.friendList.some(
  (item) => item.id === props.userId
);

// 发送消息
const sendMessage = () => {
  groupStore.isSearching = false;
  chatStore.handleConversation({
    id: friendInfo.value.id,
    name: friendInfo.value.username,
    avatar: friendInfo.value.avatar,
    type: friendInfo.value.type || "person",
  });
  // 跳转到聊天页面
  router.push("/chat");
};

const searchAddRef = ref();
// 加为好友
const addContact = () => {
  if (searchAddRef.value) {
    searchAddRef.value.showFun(friendInfo.value);
  }
};

// 重置表单
const resetForm = () => {};
</script>

<template>
  <el-popover
    :width="300"
    placement="right-start"
    :show-arrow="false"
    transition="none"
    trigger="click"
    :hide-after="0"
    @show="getContactInfo"
    ref="popover"
  >
    <template #reference>
      <AvatarBase
        :width="width"
        :alt="`${username}`"
        :avatar="avatar"
      ></AvatarBase>
    </template>
    <template #default>
      <UserBaseInfo :userInfo="friendInfo"></UserBaseInfo>
      <div class="op-btn" v-if="userId !== userStroe.userInfo?.id">
        <el-button v-if="isFriend" type="primary" @click="sendMessage">
          发送消息
        </el-button>
        <el-button v-else type="primary" @click="addContact"
          >加为好友</el-button
        >
      </div>
    </template>
  </el-popover>
  <!-- 添加好友申请弹框 -->
  <SearchAdd ref="searchAddRef" @reload="resetForm"></SearchAdd>
</template>

<style scoped lang="scss">
.op-btn {
  text-align: center;
  border-top: 1px solid #eaeaea;
  padding-top: 10px;
  margin-top: 10px;
}
</style>
