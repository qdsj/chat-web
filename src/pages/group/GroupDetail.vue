<script setup lang="ts">
import GroupEditDialog from "./GroupEditDialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useGroupStore } from "@/store/userGroupStore";
import CreateGroup from "./CreateGroup.vue";
import { I_GetGroupMemberInfoApiResult } from "@/apis/types/group.type";
import { useChatStore } from "@/store/useChatStore";
import { ConversationType } from "@/types/model/chat.type";
import AvatarBase from "@/components/AvatarBase.vue";
import ContextMenu from "../chat/components/ContextMenu.vue";
import { useUserStore } from "@/store/useUserStore";
import Avatar from "@/components/Avatar.vue";

const router = useRouter();
const route = useRoute();
const groupStore = useGroupStore();
const chatStore = useChatStore();
const userStore = useUserStore();

const groupMemberList = ref<I_GetGroupMemberInfoApiResult["data"]>([]);

const props = defineProps({
  roomId: {
    type: String,
  },
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

interface GroupInfo {
  groupId: string;
  groupName: string;
  avatar: string;
  userId: string;
  userType: string;
  groupDescription: string;
  type: ConversationType;
}

const groupInfo = ref<GroupInfo>({
  groupId: "",
  groupName: "",
  avatar: "",
  userId: "",
  userType: "",
  groupDescription: "",
  type: "group",
});

const updateGroupInfo = () => {
  const group = groupStore.getGroupById(
    (route.query.id || props.roomId) as string
  );
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
    userId: userId,
    groupName: name,
    avatar: avatar,
    userType: userType,
    groupDescription: description,
    type: type,
  };
};
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

const processedList = ref<I_GetGroupMemberInfoApiResult["data"]>([]);

// 监听 route.query.id 的变化
watch(
  () => route.query.id || props.roomId,
  async () => {
    await updateGroupInfo();
    await getGroupMember();
    if (groupStore.isSearching) {
      processedList.value = groupStore.groupMemberList;
    } else {
      processedList.value = groupMemberList.value;
    }
  },
  { immediate: true }
);
const emit = defineEmits(["closeDrawer"]);
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

// 右键菜单状态
const showMenu = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const selectedMemberId = ref<string | null>(null);

const currentComponent = computed(() =>
  groupStore.isSearching ? Avatar : AvatarBase
);

// 右键点击处理
const handleRightClick = (event: MouseEvent, memberId: string) => {
  // 权限校验：非群主或点击自己时阻止菜单显示
  if (
    userStore.userInfo?.id === memberId ||
    groupInfo.value.userType !== "owner"
  ) {
    showMenu.value = false; // 强制关闭可能残留的菜单[1,3](@ref)
    return;
  }
  nextTick(() => {
    selectedMemberId.value = memberId;
    menuPosition.value = {
      x: event.clientX,
      y: event.clientY,
    };
    showMenu.value = true;
  });
};

// 菜单项配置
const menuItems = [
  {
    label: "从群聊中移除",
    action: () => {
      ElMessageBox.confirm("确定要移除该群成员吗？", "Warning", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (selectedMemberId.value) {
            groupMemberList.value = groupMemberList.value.filter(
              (m) => m.id !== selectedMemberId.value
            );
            showMenu.value = false;
          }
          ElMessage({
            type: "success",
            message: "移除群成员成功",
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消移除该成员",
          });
          showMenu.value = false;
        });
    },
  },
];

const searchMember = ref();
// 搜索好友 or 群聊
const search = () => {
  groupStore.searchGroupMember(
    (route.query.id || props.roomId) as string,
    searchMember.value
  );
};

// 监听搜索状态变化，清空搜索框
watch(
  () => groupStore.isSearching,
  () => {
    if (groupStore.isSearching === false) {
      searchMember.value = "";
    }
    if (groupStore.isSearching) {
      processedList.value = groupStore.groupMemberList;
    } else {
      processedList.value = groupMemberList.value;
    }
  }
);
</script>

<template>
  <ContentPanel>
    <div class="group-info-input">
      <el-input v-model="searchMember" placeholder="搜索群成员" @keyup="search">
        <template #prefix>
          <span class="iconfont icon-search"></span>
        </template>
      </el-input>
      <el-dropdown placement="bottom-end" trigger="click">
        <span class="el-dropdown-link">
          <div class="iconfont icon-icon_more"></div>
        </span>
        <template #dropdown>
          <el-dropdown-menu v-if="groupInfo.userType === 'owner'">
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
        v-for="item in processedList"
        :key="item.id"
        class="grid-container"
        @contextmenu.prevent="
          !groupStore.isSearching && handleRightClick($event, item.id)
        "
      >
        <component
          :is="currentComponent"
          :avatar="item.avatar"
          :username="item.username"
          :user-id="item.id"
          :email="item.email"
          :width="50"
        />
        <div class="nickname">{{ item.username }}</div>
      </div>

      <!-- 单例菜单 -->
      <div v-show="showMenu">
        <ContextMenu
          :menu-items="menuItems"
          :position="menuPosition"
          :visible="showMenu"
          @update:visible="showMenu = $event"
        />
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
    justify-items: center; /* 单元格内水平居中 */
    align-items: center; /* 单元格内垂直居中 */
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
