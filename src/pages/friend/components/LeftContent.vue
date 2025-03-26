<script setup lang="ts">
import { useFriendStore } from "@/store/useFriendStore";
import ListGroup from "./ListGroup.vue";

const friendStore = useFriendStore();
const searchKey = ref("");
const defaultAvatar =
  "https://th.bing.com/th/id/OIP.-I18fiU0rmHiiS5FtMDyHgHaHa?w=207&h=207&c=7&r=0&o=5&dpr=1.5&pid=1.7";
// 搜索好友 or 群聊
const search = () => {
  console.log(searchKey.value);
};

const newFriendGroup = {
  name: "新朋友",
  children: [
    {
      name: "添加好友",
      path: "/contact/search",
      type: "search",
    },
    {
      name: "新的朋友",
      path: "/contact/contactNotice",
      type: "newFriend",
    },
  ],
};

const newGroupGroup = {
  name: "群聊",
  children: [
    {
      name: "新建群聊",
      path: "/contact/createGroup",
      type: "group",
    },
    {
      name: "相亲相爱一家人",
      path: "/contact/groupDetail?id=group@qq.com&name=相亲相爱一家人",
      type: "friend",
      avatar: defaultAvatar,
      data: {
        id: "gruopId",
        email: "group@qq.com",
        name: "相亲相爱一家人",
      },
    },
  ],
};

const blockGroup = computed(() => ({
  name: "我拉黑的好友",
  children: (friendStore.blockList || []).map((item) => ({
    name: item.username,
    path: `/contact/userDetail?id=${item.id}&username=${item.username}`,
    type: "friend",
    avatar: defaultAvatar,
    data: {
      id: item.id,
      email: item.email,
      name: item.username,
    },
  })),
  msg: "暂没有拉黑的好友",
}));

const friendGroup = computed(() => ({
  name: "我的好友",
  children: (friendStore.friendList || []).map((item) => ({
    name: item.username,
    path: `/contact/userDetail?id=${item.id}&username=${item.username}`,
    type: "friend",
    avatar: defaultAvatar,
    data: {
      id: item.id,
      email: item.email,
      name: item.username,
    },
  })),
  msg: "暂没有好友",
}));
</script>

<template>
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
  <div class="list-group-container">
    <ListGroup
      :name="newFriendGroup.name"
      :children="newFriendGroup.children"
    />
    <ListGroup :name="newGroupGroup.name" :children="newGroupGroup.children" />
    <ListGroup
      :name="blockGroup.name"
      :children="blockGroup.children"
      :msg="blockGroup.msg"
    />
    <ListGroup
      :name="friendGroup.name"
      :children="friendGroup.children"
      :msg="friendGroup.msg"
    />
  </div>
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

.list-group-container {
  height: calc(100vh - 92px);
  overflow-y: auto;
}
::-webkit-scrollbar {
  width: 10px; /* 滚动条宽度 */
  height: 10px; /* 滚动条高度 */
}
</style>
