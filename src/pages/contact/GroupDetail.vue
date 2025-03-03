<script setup lang="ts">
import { useUserStore } from "@/store/useUserStore";
import GroupEditDialog from "./GroupEditDialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const useStore = useUserStore();

const groupInfo = ref({
  groupId: "",
  groupOwnerId: "blue123",
  groupName: "",
  avatarFile: "",
  numberCount: 0,
  joinType: 0,
  groupNotice: "",
});

const groupEditDialogRef = ref();
const editGroupInfo = () => {
  groupEditDialogRef.value.showFun(groupInfo.value);
};

// 解散群聊
const dissolutionGroup = () => {
  ElMessageBox.confirm("确认要删除群聊吗？删除后将无法恢复！", "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMessage({
        type: "success",
        message: "删除群聊完成",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除群聊",
      });
    });
};

const leaveGroup = () => {};

const sendMessage = () => {
  router.push({
    path: "/chat",
    query: { chatId: groupInfo.value.groupId, timestamp: new Date().getTime() },
  });
};

onMounted(() => {
  getGroupInfo();
});

const getGroupInfo = () => {
  groupInfo.value = {
    groupId: "群ID",
    groupOwnerId: "blue123",
    groupName: "群组",
    avatarFile: "",
    numberCount: 0,
    joinType: 0,
    groupNotice: "群公告",
  };
};
</script>

<template>
  <ContentPanel>
    <div class="group-info-item">
      <div class="group-title">封面:</div>
      <div class="group-value">
        <Avatar :userId="groupInfo.groupId"></Avatar>
      </div>
      <el-dropdown placement="bottom-end" trigger="click">
        <span class="el-dropdown-link">
          <div class="iconfont icon-icon_more"></div>
        </span>
        <template #dropdown>
          <el-dropdown-menu
            v-if="groupInfo.groupOwnerId == useStore.userInfo.userId"
          >
            <el-dropdown-item @click="editGroupInfo"
              >修改群聊信息</el-dropdown-item
            >
            <el-dropdown-item @click="dissolutionGroup"
              >解散该群</el-dropdown-item
            >
          </el-dropdown-menu>
          <el-dropdown-menu v-else>
            <el-dropdown-item @click="leaveGroup">退出该群</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="group-info-item">
      <div class="group-title">群ID:</div>
      <div class="group-value">{{ groupInfo.groupId }}</div>
    </div>
    <div class="group-info-item">
      <div class="group-title">群名称:</div>
      <div class="group-value">{{ groupInfo.groupName }}</div>
    </div>
    <div class="group-info-item">
      <div class="group-title">群成员:</div>
      <div class="group-value">{{ groupInfo.numberCount }}</div>
    </div>
    <div class="group-info-item">
      <div class="group-title">加入权限:</div>
      <div class="group-value">
        {{ groupInfo.joinType == 0 ? "直接加入" : "管理员同意后加入" }}
      </div>
    </div>
    <div class="group-info-item notice">
      <div class="group-title">公告:</div>
      <div class="group-value">{{ groupInfo.groupNotice || "-" }}</div>
    </div>
    <div class="group-info-item">
      <div class="group-title"></div>
      <div class="group-value">
        <el-button type="primary" @click="sendMessage">发送群消息</el-button>
      </div>
    </div>
  </ContentPanel>
  <GroupEditDialog
    ref="groupEditDialogRef"
    @reloadGroupInfo="getGroupInfo"
  ></GroupEditDialog>
</template>

<style scoped lang="scss">
.group-info-item {
  display: flex;
  align-items: center;
  margin: 15px 0px;
  .group-title {
    width: 100px;
    text-align: right;
    margin-right: 10px;
  }
  .group-value {
    flex: 1;
  }
}

.notice {
  align-items: flex-start;
}
</style>
