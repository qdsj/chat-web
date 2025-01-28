export default [
	{ path: "/page2", component: () => import("@/pages/Page2/index.vue") },
	{ path: "/", component: () => import("@/pages/Home/index.vue") },
];
