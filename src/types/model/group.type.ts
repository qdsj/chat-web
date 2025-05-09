import { I_GetGroupListApiResult } from "@/apis/types/group.type";
import { ConversationType } from "./chat.type";

export type T_GroupList = I_GetGroupListApiResult["data"][0];

export interface GroupInfo {
  groupId: string;
  groupName: string;
  avatar: string;
  userId: string;
  userType: string;
  groupDescription: string;
  type: ConversationType;
}
