import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import { useUserStore } from "./useUserStore";
import { getAuthToken } from "@/apis/util";
import { SocketMessage } from "@/types/model/chat.type";
import { useChatStore } from "./useChatStore";

type SocketOptions = {
	onConnectCallbacks?: Array<() => void>;
	onMessageCallbacks?: Array<(msg: string) => void>;
};

export const useSocketStore = defineStore("socket-store", () => {
	const client = ref<Socket | null>(null);
	const userInfoStore = useUserStore();
	const chatStore = useChatStore();
	const msgCallbacks = ref<Set<(msg: string) => void>>(new Set());

	const socketInitial = (options: SocketOptions = {}) => {
		if (client.value) return client.value;

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
		});

		connect.on("message", (msg) => {
			options.onMessageCallbacks?.forEach((callback) => {
				callback(msg);
			});

			chatStore.addMessage(msg);
		});

		return connect;
	};

	const socketSend = (msg: SocketMessage, callback?: (...args: any) => void) => {
		if (!msg.msgType) {
			msg.msgType = "text";
		}

		client.value?.emit("send", msg, (...args: any) => {
			callback && callback(...args);
		});
	};

	const socketJoinRoom = (roomId: string) => {
		client.value!.emit("join", { roomId });
	};

	const addMsgCallbacks = (callbacks: Array<(msg: string) => void>) => {
		if (!client.value || !callbacks || !callbacks.length) return;
		callbacks.forEach((callback) => {
			msgCallbacks.value.add(callback);
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
