import { ConversationType } from "@/types/model/chat.type";
import { postFetch } from "./http";
import {
  I_getChatWindowsTimeResultApi,
  I_GetGroupChatHistoryResultApi,
  I_GetSingleChatHistoryResultApi,
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

// 获取聊天窗口的时间
export const getChatWindowsTimeApi = (
  data: Array<{ roomId: string; type: ConversationType }>
): Promise<I_getChatWindowsTimeResultApi> => {
  return postFetch("/chat/getChatWindowsTime", data);
};
