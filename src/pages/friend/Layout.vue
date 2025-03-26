<script setup lang="ts">
import LeftContent from "./components/LeftContent.vue";
</script>

<template>
  <Layout>
    <!-- 左边 -->
    <template #left-content>
      <LeftContent />
    </template>
    <!-- 右边 -->
    <template #right-content>
      <!-- header -->
      <header class="friend-layout-header"></header>
      <router-view v-slot="{ Component }">
        <component :is="Component" ref="componentRef"></component>
      </router-view>
    </template>
  </Layout>
</template>

<style scoped lang="scss">
.friend-layout-header {
  height: 80px;
}
</style>
