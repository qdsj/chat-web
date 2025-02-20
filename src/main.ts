import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "element-plus/dist/index.css";

const pinia = createPinia();

import "./assets/css/common.css";
import "@/assets/icon/iconfont.css";
import Layout from "@/components/Layout.vue";

const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount("#app");
app.component("Layout", Layout);
