<script setup lang="ts">
import { useFriendStore } from "@/store/useFriendStore";
import { ConversationType } from "@/types/model/chat.type";
// @ts-ignore
import ContactInfo from "./components/FriendInfo.vue";
import { useChatStore } from "@/store/useChatStore";
import { useGroupStore } from "@/store/userGroupStore";
import router from "@/router";
import { useUserStore } from "@/store/useUserStore";
import ContactListPanel from "./components/LeftFriendList.vue";
import RightSelectedList from "./components/RightSelectedList.vue";
const friendStore = useFriendStore();
const chatStore = useChatStore();
const groupStore = useGroupStore();
const userStore = useUserStore();

const props = defineProps({
  dialogListVisible: {
    type: Boolean,
    default: false,
  },
  selectedIds: {
    type: Array,
    default: [],
  },
  roomId: {
    type: String,
    default: "",
  },
  type: {
    type: String as PropType<ConversationType>,
    default: "group",
  },
});

const emits = defineEmits(["updateDialogListVisible", "update:memberList"]);

// 搜索好友 or 群聊
const handleSearch = (searchKey: string) => {
  friendStore.searchGroupFriend(searchKey);
};

const originalIds = ref<string[]>(props.selectedIds as string[]);
const newSelectedIds = ref<string[]>([]);

watch(
  () => props.selectedIds,
  (newVal) => {
    originalIds.value = newVal as string[];
  },
  { immediate: true }
);

const selectedContacts = computed(() => {
  return friendStore.friendList.filter(
    (contact) =>
      newSelectedIds.value.includes(contact.id) &&
      !originalIds.value.includes(contact.id)
  );
});
const removeContact = (id: string) => {
  if (!originalIds.value.includes(id)) {
    newSelectedIds.value = newSelectedIds.value.filter((item) => item !== id);
  }
};

const handleDialogClose = () => {
  emits("updateDialogListVisible", false);
  newSelectedIds.value = [];
};
const finallySelectIds = computed(() => [
  ...originalIds.value,
  ...newSelectedIds.value,
  ...(originalIds.value.includes(userStore.userInfo!.id)
    ? []
    : [userStore.userInfo!.id]),
]);

const handleConfirm = async () => {
  try {
    let data = null;

    // 判断逻辑改为基于 roomId 是否存在
    if (props.roomId) {
      // 添加群成员场景：当有 roomId 且选择了新成员
      if (newSelectedIds.value.length > 0) {
        await groupStore.addGroupMember(
          props.roomId,
          newSelectedIds.value,
          props.type
        );
        data = await groupStore.getGroupById(props.roomId);
        const [_, res] = await groupStore.getGroupMemberByList(
          data!.id,
          props.type
        );
        emits("update:memberList", res);
      }
    } else {
      // 创建群聊场景：使用最终合并的成员列表（包含原始+新增+自己）
      const idsToCreate = finallySelectIds.value;
      if (idsToCreate.length > 0) {
        data = await groupStore.createGroupChat(idsToCreate);
        await groupStore.getGroupChatList();
      }
    }

    if (data) {
      chatStore.handleConversation({
        id: data.id,
        name: data.name,
        avatar: data.avatar || "",
        type: props.type,
        memberCount: finallySelectIds.value.length,
      });
      if (chatStore.currentConversation) {
        chatStore.currentConversation.memberCount =
          finallySelectIds.value.length;
      }
    }

    handleDialogClose();
    router.push("/chat");
  } catch (error) {
    console.error("[handleConfirm] 操作失败:", error);
  }
};

const friendList = computed(() => {
  if (friendStore.isSearchingGroupFriend) {
    return friendStore.searchGroupFriendList;
  } else {
    return friendStore.friendList;
  }
});
</script>

<template>
  <el-dialog
    :model-value="dialogListVisible"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div class="contact-container">
      <!-- 左侧联系人列表 -->
      <ContactListPanel
        :friend-list="friendList"
        :original-ids="originalIds"
        :new-selected-ids="newSelectedIds"
        @update:selected-ids="(ids:string[]) =>  (newSelectedIds = ids) "
        @search="handleSearch"
      />
      <!-- 右侧已选列表 -->
      <RightSelectedList
        :selected-contacts="selectedContacts"
        @remove-contact="removeContact"
      />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确认</el-button>
        <el-button @click="handleDialogClose">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.contact-container {
  display: flex;
  height: 600px;
  width: 100%;

  .remove-btn {
    margin-left: auto;
    color: #666;
    cursor: pointer;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 50px;
}

.left-panel,
.right-panel {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  .title {
    font-size: 16px;
    padding-bottom: 10px;
  }
  .search-box {
    .el-input {
      height: 35px;
    }
  }
}

.left-panel {
  border-right: 1px solid #d2d2d2;
}

.contact-list,
.selected-list {
  max-height: 70vh;
  overflow-y: auto;
  .name {
    font-size: 16px;
    margin-left: 10px;
  }
}

.contact-item,
.selected-item {
  display: flex;
  align-items: center;
  padding: 12px;
}

/* 隐藏原生复选框 */
.circle-checkbox {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 50%; /* 圆形 */
  cursor: pointer;
  position: relative;
  margin-right: 10px;
}

/* 选中状态 */
.circle-checkbox:checked {
  background-color: #07c160;
  border-color: #07c160;
}

/* 选中时的内部标记（可选） */
.circle-checkbox:checked::after {
  content: "";
  position: absolute;
  top: 35%; /* 微调定位使对勾居中 */
  left: 50%;
  width: 12px;
  height: 6px;
  background: transparent;
  border: 2px solid white;
  border-top: none;
  border-right: none;
  transform: translate(-50%, -50%) rotate(-45deg);
}
</style>
