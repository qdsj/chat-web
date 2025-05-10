<script setup lang="ts">
import GroupEditDialog from "./GroupEditDialog.vue";
import { useRoute, useRouter } from "vue-router";
import { useGroupStore } from "@/store/userGroupStore";
import CreateGroup from "./CreateGroup.vue";
import { I_GetGroupMemberInfoApiResult } from "@/apis/types/group.type";
import { useChatStore } from "@/store/useChatStore";
import GroupActionsDropdown from "./components/GroupActionsDropdown.vue";
import { GroupInfo } from "@/types/model/group.type";
import MemberList from "./components/MemberList.vue";
import GroupDetails from "./components/GroupDetails.vue";

const router = useRouter();
const route = useRoute();
const groupStore = useGroupStore();
const chatStore = useChatStore();

const groupMemberList = ref<I_GetGroupMemberInfoApiResult["data"]>([]);
const showMemberList = ref<I_GetGroupMemberInfoApiResult["data"]>([]);
const groupEditDialogRef = ref();

const props = defineProps({
  roomId: {
    type: String,
  },
});
const emit = defineEmits(["closeDrawer"]);

const mapGroupInfo = (group: any): GroupInfo => ({
  groupId: group.id,
  groupName: group.name,
  avatar: group.avatar,
  userId: group.roomShip.userId,
  userType: group.roomShip.userType,
  groupDescription: group.description,
  type: group.type,
});
const defaultGroupInfo = (): GroupInfo => ({
  groupId: "",
  groupName: "",
  avatar: "",
  userId: "",
  userType: "",
  groupDescription: "",
  type: "group",
});
// 群组信息逻辑
const groupInfo = computed(() => {
  const group = groupStore.getGroupById(
    (route.query.id || props.roomId) as string
  );
  return group ? mapGroupInfo(group) : defaultGroupInfo();
});

// 退出群聊
const leaveGroup = async () => {
  await groupStore.quitGroup(groupInfo.value.groupId, groupInfo.value.type);
  const [_, res] = await groupStore.getGroupMemberByList(
    groupInfo.value.groupId,
    groupInfo.value.type
  );
  showMemberList.value = res!;
};

//TODO 解散群聊
const dissolutionGroup = async () => {
  chatStore.handleConversation({
    id: groupInfo.value.groupId,
    name: groupInfo.value.groupName,
    avatar: groupInfo.value.avatar,
    type: groupInfo.value.type,
    memberCount: groupMemberList.value!.length,
  });
  await groupStore.dissolveGroup(groupInfo.value.groupId, groupInfo.value.type);
  groupStore.groupList = groupStore.groupList.filter(
    (g) => g.id !== groupInfo.value.groupId
  );
  // 跳转到聊天页面
  router.push("/chat");
};

// 成员管理
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
    showMemberList.value = currentGroup.member;
  }
};

// 监听 群聊ID 的变化
watch(
  () => route.query.id || props.roomId,
  async () => {
    await getGroupMember();
  },
  { immediate: true }
);

// 发送群消息
const sendMessage = () => {
  chatStore.handleConversation({
    id: groupInfo.value.groupId,
    name: groupInfo.value.groupName,
    avatar: groupInfo.value.avatar,
    type: groupInfo.value.type,
    memberCount: groupMemberList.value!.length,
  });
  emit("closeDrawer"); // 触发关闭抽屉事件
  // 跳转到聊天页面
  router.push("/chat");
};

const selectedIds = ref<string[]>([]);
const addMemberDialog = ref(false);
const updateMemberDialog = (data: boolean) => {
  addMemberDialog.value = data;
};
// 添加群成员
const handleAddmember = async () => {
  addMemberDialog.value = true;
  await getGroupMember();
  selectedIds.value = groupMemberList.value!.map((item) => item.id);
};

// 群主踢除群成员
const memberListRef = ref();
const handleRemoveMember = async (selectedMemberId: string) => {
  if (selectedMemberId) {
    showMemberList.value = groupMemberList.value.filter(
      (m) => m.id !== selectedMemberId
    );
    await groupStore.kickMember(
      groupInfo.value.groupId,
      selectedMemberId,
      groupInfo.value.type
    );
    const [_, res] = await groupStore.getGroupMemberByList(
      groupInfo.value.groupId,
      groupInfo.value.type
    );
    showMemberList.value = res!;
    // 调用子组件方法关闭菜单
    memberListRef.value?.closeMenu();
  }
};

// 搜索功能
const searchMember = ref();
const handleSearch = () => {
  groupStore.searchGroupMember(
    (route.query.id || props.roomId) as string,
    searchMember.value
  );
  showMemberList.value = groupStore.isSearching
    ? groupStore.groupMemberList
    : groupMemberList.value;
};
</script>

<template>
  <ContentPanel>
    <div class="group-info-input">
      <el-input
        v-model="searchMember"
        placeholder="搜索群成员"
        @keyup="handleSearch"
      >
        <template #prefix>
          <span class="iconfont icon-search"></span>
        </template>
      </el-input>

      <!-- 操作菜单组件 -->
      <GroupActionsDropdown
        :group-info="groupInfo"
        @edit-info="groupEditDialogRef.showFun(groupInfo)"
        @dissolve-group="dissolutionGroup"
        @leave-group="leaveGroup"
      />
    </div>

    <!-- 群成员列表组件 -->
    <MemberList
      ref="memberListRef"
      :members="showMemberList"
      :is-searching="groupStore.isSearching"
      :group-info="groupInfo"
      @add-member="handleAddmember"
      @remove-member="handleRemoveMember"
    />

    <!-- 群信息展示组件 -->
    <GroupDetails :group-info="groupInfo" @send-message="sendMessage" />
  </ContentPanel>

  <CreateGroup
    v-if="selectedIds.length"
    :dialogListVisible="addMemberDialog"
    @updateDialogListVisible="updateMemberDialog"
    :selectedIds="selectedIds"
    :roomId="groupInfo.groupId"
    :type="groupInfo.type"
  ></CreateGroup>

  <!-- 编辑群信息 -->
  <GroupEditDialog
    ref="groupEditDialogRef"
    @reloadGroupInfo="getGroupMember"
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

.notice {
  align-items: flex-start;
}
</style>
