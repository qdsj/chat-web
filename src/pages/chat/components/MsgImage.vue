<script setup lang="ts">
  import { Message } from '@/types/model/chat.type';

  defineProps<{
    msg: Message;
  }>()
</script>

<template>
  <div>
    <img :src="msg.content"
         :alt="msg.content"
         class="msg-image" />
  </div>
</template>

<style scoped lang="scss"></style>
