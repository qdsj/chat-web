<script setup lang="ts">
defineProps({
  userInfo: {
    type: Object,
    default: {},
  },
  showArea: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: 80,
  },
  showDetail: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="user-panel">
    <AvatarBase
      :width="width"
      :alt="`${userInfo.username}`"
      :avatar="userInfo.avatar"
    ></AvatarBase>
    <div class="user-info">
      <div class="nick-name">
        {{ userInfo.username }}
        <span class="iconfont icon-icon-woman" v-if="userInfo.sex == 0"></span>
        <span class="iconfont icon-icon-man" v-if="userInfo.sex == 1"></span>
      </div>
      <div class="info">Email: {{ userInfo.email }}</div>
      <div class="info">
        <!-- 地区: {{ getAreaInfo(userInfo.areaName) }} -->
        地区: 广州
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-panel {
  display: flex;
  margin: 5px;
  .user-info {
    flex: 1;
    margin-left: 10px;
    .nick-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #000;
      font-size: 18px;
      .iconfont {
        font-size: 16px;
      }
      .icon-man {
        color: #2cb6fe;
      }
      .icon-woman {
        color: #fb7373;
      }
    }
    .info {
      font-size: 16px;
      color: #9e9e9e;
      margin-top: 3px;
    }
  }
}
</style>
