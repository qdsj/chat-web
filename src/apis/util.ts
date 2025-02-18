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
	ElMessage({
		message: "登录已过期, 将跳转至登录页面",
		type: "warning",
	});
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
			storeRefreshToken(event.data.token);
			if (openWindow) {
				openWindow.postMessage({ type: "close" }, "*");
				setTimeout(() => {
					openWindow!.close();
				}, 1000);
			}
		}
	});

	setTimeout(() => {
		openWindow = window.open(redirectUrl!, "_blank");
	}, 1000);
};

const checkResponseToken = (response: Response) => {
	if (response.headers.get("token")) {
		const token = response.headers.get("token");
		storeAuthToken(token!);
	}
};

export { accessAuth, checkResponseToken };
