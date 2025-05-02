<script setup lang="ts">
  import { useUserStore } from "@/store/useUserStore";
  import { setThemeColor } from "@/util/setTheme";
  import { useSocketStore } from "@/store/useSocketStore";
  import { useFriendStore } from "@/store/useFriendStore";
  import { useGroupStore } from "@/store/userGroupStore";
  import { useChatStore } from "@/store/useChatStore";
  import { accessAuth } from "@/apis/util";
  import { useRouter } from "vue-router";
  import { ElMessage } from "element-plus";
  import MainPage from "@/pages/Main.vue"

  const userStore = useUserStore();
  const friendStore = useFriendStore();
  const groupStore = useGroupStore();
  const socketStore = useSocketStore();
  const chatStore = useChatStore();
  const router = useRouter();

  const isLoading = ref(true);
  const isInitial = ref(false);
  // 新增响应式变量存储错误对象
  const authError = ref<Response | null>(null);

  const THEME_COLORS = {
    primary: "#08bf61",
    secondary: "#129611",
  };

  onMounted(async () => {
    setThemeColor(THEME_COLORS.primary, THEME_COLORS.secondary);
    // app initial
    try {
      // 初始化用户基础信息
      await userStore.getUserInfo();
      // 并行初始化非依赖数据
      await Promise.all([
        friendStore.getBlackList(),
        friendStore.getAllFriend(),
        groupStore.getGroupChatList(),
        chatStore.getSessionList(),
      ]);
      // WebSocket 连接放在最后建立
      await socketStore.socketInitial();
      // 初始化完成
      isInitial.value = true;
      router.replace("/chat");

    } catch (error: Error | any) {
      if (error instanceof Response && error.status === 403) {
        // Handle 403 Forbidden error
        ElMessage.warning("登录状态已过期，请重新登录");
        // 存储错误对象而不是直接调用
        authError.value = error;
      }
    } finally {
      isLoading.value = false;
    }
  });

  const handleReLogin = () => {
    // 当点击按钮时处理存储的错误
    if (authError.value) {
      accessAuth(authError.value);
    }
  };
</script>

<template>
  <center class="initial-page"
          v-if="isInitial === false">
    <div v-loading="isLoading"
         element-loading-background="rgba(255, 255, 255, 0.8)"
         element-loading-text="正在初始化聊天系统...">
      <h1 class="title">欢迎来到在线聊天系统</h1>
      <transition name="el-fade-in">
        <div v-if="!isLoading"
             class="error-panel">
          <el-alert title="初始化失败"
                    type="error"
                    show-icon
                    closable />
          <el-button type="primary"
                     class="retry-btn"
                     @click="handleReLogin">
            前往登录页面
          </el-button>
        </div>
      </transition>
    </div>
  </center>

  <MainPage v-else></MainPage>

</template>

<style scoped>
  .initial-page {
    margin: 0 auto;
    margin-top: 20vh;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    height: 300px;
    width: 90%;
    max-width: 400px;
    background: linear-gradient(135deg, #f8fffe 0%, #e6f7ed 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .title {
    color: v-bind("THEME_COLORS.primary");
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .error-panel {
    padding: 20px;
    text-align: left;
  }

  .retry-btn {
    margin-top: 1rem;
    width: 100%;
  }

  @media (max-width: 480px) {
    .initial-page {
      margin-top: 15vh;
      height: 250px;
    }

    .title {
      font-size: 1.2rem;
    }
  }
</style>
