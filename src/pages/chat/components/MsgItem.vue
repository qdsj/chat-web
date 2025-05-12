<script setup lang="ts">
import { useChatStore } from "@/store/useChatStore";
import { useGroupStore } from "@/store/userGroupStore";
import { useUserStore } from "@/store/useUserStore";
import { Message } from "@/types/model/chat.type";

const chatStore = useChatStore();
const userStore = useUserStore();
const groupStore = useGroupStore();

const props = defineProps<{
  msg: Message;
}>();
const isSelf = (sender: string) => {
  return sender === userStore.userInfo!.id;
};

const alt = computed(() => {
  if (isSelf(props.msg.senderId)) {
    return userStore.userInfo?.username;
  } else {
    return chatStore.currentConversation?.name;
  }
});

// 封装群成员查询逻辑
const useGroupMember = (groupId: string) => {
  const group = groupStore.groupList.find((item) => item.id === groupId);
  const loadMembers = async () => {
    if (!group?.member) {
      await groupStore.getGroupMemberByList(groupId, "group", true);
    }
  };
  return { group, loadMembers };
};

// 合并数据获取逻辑
const fetchUserData = async () => {
  if (isSelf(props.msg.senderId)) {
    return {
      avatar: userStore.userInfo?.avatar ?? "",
      username: "",
    };
  }
  const { group, loadMembers } = useGroupMember(props.msg.roomId);
  await loadMembers();
  const matchedMember = group?.member?.find(
    (member) => member.id === props.msg.senderId
  );
  const isGroupChat = chatStore.currentConversation?.type === "group";
  return {
    avatar: isGroupChat
      ? matchedMember?.avatar ?? ""
      : chatStore.currentConversation?.avatar ?? "",
    username: isGroupChat ? matchedMember?.username ?? "" : "",
  };
};

const avatar = ref("");
const username = ref("");
watch(
  () => props.msg,
  async () => {
    const data = await fetchUserData();
    avatar.value = data.avatar;
    username.value = data.username;
  },
  { immediate: true }
);

const Compo = {
  text: defineAsyncComponent(() => import("./MsgText.vue")),
  image: defineAsyncComponent(() => import("./MsgImage.vue")),
  pdf: defineAsyncComponent(() => import("./MsgPdf.vue")),
};
</script>

<template>
  <div
    class="message flex"
    :class="{
      'flex-row-reverse message-self': isSelf(msg.senderId),
      'message-other': !isSelf(msg.senderId),
    }"
  >
    <AvatarBase :avatar="avatar" :alt="alt" :width="45"></AvatarBase>
    <div class="message-container">
      <div
        v-if="
          chatStore.currentConversation?.type === 'group' &&
          !isSelf(msg.senderId)
        "
        class="username"
      >
        {{ username }}
      </div>
      <div class="message-content" shadow="never">
        <component
          :is="Compo[msg.msgType! as keyof typeof Compo]"
          :msg="msg"
        ></component>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.message {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .message-container {
    display: flex;
    flex-direction: column;
    max-width: 60%;
    margin-right: 12px;
  }

  .username {
    font-size: 16px;
    color: #666;
    padding: 0 8px; // 保持与气泡对齐
  }

  &.message-self {
    flex-direction: row-reverse;

    .message-content {
      margin-left: 0;
      background-color: #daebff;
      border-radius: 8px 16px 4px 8px;
    }
  }

  &.message-other .message-content {
    background-color: white;
  }

  &.message-other .message-container {
    margin-left: 12px;
  }

  .message-content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 12px 16px;
    white-space: normal;
    background: #e0e0e0;
    color: #000;
    border-radius: 16px 8px 8px 4px;
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.199);
  }
}
</style>
