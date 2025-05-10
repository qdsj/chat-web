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
const avatar = ref("");
async function fetchAvatar() {
  if (isSelf(props.msg.senderId)) {
    return userStore.userInfo?.avatar ?? "";
  } else {
    let targetAvatar = "";
    let currentGroup = groupStore.groupList.find(
      (item) => item.id === props.msg.roomId
    );
    if (currentGroup && !currentGroup.member) {
      const roomType = "group";
      await groupStore.getGroupMemberByList(props.msg.roomId, roomType);

      const matchedMember = groupStore.groupList
        .flatMap((group) => group.member)
        .filter((member) => member !== undefined) // 过滤无效成员
        .find((member) => member.id === props.msg.senderId);
      targetAvatar = matchedMember ? matchedMember?.avatar : "";
    } else {
      targetAvatar = chatStore.currentConversation?.avatar ?? "";
    }

    return targetAvatar;
  }
}
watch(
  () => props.msg,
  async () => {
    avatar.value = await fetchAvatar();
  },
  { immediate: true }
);

const alt = computed(() => {
  if (isSelf(props.msg.senderId)) {
    return userStore.userInfo?.username;
  } else {
    return chatStore.currentConversation?.name;
  }
});

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
    <AvatarBase :avatar="avatar" :alt="alt"></AvatarBase>
    <div class="message-content" shadow="never">
      <component
        :is="Compo[msg.msgType! as keyof typeof Compo]"
        :msg="msg"
      ></component>
    </div>
    <!-- <i v-if="isSelf(msg.senderId)" class="iconfont icon-fail"></i> -->
  </div>
</template>

<style scoped lang="scss">
.message {
  display: flex;
  align-items: flex-end;
  margin-bottom: 20px;

  .iconfont {
    font-size: 28px;
    color: #ff3d3d;
  }

  &.message-self {
    flex-direction: row-reverse;

    .message-content {
      margin-right: 12px;
      margin-left: 0;
      background-color: #daebff;
      border-radius: 8px 16px 4px 8px;
    }
  }

  &.message-other .message-content {
    margin-left: 12px;
    background-color: white;
  }

  .message-content {
    max-width: 60%;
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
