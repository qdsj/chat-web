export default [
	{ path: "/", component: () => import("@/pages/Home/index.vue") },
	{ path: "/page2", component: () => import("@/pages/Page2/index.vue") },
];
