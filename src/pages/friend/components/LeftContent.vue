<script setup lang="ts">
  import { useFriendStore } from "@/store/useFriendStore";
  import ListGroup from "./ListGroup.vue";
  import { DEFAULT_ACTIVE_ROUTE, SESSION_STORAGE_KEYS } from "@/util/constants";
  import { useGroupStore } from "@/store/userGroupStore";

  const friendStore = useFriendStore();
  const groupStore = useGroupStore();

  const searchKey = ref("");
  // 搜索好友 or 群聊
  const search = () => {
    friendStore.searchFriend(searchKey.value);
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

  const groupGroup = computed(() => {
    return {
      name: "群聊",
      children: ((friendStore.isSearching ? friendStore.searchedGroupList : groupStore.groupList) || []).map((item) => ({
        name: item.name,
        path: `/contact/groupDetail?id=${item.id}&username=${item.name}`,
        type: "friend",
        avatar: item.avatar,
        data: {
          id: item.id,
          name: item.name,
          avatar: item.avatar,
        },
      })),
    }
  });

  const friendGroup = computed(() => ({
    name: "我的好友",
    children: ((friendStore.isSearching ? friendStore.searchedFriendList : friendStore.friendList) || []).map((item) => ({
      name: item.username,
      path: `/contact/userDetail?id=${item.id}&username=${item.username}`,
      type: "friend",
      avatar: item.avatar,
      data: {
        id: item.id,
        email: item.email,
        name: item.username,
      },
    })),
    msg: "暂没有好友",
  }));

  const blockGroup = computed(() => ({
    name: "我拉黑的好友",
    children: (friendStore.blockList || []).map((item) => ({
      name: item.username,
      path: `/contact/userDetail?id=${item.id}&username=${item.username}`,
      type: "friend",
      avatar: item.avatar,
      data: {
        id: item.id,
        email: item.email,
        name: item.username,
      },
    })),
    msg: "暂没有拉黑的好友",
  }));



  const activePath = ref<string>(
    sessionStorage.getItem(SESSION_STORAGE_KEYS.ACTIVE_PATH) ||
    DEFAULT_ACTIVE_ROUTE
  );

  const handleClick = (path: string) => {
    activePath.value = path;
    sessionStorage.setItem(SESSION_STORAGE_KEYS.ACTIVE_PATH, path);
  };
</script>

<template>
  <!-- 搜索框 -->
  <div class="top-search">
    <el-input clearable
              placeholder="搜索"
              v-model="searchKey"
              size="large"
              @keyup="search">
      <template #suffix>
        <span class="iconfont icon-search"></span>
      </template>
    </el-input>
  </div>
  <!-- 联系人 or 群聊 -->
  <div v-if="!friendStore.isSearching"
       class="list-group-container">
    <ListGroup :name="newFriendGroup.name"
               :children="newFriendGroup.children"
               :activePath="activePath"
               @select="handleClick" />
    <ListGroup :name="groupGroup.name"
               :children="groupGroup.children"
               :activePath="activePath"
               @select="handleClick" />

    <ListGroup :name="friendGroup.name"
               :children="friendGroup.children"
               :msg="friendGroup.msg"
               :activePath="activePath"
               @select="handleClick" />
    <ListGroup :name="blockGroup.name"
               :children="blockGroup.children"
               :msg="blockGroup.msg"
               :activePath="activePath"
               @select="handleClick" />
  </div>

  <div v-else
       class="list-group-container">
    <ListGroup :name="groupGroup.name"
               :children="groupGroup.children"
               :activePath="activePath"
               @select="handleClick" />

    <ListGroup :name="friendGroup.name"
               :children="friendGroup.children"
               :msg="friendGroup.msg"
               :activePath="activePath"
               @select="handleClick" />
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
    width: 10px;
    /* 滚动条宽度 */
    height: 10px;
    /* 滚动条高度 */
  }
</style>
