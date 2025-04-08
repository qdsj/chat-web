<script setup lang="ts">
import { useUserStore } from "@/store/useUserStore";
import GroupEditDialog from "./GroupEditDialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useGroupStore } from "@/store/userGroupStore";
import CreateGroup from "./CreateGroup.vue";
import { I_GetGroupMemberInfoApiResult } from "@/apis/types/group.type";
import { useChatStore } from "@/store/useChatStore";
import { ConversationType } from "@/types/model/chat.type";

const router = useRouter();
const route = useRoute();
const useStore = useUserStore();
const groupStore = useGroupStore();
const chatStore = useChatStore();

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

interface GroupInfo {
  groupId: string;
  groupOwnerId: string;
  groupName: string;
  avatar: string;
  userType: string;
  groupDescription: string;
  type: ConversationType;
}

const groupInfo = ref<GroupInfo>({
  groupId: "",
  groupOwnerId: "",
  groupName: "",
  avatar: "",
  userType: "",
  groupDescription: "",
  type: "group",
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
  let currentGroup = groupStore.groupList.find(
    (item) => item.id === groupInfo.value.groupId
  );
  if (currentGroup && !currentGroup.member) {
    await groupStore.getGroupMemberByList(
      groupInfo.value.groupId,
      groupInfo.value.type
    );
  }

  if (currentGroup && currentGroup.id === groupInfo.value.groupId) {
    groupMemberList.value = currentGroup.member;
  }
};

onMounted(async () => {
  await groupStore.getGroupChatList();
  await updateGroupInfo();
  await getGroupMember();
});

// 监听 route.query.id 的变化
watch(
  () => route.query.id,
  async () => {
    await updateGroupInfo();
    await getGroupMember();
  }
);

const sendMessage = () => {
  chatStore.handleConversation({
    id: groupInfo.value.groupId,
    name: groupInfo.value.groupName,
    avatar: "",
    type: groupInfo.value.type,
    memberCount: groupMemberList.value!.length,
  });

  // 跳转到聊天页面
  router.push("/chat");
};

const selectedIds = ref<string[]>([]);
const addMemberDialog = ref(false);
const updateMemberDialog = (data: boolean) => {
  addMemberDialog.value = data;
};
const handleAddmember = async () => {
  addMemberDialog.value = true;
  await getGroupMember();
  selectedIds.value = groupMemberList.value!.map((item) => item.id);
};

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
      <div class="grid-container">
        <div class="iconfont icon-add" @click="handleAddmember"></div>
        <div class="nickname">{{ "添加" }}</div>
      </div>
    </div>
    <CreateGroup
      v-if="selectedIds.length"
      :dialogListVisible="addMemberDialog"
      @updateDialogListVisible="updateMemberDialog"
      :selectedIds="selectedIds"
      :roomId="groupInfo.groupId"
      :type="groupInfo.type"
    ></CreateGroup>
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
  flex-wrap: wrap;
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    margin-bottom: 30px;
    .iconfont {
      width: 50px;
      height: 50px;
      border: 1px solid #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
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
