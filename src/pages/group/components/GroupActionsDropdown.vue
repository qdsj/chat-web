<!-- components/group/GroupActionsDropdown.vue -->
<script setup lang="ts">
import { GroupInfo } from "@/types/model/group.type";
import { ElMessage, ElMessageBox } from "element-plus";

defineProps({
  groupInfo: {
    type: Object as PropType<GroupInfo>,
    required: true,
  },
});

const emit = defineEmits(["edit-info", "dissolve-group", "leave-group"]);

const handleAction = (action: "edit" | "dissolve" | "leave") => {
  switch (action) {
    case "edit":
      emit("edit-info");
      break;
    case "dissolve":
      confirmAction("确认要删除群聊吗？删除后将无法恢复！", "dissolve-group");
      break;
    case "leave":
      confirmAction("确认要退出该群聊吗？", "leave-group");
      break;
  }
};
type EventType = "edit-info" | "dissolve-group" | "leave-group";
const confirmAction = (message: string, eventName: EventType) => {
  ElMessageBox.confirm(message, "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => emit(eventName))
    .catch(() => ElMessage.info("操作已取消"));
};
</script>

<template>
  <el-dropdown placement="bottom-end" trigger="click">
    <span class="el-dropdown-link">
      <div class="iconfont icon-icon_more"></div>
    </span>
    <template #dropdown>
      <el-dropdown-menu v-if="groupInfo.userType === 'owner'">
        <el-dropdown-item @click="handleAction('edit')"
          >修改群聊信息</el-dropdown-item
        >
        <el-dropdown-item @click="handleAction('dissolve')"
          >解散该群</el-dropdown-item
        >
      </el-dropdown-menu>
      <el-dropdown-menu v-else>
        <el-dropdown-item @click="handleAction('leave')"
          >退出该群</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
