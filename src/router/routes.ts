export default [
  {
    path: "/",
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
        component: () => import("@/pages/contact/Contact.vue"),
      },
      {
        path: "/setting",
        name: "设置",
        component: () => import("@/pages/setting/Setting.vue"),
      },
    ],
  },
];
