<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const searchKey = ref("");

const rightTitle = ref();

// 搜索好友 or 群聊
const search = () => {
  console.log(searchKey.value);
};

// 左侧联系人 and 群组列表数据
const partList = ref([
  {
    partName: "新朋友",
    children: [
      {
        name: "新的朋友",
        icon: "icon-icon-plane",
        iconBgColor: "#08bf61",
        path: "/contact/contactNotice",
        showTitle: true,
        countKey: "contactApplyCount",
      },
    ],
  },
  {
    partName: "我的群聊",
    children: [
      {
        name: "新建群聊",
        icon: "icon-icon-add-group",
        iconBgColor: "#1485ee",
        path: "/contact/createGroup",
      },
    ],
    contactId: "groupId",
    contactName: "groupName",
    showTitle: true,
    contactData: [],
    contactPath: "/contact/groupDetail",
  },
  {
    partName: "我加入的群聊",
    contactId: "contactId",
    contactName: "contactName",
    showTitle: true,
    contactData: [],
    contactPath: "/contact/groupDetail",
    emptyMsg: "暂未加入群聊",
  },
  {
    partName: "我的好友",
    children: [],
    contactId: "contactId",
    contactName: "contactName",
    showTitle: true,
    contactData: [],
    contactPath: "/contact/userDetail",
    emptyMsg: "暂无好友",
  },
]);

// TODO 此处需要对接后端接口获取数据
const partJump = (item: any) => {
  console.log(item);
};
</script>

<template>
  <Layout>
    <!-- 左边 -->
    <template #left-content>
      <!-- 搜索框 -->
      <div class="top-search">
        <el-input
          clearable
          placeholder="搜索"
          v-model="searchKey"
          size="large"
          @keyup="search"
        >
          <template #suffix>
            <span class="iconfont icon-search"></span>
          </template>
        </el-input>
      </div>
      <!-- 联系人 or 群聊 -->
      <div class="contact-list">
        <template v-for="item in partList">
          <!-- 标题 -->
          <div class="part-title">{{ item.partName }}</div>
          <!-- 列表 -->
          <div class="part-list">
            <div
              v-for="sub in item.children"
              :class="['part-item', sub.path == route.path ? 'active' : '']"
              @click="partJump(sub)"
            >
              <!-- 图标 -->
              <div
                :class="['iconfont', sub.icon]"
                :style="{ background: sub.iconBgColor }"
              ></div>
              <!-- 名字 -->
              <div class="text">{{ sub.name }}</div>
            </div>
            <!-- 数据 -->
            <!-- TODO  后台数据渲染-->
            <!-- <template v-for="contact in item.contactData"></template> -->
            <template v-if="item.contactData && item.contactData.length == 0">
              <div class="no-data">{{ item.emptyMsg }}</div>
            </template>
          </div>
        </template>
      </div>
    </template>
    <!-- 右边 -->
    <template #right-content>
      <div class="title-panel">{{ rightTitle }}</div>
      <router-view v-slot="{ Component }">
        <component :is="Component" ref="componentRef"></component>
      </router-view>
    </template>
  </Layout>
</template>

<style scoped lang="scss">
.top-search {
  padding: 30px 10px 20px 10px;
  background-color: #f7f7f7;
  display: flex;
  align-items: center;
  .iconfont {
    font-size: 18px;
  }
}
.contact-list {
  border-top: 1px solid #ddd;
  height: calc(100vh - 92px);
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
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36px;
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
      background-color: #c4c4c4;
      &:hover {
        background-color: #c4c4c4;
      }
    }
  }
}
.title-panel {
  width: 100%;
  height: 6px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  font-size: 18px;
  color: #000000;
}
</style>
