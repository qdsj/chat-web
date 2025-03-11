<script setup lang="ts">
import { getAreaInfo } from "@/util/utils.ts";

defineProps({
  userInfo: {
    type: Object,
    default: {},
  },
  showArea: {
    type: Boolean,
    default: true,
  },
  width: {
    type: Number,
    default: 80,
  },
});
</script>

<template>
  <div class="user-panel">
    <AvatarBase
      :userId="userInfo.userId || userInfo.contactId"
      :width="width"
      :borderRadius="5"
      :showDetail="true"
    ></AvatarBase>
    <div class="user-info">
      <div class="nick-name">
        {{ userInfo.nickName }}
        <span class="iconfont icon-icon-woman" v-if="userInfo.sex == 0"></span>
        <span class="iconfont icon-icon-man" v-if="userInfo.sex == 1"></span>
      </div>
      <div class="info">ID: {{ userInfo.userId || userInfo.contactId }}</div>
      <div class="info" v-if="showArea">
        地区: {{ getAreaInfo(userInfo.areaName) }}
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
