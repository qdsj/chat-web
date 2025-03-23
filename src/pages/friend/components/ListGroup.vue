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
    .part-item {
      display: flex;
      align-items: center;
      padding: 15px;
      position: relative;
      &:hover {
        cursor: pointer;
        background-color: #d6d6d6;
      }
      .iconfont {
        width: 37px;
        height: 37px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: #fff;
      }
      .text {
        flex: 1;
        color: #000000;
        margin-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 18px;
      }
    }
    .no-data {
      text-align: center;
      font-size: 12px;
      color: #9d9d9d;
      line-height: 30px;
    }
    .active {
      background-color: #c9c8c6;
      &:hover {
        background-color: #c9c8c6;
      }
    }
  }
}
</style>
