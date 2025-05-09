import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	base: "/chatweb",
	plugins: [
		vue(),
		AutoImport({
			imports: ["vue"],
			resolvers: [ElementPlusResolver()],
			dts: "src/auto-imports.d.ts",
		}),
		Components({
			resolvers: [ElementPlusResolver()],
			dts: "src/components.d.ts",
		}),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
			vue: "vue/dist/vue.esm-bundler.js", // 关键配置
		},
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3200",
				// target: "https://dev.qdsj.top/server/chatweb",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
			"/server/chatweb/socket": {
				target: "https://dev.qdsj.top",
				ws: true,
				changeOrigin: true,
				secure: false, // 开发环境可关闭安全验证
			},
		},
	},
});
