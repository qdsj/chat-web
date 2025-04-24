import { ConversationType } from "@/types/model/chat.type";
import { getFetch, postFetch } from "./http";
import {
  I_AddSessionResultApi,
  I_deleteSessionResultApi,
  I_GetGroupChatHistoryResultApi,
  I_GetSessionListResultApi,
  I_GetSingleChatHistoryResultApi,
  I_updateChatWindowsTimeResultApi,
} from "./types/chat.type";

// 获取单聊 - 聊天记录
export const getSingleChatHistoryApi = (data: {
  roomId: string;
}): Promise<I_GetSingleChatHistoryResultApi> => {
  return postFetch("/chat/getSingleChatHistory", data);
};

// 获取群-聊天记录
export const getGroupChatHistoryApi = (data: {
  roomId: string;
}): Promise<I_GetGroupChatHistoryResultApi> => {
  return postFetch("/chat/getGroupChatHistory", data);
};

// 更新聊天窗口的时间
export const updateChatWindowsTimeApi = (data: {
  roomId: string;
  type: ConversationType;
}): Promise<I_updateChatWindowsTimeResultApi> => {
  return postFetch("/chat/checkChatWindow", data);
};

// 获取会话列表
export const getSessionListApi = (): Promise<I_GetSessionListResultApi> => {
  return getFetch("/session");
};

// 增加一个会话记录
export const addSessionApi = (data: {
  roomId: string;
  type: ConversationType;
}): Promise<I_AddSessionResultApi> => {
  return postFetch("/session/add", data);
};

// 删除一个会话记录
export const deleteSessionApi = (data: {
  roomId: string;
  type: ConversationType;
}): Promise<I_deleteSessionResultApi> => {
  return postFetch("/session/delete", data);
};
