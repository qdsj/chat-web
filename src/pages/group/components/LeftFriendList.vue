<script setup lang="ts">
import { useFriendStore } from "@/store/useFriendStore";
import FriendInfo from "./FriendInfo.vue";

const friendStore = useFriendStore();

const props = defineProps<{
  friendList: any[];
  originalIds: string[];
  newSelectedIds: string[];
}>();

const emit = defineEmits(["update:selected-ids", "search"]);

const searchKey = ref<string>("");

const handleCheckboxChange = (id: string, event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked;
  const updatedIds = isChecked
    ? [...props.newSelectedIds, id]
    : props.newSelectedIds.filter((item) => item !== id);
  emit("update:selected-ids", updatedIds);
};

// 监听搜索状态变化，清空搜索框
watch(
  () => friendStore.isSearchingGroupFriend,
  () => {
    if (friendStore.isSearchingGroupFriend === false) {
      searchKey.value = "";
    }
  }
);
</script>

<template>
  <div class="left-panel">
    <div class="title">选择联系人</div>
    <div class="search-box">
      <el-input
        clearable
        placeholder="搜索联系人"
        v-model="searchKey"
        size="large"
        @keyup="$emit('search', searchKey)"
      >
        <template #suffix>
          <span class="iconfont icon-search"></span>
        </template>
      </el-input>
    </div>
    <ul class="contact-list">
      <li v-for="contact in friendList" :key="contact.id" class="contact-item">
        <input
          class="circle-checkbox"
          type="checkbox"
          :checked="
            originalIds.includes(contact.id) ||
            newSelectedIds.includes(contact.id)
          "
          :disabled="originalIds.includes(contact.id)"
          @change="handleCheckboxChange(contact.id, $event)"
        />
        <FriendInfo :contact="contact" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.left-panel {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  border-right: 1px solid #d2d2d2;

  .title {
    font-size: 16px;
    padding-bottom: 10px;
  }

  .search-box .el-input {
    height: 35px;
  }
}

.contact-list {
  max-height: 70vh;
  overflow-y: auto;

  .contact-item {
    display: flex;
    align-items: center;
    padding: 12px;
  }
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
