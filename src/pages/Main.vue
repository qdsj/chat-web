<script setup lang="ts">
import Avatar from "@/components/Avatar.vue";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/store/useUserStore";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 图标菜单列表
const menuList = ref([
  {
    name: "chat",
    icon: "icon-chat",
    path: "/chat",
    countKey: "chatCount",
    position: "top",
  },
  {
    name: "contact",
    icon: "icon-user",
    path: "/contact",
    countKey: "contactApplyCount",
    position: "top",
  },
  {
    name: "mysetting",
    icon: "icon-more2",
    path: "/setting",
    position: "bottom",
  },
]);

// 切换菜单
interface MenuItem {
  name: string;
  icon: string;
  path: string;
  countKey?: string;
  position: string;
}
const currentMenu = ref(menuList.value[0]);
const changeMenu = (item: MenuItem) => {
  currentMenu.value = item;
  router.push(item.path);
};
onMounted(() => {
  const currentPath = route.path;
  const foundMenu = menuList.value.find((item) =>
    currentPath.startsWith(item.path)
  );
  currentMenu.value = foundMenu || menuList.value[0];
});
</script>

<template>
  <div class="main">
    <!-- 左边 -->
    <div class="left-sider">
      <!-- 头像 -->
      <Avatar :userId="userStore.userInfo!.id"></Avatar>
      <!-- 菜单列表 -->
      <div class="menu-list">
        <template v-for="item in menuList">
          <div
            :class="[
              'tab-item iconfont',
              item.icon,
              item.path == currentMenu.path ? 'active' : '',
            ]"
            v-if="item.position == 'top'"
            @click="changeMenu(item)"
          ></div>
        </template>
      </div>
      <div class="menu-list menu-bottom">
        <template v-for="item in menuList">
          <div
            :class="[
              'tab-item iconfont',
              item.icon,
              item.path == currentMenu.path ? 'active' : '',
            ]"
            v-if="item.position == 'bottom'"
            @click="changeMenu(item)"
          ></div>
        </template>
      </div>
    </div>
    <!-- 右边 -->
    <div class="right-container">
      <router-view v-slot="{ Component }">
        <keep-alive include="chat">
          <component :is="Component" ref="componentRef"></component>
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  background: #ddd;
  display: flex;
  border-radius: 0px 3px 3px 0px;
  overflow: hidden;
  .left-sider {
    width: 80px;
    background-color: #2e2e2e;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 35px;
    border: 1px solid #2e2e2e;
    border-right: none;
    padding-bottom: 10px;
    .menu-list {
      width: 100%;
      flex: 1;
      .tab-item {
        color: #d3d3d3;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 36px;
        cursor: pointer;
        font-size: 36px;
        position: relative;
      }
      .active {
        color: #07c160;
      }
    }
    .menu-bottom {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
  }
  .right-container {
    flex: 1;
    overflow: hidden;
    border: 1px solid #ddd;
    border-left: none;
  }
}

.popover-user-panel {
  padding: 10px;
  .popover-user {
    display: flex;
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
  }
  .send-message {
    margin-top: 10px;
    text-align: center;
    padding: 20px 0px 0px 0px;
  }
}
</style>
