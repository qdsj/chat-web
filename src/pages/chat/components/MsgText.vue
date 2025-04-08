<script setup lang="ts">
  import { Message } from '@/types/model/chat.type';
  defineProps<{
    msg: Message;
  }>();
</script>

<template>
  <div>{{ msg.content }}</div>
</template>

<style scoped lang="scss"></style>
