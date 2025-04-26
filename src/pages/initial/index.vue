<script setup lang="ts">
  import { useUserStore } from "@/store/useUserStore";
  import { setThemeColor } from "@/util/setTheme";
  import { useSocketStore } from "@/store/useSocketStore";
  import { useFriendStore } from "@/store/useFriendStore";
  import { useGroupStore } from "@/store/userGroupStore";
  import { useChatStore } from "@/store/useChatStore";
  import { accessAuth } from "@/apis/util";
  import { useRouter } from "vue-router";
  const userStore = useUserStore();
  const friendStore = useFriendStore();
  const groupStore = useGroupStore();
  const socketStore = useSocketStore();
  const chatStore = useChatStore();
  const router = useRouter();

  // const isLoading = ref(true);

  onMounted(async () => {
    setThemeColor("#08bf61", "#129611");
    // app initial
    try {
      await userStore.getUserInfo();
      await friendStore.getBlackList(); // 获取拉黑列表
      await friendStore.getAllFriend(); // 请求好友列表
      await groupStore.getGroupChatList(); // 请求群聊列表
      await socketStore.socketInitial();
      await chatStore.getSessionList();

      // redirect to chat page
      router.push('/chat');
    } catch (error: Error | any) {
      if (error instanceof Response && error.status === 403) {
        // Handle 403 Forbidden error
        console.error("Access denied. Please check your permissions.");
        // 弹框 确认是否登录
        accessAuth(error);
      }
    }

  });
</script>

<template>
  <center class="initial-page">
    <div>
      <h1 class="title">Welcome to Chat App</h1>
      <p class="description">Your chat application is loading...</p>
    </div>
  </center>
</template>

<style scoped>

  .initial-page {
    margin: 0 auto;
    margin-top: 20vh;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    height: 300px;
    width: 400px;
    background-color: tan;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
