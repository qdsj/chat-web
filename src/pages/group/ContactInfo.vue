<script setup lang="ts">
import { T_Friend } from "@/types/model/friend.types";

defineProps({
  contact: {
    type: Object as () => T_Friend,
    required: true,
    default: {},
  },
});
</script>

<template>
  <div class="contact-info">
    <AvatarBase
      :alt="contact.username"
      :avatar="contact.avatar"
      :border-radius="5"
      :width="35"
    />
    <span class="name">{{ contact.username }}</span>
  </div>
</template>

<style scoped>
.contact-info {
  display: flex;
  align-items: center;
  gap: 8px;
}
.name {
  font-size: 14px;
  color: #333;
}
</style>
