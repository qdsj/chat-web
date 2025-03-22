import { I_GetFriendListApiResult } from "@/apis/types/friend.types";

export type T_FriendShip = I_GetFriendListApiResult["data"][0]["friendShip"];

// 类型函数Omit
export type T_User = Omit<I_GetFriendListApiResult["data"][0], "friendShip">;
