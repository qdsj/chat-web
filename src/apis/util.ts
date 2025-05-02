import { ElMessage } from "element-plus";

const refreshTokenKey = "refresh-token";
const authTokenKey = "auth-token";

const storeAuthToken = (msg: string) => {
	localStorage.setItem(authTokenKey, msg);
};
const storeRefreshToken = (msg: string) => {
	localStorage.setItem(refreshTokenKey, msg);
};

const getAuthToken = () => {
	return localStorage.getItem(authTokenKey);
};

const getRefreshToken = () => {
	return localStorage.getItem(refreshTokenKey);
};

export { storeAuthToken, storeRefreshToken, getAuthToken, getRefreshToken };

const accessAuth = (response: Response) => {
	const redirectUrl = response.headers.get("redirect");
	if (!redirectUrl) {
		ElMessage({
			message: "跳转失败：" + redirectUrl,
			type: "warning",
		});
	}

	let openWindow: Window | null = null;
	window.addEventListener("message", (event: { data: any }) => {
		if (event.data.type === "auth-token" && event.data.token) {
			console.log(event.data.type);
			// 接收登录页面发送过来的token
			storeRefreshToken(event.data.token);
			if (openWindow) {
				// 向登录页面发送关闭消息。让登录页面告诉用户，已经成功登录，并且要关闭当前页面
				openWindow.postMessage({ type: "close" }, "*");
				setTimeout(() => {
					// 关闭登录页面
					openWindow!.close();
					// 当前页面刷新
					window.location.reload();
				}, 1000);
			}
		}
	});

	setTimeout(() => {
		// _blank 表示在新窗口打开
		// openwindow 为打开的窗口的window对象
		openWindow = window.open(import.meta.env.VITE_AUTH_URL + redirectUrl!, "_blank");
	}, 1000);
};

const checkResponseToken = (response: Response) => {
	if (response.headers.get("token")) {
		const token = response.headers.get("token");
		storeAuthToken(token!);
	}
};

export { accessAuth, checkResponseToken };
