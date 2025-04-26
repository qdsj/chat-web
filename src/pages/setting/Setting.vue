<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

// 设置列表
const settingMenuList = ref([
  {
    name: "账号设置",
    icon: "icon-HG-icon-user-settings-line",
    path: "/setting/userinfo",
    bgColor: "#0294f5",
  },
  {
    name: "文件管理",
    icon: "icon-icon-folder",
    path: "/setting/fileManage",
    bgColor: "#ffd04f",
  },
  {
    name: "关于我们",
    icon: "icon-icon-about",
    path: "/setting/about",
    bgColor: "#08bf61",
  },
]);

const jump = (item: any) => {
  router.push(item.path);
};
</script>

<template>
  <Layout>
    <!-- 左侧 -->
    <template #left-content>
      <div class="title-panel">设置</div>
      <div class="menu-list">
        <div
          v-for="item in settingMenuList"
          :class="['menu-item', route.path == item.path ? 'menu-active' : '']"
          @click="jump(item)"
        >
          <div
            :class="['iconfont', item.icon]"
            :style="{ background: item.bgColor }"
          ></div>
          <div class="menu-name">{{ item.name }}</div>
        </div>
      </div>
    </template>
    <!-- 右侧 -->
    <template #right-content>
      <div class="title-panel"></div>
      <router-view v-slot="{ Component }">
        <component :is="Component" ref="component"></component>
      </router-view>
    </template>
  </Layout>
</template>

<style scoped lang="scss">
.title-panel {
  height: 60px;
  background: #f7f7f7;
  text-align: center;
  line-height: 60px;
  font-size: 20px;
}
.menu-list {
  border-top: 1px solid #ddd;
  .menu-item {
    display: flex;
    align-items: center;
    padding: 10px;
    &:hover {
      cursor: pointer;
      background: #d6d6d6;
    }
    .iconfont {
      font-size: 20px;
      width: 45px;
      height: 45px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .menu-name {
      color: #000;
      margin-left: 10px;
      flex: 1;
      font-size: 18px;
    }
  }
  .menu-active {
    background: #c4c4c4;
    &:hover {
      background: #c4c4c4;
    }
  }
}
</style>
