<script setup lang="ts">
import { useUserStore } from "@/store/useUserStore";
import GroupEditDialog from "./GroupEditDialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useGroupStore } from "@/store/userGroupStore";
import { I_GetGroupMemberInfoApiResult } from "@/apis/types/group.type";

const router = useRouter();
const route = useRoute();
const useStore = useUserStore();
const groupStore = useGroupStore();

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

const groupInfo = ref({
  groupId: "",
  groupOwnerId: "",
  groupName: "",
  avatar: "",
  userType: "",
  groupDescription: "",
  type: "",
});

const updateGroupInfo = () => {
  const group = groupStore.getGroupById(route.query.id as string);
  if (!group) return;
  const {
    id,
    name,
    avatar,
    description,
    type,
    roomShip: { userId, userType },
  } = group;
  groupInfo.value = {
    groupId: id,
    groupOwnerId: userId,
    groupName: name,
    avatar: avatar,
    userType: userType,
    groupDescription: description,
    type: type,
  };
};

const groupMemberList = ref<I_GetGroupMemberInfoApiResult["data"]>();
const getGroupMember = async () => {
  const [_, data] = await groupStore.getGroupMemberInfo(
    groupInfo.value.groupId,
    groupInfo.value.type
  );
  groupMemberList.value = data;
};

onMounted(async () => {
  updateGroupInfo();
  getGroupMember();
});

// 监听 route.query.id 的变化
watch(
  () => route.query.id,
  () => {
    updateGroupInfo();
    getGroupMember();
  }
);

const searchMember = ref();
</script>

<template>
  <ContentPanel>
    <div class="group-info-input">
      <el-input v-model="searchMember" placeholder="搜索群成员">
        <template #prefix>
          <span class="iconfont icon-search"></span>
        </template>
      </el-input>
      <el-dropdown placement="bottom-end" trigger="click">
        <span class="el-dropdown-link">
          <div class="iconfont icon-icon_more"></div>
        </span>
        <template #dropdown>
          <el-dropdown-menu
            v-if="groupInfo.groupOwnerId == useStore.userInfo!.id"
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
      <div
        class="grid-container"
        v-for="item in groupMemberList"
        :key="item.id"
      >
        <Avatar
          :userId="item.id"
          :username="item.username"
          :width="50"
        ></Avatar>
        <div class="nickname">{{ item.username }}</div>
      </div>
    </div>
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
        <el-button type="primary" @click="sendMessage">发送群消息</el-button>
      </div>
    </div>
  </ContentPanel>
  <GroupEditDialog
    ref="groupEditDialogRef"
    @reloadGroupInfo="updateGroupInfo"
  ></GroupEditDialog>
</template>

<style scoped lang="scss">
.group-info-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  .el-input {
    width: 80%;
  }
}
.group-info-item {
  display: flex;
  align-items: center;
  margin: 15px 0px;
  .grid-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-right: 30px;
    &:last-child {
      margin-right: 0;
    }
  }
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

.notice {
  align-items: flex-start;
}
</style>
