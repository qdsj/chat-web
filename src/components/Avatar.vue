<script setup lang="ts">
import { useChatStore } from "@/store/useChatStore";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "vue-router";
const userStroe = useUserStore();
const chatStore = useChatStore();
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
  borderRadius: {
    type: Number,
    default: 0,
  },
  showLargeImage: {
    type: Boolean,
    default: false,
  },
});

const friendInfo = ref({
  id: "",
  username: "",
  contactType: 1,
  avatar: "",
  email: "",
});
const getContactInfo = () => {
  friendInfo.value.id = props.userId;
  // TODO 获取联系人详情数据
  friendInfo.value.username = props.username;
  friendInfo.value.avatar = props.avatar;
  friendInfo.value.email = props.email;
};

// TODO 发送消息
const sendMessage = () => {
  chatStore.handleConversation({
    id: friendInfo.value.id,
    name: friendInfo.value.username,
    avatar: "",
  });

  // 跳转到聊天页面
  router.push("/chat");
};
// TODO 加为好友
const addContact = () => {};
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
        <el-button
          v-if="friendInfo.contactType == 1"
          type="primary"
          @click="sendMessage"
        >
          发送消息
        </el-button>
        <el-button v-else type="primary" @click="addContact"
          >加为好友</el-button
        >
      </div>
    </template>
  </el-popover>
</template>

<style scoped lang="scss">
.op-btn {
  text-align: center;
  border-top: 1px solid #eaeaea;
  padding-top: 10px;
  margin-top: 10px;
}
</style>
