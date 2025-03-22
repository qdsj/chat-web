import type { ButtonType as ElButtonType } from "element-plus";

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
