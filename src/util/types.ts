import type { ButtonType as ElButtonType } from "element-plus";

// 聊天记录
export interface Message {
	id: string;
	sender: string;
	receiver: string;
	content: string;
	isSelf?: boolean;
	time: string;
	type?: string;
}

// 会话列表
export interface Conversation {
	id: string; // roomId / friendId
	name: string; // 群聊名称/好友昵称
	avatar: string; // 群聊头像/好友头像
	contactType?: number; // 0: 好友，1: 群聊
	memberCount?: number; // 群聊成员数量
	// lastMessage?: string; // 最后一条消息
	// time?: string; // 最后一条消息时间
	topType?: number; // 置顶类型
	messages: Message[]; // 消息列表
	unreadCount?: number; // 未读消息数量
}

// 好友列表
export interface Friend {
	id: string;
	name: string;
	// 可以根据需求添加更多字段
}

// 定义按钮配置的类型
export type ButtonConfig = {
	type: ElButtonType;
	text: string;
	click: () => void;
};

// 定义 dialogConfig 的类型
export type DialogConfig = {
	show: boolean;
	title: string;
	buttons: ButtonConfig[];
};
