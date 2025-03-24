<script setup lang="ts">
import ListItem from "./ListItem.vue";
defineProps<{
  name: string;
  children: {
    name: string;
    avatar?: string;
    path: string;
    type: string;
    data?: { [key: string]: string };
  }[];
  msg?: string;
}>();
</script>

<template>
  <div class="contact-list">
    <div class="part-title">{{ name }}</div>
    <div class="part-list">
      <template v-for="item in children">
        <ListItem
          :avatar="item?.avatar || ''"
          :type="item.type"
          :data="item.data"
          :path="item.path"
          :name="item.name"
        ></ListItem>
      </template>
      <div v-if="children.length == 0" class="part-msg">{{ msg }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.contact-list {
  border-top: 1px solid #ddd;

  overflow: hidden;
  &:hover {
    overflow: auto;
  }

  .part-title {
    color: #515151;
    padding-left: 10px;
    margin-top: 10px;
  }
  .part-list {
    border-bottom: 1px solid #d6d6d6;
    .part-msg {
      padding: 10px;
    }
  }
}
</style>
