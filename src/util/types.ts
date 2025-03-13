import type { ButtonType as ElButtonType } from "element-plus";

// 聊天记录
export interface Message {
  id: number;
  sender: string;
  receiver: string;
  content: string;
  isSelf: boolean;
  time: string;
  type?: string;
}

// 会话列表
export interface Conversation {
  id: string;
  name: string;
  contactType?: number;
  memberCount?: number;
  lastMessage?: string;
  time?: string;
  topType?: number;
  messages: Message[];
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
