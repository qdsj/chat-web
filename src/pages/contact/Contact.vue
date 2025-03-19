<script setup lang="ts">
import Avatar from "@/components/Avatar.vue";
import { ref } from "vue";
import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css";
import ContextMenu from "@imengyu/vue3-context-menu";
import { useRoute, useRouter } from "vue-router";
import { useFriendStore } from "@/store/useFriendStore";
import { blockFriend, unblockFriend } from "@/apis/friend";
import { ElMessage, ElMessageBox } from "element-plus";

const friendStore = useFriendStore();
const route = useRoute();
const router = useRouter();
const searchKey = ref("");

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
        name: "搜好友",
        icon: "icon-search",
        iconBgColor: "#fa9d3b",
        path: "/contact/search",
      },
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
    partName: "群聊",
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
    contactData: [
      {
        groupId: "1",
        groupName: "群聊",
      },
    ],
    contactPath: "/contact/groupDetail",
  },
  // {
  //   partName: "我加入的群聊",
  //   contactId: "contactId",
  //   contactName: "contactName",
  //   showTitle: true,
  //   contactData: [],
  //   contactPath: "/contact/groupDetail",
  //   emptyMsg: "暂未加入群聊",
  // },
  {
    partName: "我的好友",
    children: [],
    contactId: "email",
    contactName: "username",
    showTitle: true,
    contactPath: "/contact/userDetail",
    contactData: friendStore.friendList || [],
    emptyMsg: "暂无好友",
  },
]);
const rightTitle = ref();
const partJump = (data: any) => {
  if (data.showTitle) {
    partList;
    rightTitle.value = data.name;
  } else {
    rightTitle.value = null;
  }
  // TODO 处理联系人好友申请 数量已读
  router.push(data.path);
};

// 查看联系人详情
const contactDetail = (contact: any, part: any) => {
  if (part.showTitle) {
    rightTitle.value = contact[part.contactName];
  } else {
    rightTitle.value = null;
  }
  router.push({
    path: part.contactPath,
    query: {
      contactId: contact[part.contactId],
    },
  });
};

const onContextMenu = (e: MouseEvent, data: any) => {
  e.preventDefault();
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      {
        label: "删除好友",
        onClick: () => {
          ElMessageBox.confirm("你确定要拉黑该联系人吗?", "Warning", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              ElMessage({
                type: "success",
                message: "删除联系人成功",
              });
            })
            .catch(() => {
              ElMessage({
                type: "info",
                message: "取消删除",
              });
            });
        },
      },
      {
        label: data.status == "blocked" ? "恢复好友关系" : "拉黑好友",
        onClick: () => {
          const confirmMsg =
            data.status === "blocked"
              ? "你确定要恢复与该联系人的好友关系吗？"
              : "你确定要删除该好友吗？";
          ElMessageBox.confirm(confirmMsg, "Warning", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(async () => {
              if (data.status === "status") {
                await unblockFriend({ friendId: data.id });
              } else {
                await blockFriend({ friendId: data.id });
              }
              const successMsg =
                data.status === "blocked" ? "恢复好友关系成功" : "删除好友成功";
              ElMessage({
                type: "success",
                message: successMsg,
              });
            })
            .catch(() => {
              const cancelMsg =
                data.status === "blocked" ? "取消恢复好友关系" : "取消删除好友";
              ElMessage({
                type: "info",
                message: cancelMsg,
              });
            });
        },
      },
    ],
  });
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
            <template v-for="sub in item.children">
              <div
                v-if="item.children && item.children.length"
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
            </template>
            <!-- 数据 -->
            <!-- TODO  后台数据渲染-->
            <template v-for="contact in item.contactData">
              <div
                v-if="
                  item.contactData &&
                  item.contactData.length &&
                  item.contactId &&
                  item.contactName
                "
                :class="[
                  'part-item',
                  (contact as any)[item.contactId] == route.query.contactId
                    ? 'active'
                    : '',
                ]"
                @click="contactDetail(contact, item)"
                @contextmenu.stop="onContextMenu($event, contact)"
              >
                <Avatar
                  v-if="contact"
                  :userId="(contact as any)[item.contactId]"
                  :width="35"
                ></Avatar>
                <div class="text">
                  {{ (contact as any)[item.contactName] }}
                </div>
              </div>
            </template>
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
  padding: 20px 10px;
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
.title-panel {
  width: 100%;
  height: 81px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  font-size: 18px;
  color: #000000;
}
</style>
