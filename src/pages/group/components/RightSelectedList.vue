<script setup lang="ts">
import FriendInfo from "./FriendInfo.vue";

defineProps<{
  selectedContacts: any[];
}>();

const emit = defineEmits(["remove-contact"]);
</script>

<template>
  <div class="right-panel">
    <div class="title">已选择 {{ selectedContacts.length }} 个联系人</div>
    <ul class="selected-list">
      <li
        v-for="contact in selectedContacts"
        :key="contact.id"
        class="selected-item"
      >
        <FriendInfo :contact="contact" />
        <span class="remove-btn" @click="$emit('remove-contact', contact.id)"
          >×</span
        >
      </li>
    </ul>
  </div>
</template>

<style scoped>
.right-panel {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;

  .title {
    font-size: 16px;
    padding-bottom: 10px;
  }
}

.selected-list {
  max-height: 70vh;
  overflow-y: auto;

  .selected-item {
    display: flex;
    align-items: center;
    padding: 12px;

    .remove-btn {
      margin-left: auto;
      color: #666;
      cursor: pointer;
    }
  }
}
</style>
