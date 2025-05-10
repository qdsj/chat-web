<script setup lang="ts">
import { GroupInfo } from "@/types/model/group.type";

defineProps({
  groupInfo: {
    type: Object as PropType<GroupInfo>,
    required: true,
  },
});

const emit = defineEmits(["send-message"]);
</script>

<template>
  <div class="group-info-item">
    <div class="group-title">群名称:</div>
    <div class="group-value">{{ groupInfo.groupName }}</div>
  </div>

  <div class="group-info-item notice" v-if="groupInfo.groupDescription">
    <div class="group-title">群聊描述:</div>
    <div class="group-value">{{ groupInfo.groupDescription }}</div>
  </div>

  <div class="group-info-item">
    <div class="group-button">
      <el-button type="primary" @click="$emit('send-message')">
        发送群消息
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.group-info-item {
  display: flex;
  align-items: center;
  margin: 15px 0px;
  flex-wrap: wrap;
  .group-title {
    text-align: right;
    margin-right: 10px;
    font-size: 18px;
  }
  .group-value {
    flex: 1;
    color: #a2a2a2;
    font-size: 18px;
    .nickname {
      color: #000;
    }
  }
  .group-button {
    flex: 1;
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>
