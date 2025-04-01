import { postFetch } from "./http";
import { I_GetChatHistoryResultApi } from "./types/chat.type";

// 获取聊天记录
export const getChatHistoryApi = (data: {
  roomId: string;
}): Promise<I_GetChatHistoryResultApi> => {
  return postFetch("/chat/getChatHistory", data);
};
