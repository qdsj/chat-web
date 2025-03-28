<script setup lang="ts">
import { useFriendStore } from "@/store/useFriendStore";
// @ts-ignore
import ContactInfo from "./ContactInfo.vue";
const friendStore = useFriendStore();

defineProps({
  dialogListVisible: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["updateDialogListVisible"]);

const searchKey = ref("");

// 搜索好友 or 群聊
const search = () => {
  console.log(searchKey.value);
};

const selectedIds = ref<(string | number)[]>([]);
const selectedContacts = computed(() => {
  return friendStore.friendList.filter((contact) =>
    selectedIds.value.includes(contact.id)
  );
});
const removeContact = (id: string | number) => {
  selectedIds.value = selectedIds.value.filter((item) => item !== id);
};

const handleDialogClose = () => {
  emits("updateDialogListVisible", false);
  selectedIds.value = [];
};

const handleConfirm = () => {
  handleDialogClose();
};
</script>

<template>
  <el-dialog
    :model-value="dialogListVisible"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div class="contact-container">
      <!-- 修改后的左侧联系人列表 -->
      <div class="left-panel">
        <div class="title">选择联系人</div>
        <div class="search-box">
          <el-input
            clearable
            placeholder="搜索联系人"
            v-model="searchKey"
            size="large"
            @keyup="search"
          >
            <template #suffix>
              <span class="iconfont icon-search"></span>
            </template>
          </el-input>
        </div>
        <ul class="contact-list">
          <li
            v-for="contact in friendStore.friendList"
            :key="contact.id"
            class="contact-item"
          >
            <input
              type="checkbox"
              :value="contact.id"
              v-model="selectedIds"
              class="circle-checkbox"
            />
            <ContactInfo :contact="contact" />
          </li>
        </ul>
      </div>

      <!-- 修改后的右侧已选列表 -->
      <div class="right-panel">
        <div class="title">已选择 {{ selectedContacts.length }} 个联系人</div>
        <ul class="selected-list">
          <li
            v-for="contact in selectedContacts"
            :key="contact.id"
            class="selected-item"
          >
            <ContactInfo :contact="contact" />
            <span class="remove-btn" @click="removeContact(contact.id)">×</span>
          </li>
        </ul>
      </div>
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
