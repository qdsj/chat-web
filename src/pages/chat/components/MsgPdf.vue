<script setup lang="ts">
  import { Message } from '@/types/model/chat.type';
  import PDF from "pdf-vue3";
  defineProps<{
    msg: Message
  }>()


</script>

<template>
  <div class="pdf-container">
    <PDF :src="msg.content" />

  </div>
</template>

<style>
  .pdf-vue3-scroller {
    max-height: 350px !important;
  }
</style>
<style scoped lang="scss"></style>
