<script setup lang="ts">
  import { useChatStore } from "@/store/useChatStore";
  import { useUserStore } from "@/store/useUserStore";
  import { Message } from "@/types/model/chat.type";

  const chatStore = useChatStore();
  const userStore = useUserStore();

  const props = defineProps<{
    msg: Message;
  }>();
  const isSelf = (sender: string) => {
    return sender === userStore.userInfo!.id;
  };

  const avatar = computed(() => {
    if (isSelf(props.msg.senderId)) {
      return userStore.userInfo?.avatar;
    } else {
      return chatStore.currentConversation?.avatar;
    }
  });

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
  }

</script>

<template>
  <div class="msg-item-container message flex "
       :class="{
        'flex-row-reverse message-self': isSelf(msg.senderId),
        'message-other': !isSelf(msg.senderId)
      }">
    <AvatarBase :avatar="avatar"
                :alt="alt"></AvatarBase>
    <div class="message-content"
         shadow="never">
      <component :is="Compo[msg.msgType! as keyof typeof Compo]"
                 :msg="msg"></component>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .msg-item-container {}

  .message {
    display: flex;
    align-items: flex-end;
    margin-bottom: 20px;

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
