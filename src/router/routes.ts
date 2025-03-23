export default [
  {
    path: "/",
    name: "默认路径",
    redirect: "/chat",
  },
  {
    path: "/main",
    name: "主页面",
    component: () => import("@/pages/Main.vue"),
    children: [
      {
        path: "/chat",
        name: "聊天",
        component: () => import("@/pages/chat/Chat.vue"),
      },
      {
        path: "/contact",
        name: "联系人",
        redirect: "/contact/search",
        component: () => import("@/pages/friend/Layout.vue"),
        children: [
          {
            path: "/contact/search",
            name: "搜索",
            component: () => import("@/pages/friend/pages/Search.vue"),
          },
          {
            path: "/contact/contactNotice",
            name: "新的朋友",
            component: () => import("@/pages/friend/pages/RequestList.vue"),
          },
          {
            path: "/contact/createGroup",
            name: "创建群聊",
            component: () => import("@/pages/group/GroupEdit.vue"),
          },
          {
            path: "/contact/userDetail",
            name: "用户详情",
            component: () => import("@/pages/friend/pages/FriendDetail.vue"),
          },
          {
            path: "/contact/groupDetail",
            name: "群聊详情",
            component: () => import("@/pages/group/GroupDetail.vue"),
          },
        ],
      },
      {
        path: "/setting",
        name: "设置",
        redirect: "/setting/userinfo",
        component: () => import("@/pages/setting/Setting.vue"),
        children: [
          {
            path: "/setting/userinfo",
            name: "用户信息",
            component: () => import("@/pages/setting/UserInfo.vue"),
          },
          {
            path: "/setting/fileManage",
            name: "文件管理",
            component: () => import("@/pages/setting/FileManage.vue"),
          },
          {
            path: "/setting/about",
            name: "关于我们",
            component: () => import("@/pages/setting/AboutUs.vue"),
          },
        ],
      },
    ],
  },
];
