export default [
  {
    path: "/",
    name: "默认路径",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "登录",
    component: () => import("@/pages/Login.vue"),
  },
  {
    path: "/main",
    redirect: "/chat",
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
        redirect: "/contact/blank",
        component: () => import("@/pages/contact/Contact.vue"),
        children: [
          {
            path: "/contact/blank",
            name: "空白页",
            component: () => import("@/pages/contact/BlankPage.vue"),
          },
          {
            path: "/contact/search",
            name: "搜索",
            component: () => import("@/pages/contact/Search.vue"),
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
