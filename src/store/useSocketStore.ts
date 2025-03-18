import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import { useUserInfoStore } from "./useUserInfo.store";
import { getAuthToken } from "@/apis/util";

type SocketOptions = {
	onConnectCallbacks?: Array<() => void>;
	onMessageCallbacks?: Array<(msg: string) => void>;
};

type SendMsgType = {
	type: string;
	sender: string;
	content: string;
	roomId: string;
	time: string;
};

export const useSocketStore = defineStore("socket-store", () => {
	const client = ref<Socket | null>(null);
	const userInfoStore = useUserInfoStore();

	const socketInitial = (options: SocketOptions = {}) => {
		if (client.value) return client.value;
		console.log("socket initial", userInfoStore.userInfo);
		if (!userInfoStore.userInfo) return;

		const connect = io(import.meta.env.VITE_SOCKET_HOST, {
			path: "/server/chatweb/socket",
			auth: {
				authorization: `Bearer ${getAuthToken()}`,
			},
		});
		client.value = connect;
		connect.on("connect", () => {
			console.log("socket connected");
			options.onConnectCallbacks?.forEach((callback) => {
				callback();
			});

			client.value?.emit(
				"send",
				{ roomId: "40be5cbe-fbd1-43a8-bd35-d51c0c8bc876", msg: "hello blue", type: "person" },
				(...args: any) => {
					console.log("send", args);
				}
			);
		});

		connect.on("message", (msg) => {
			options.onMessageCallbacks?.forEach((callback) => {
				callback(msg);
			});
		});

		return connect;
	};

	const socketSend = (msg: SendMsgType) => {
		client.value?.emit("send", msg);
	};

	const socketJoinRoom = (roomId: string) => {
		client.value!.emit("join", { roomId });
	};

	const addMsgCallbacks = (callbacks: Array<(msg: string) => void>) => {
		if (!client.value || !callbacks || !callbacks.length) return;
		client.value.on("message", (msg) => {
			callbacks.forEach((callback) => {
				callback(msg);
			});
		});
	};
	return {
		client,
		socketInitial,
		socketSend,
		socketJoinRoom,
		addMsgCallbacks,
	};
});
