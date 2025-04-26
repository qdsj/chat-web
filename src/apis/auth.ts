import { getFetch, postFetch } from "./http";

const fetchTest = () => {
  getFetch("/chat").then((res) => {
    console.log(res);
  });
};

const fetchUserInfo = async () => {
  const res = await getFetch("/getUserInfo");
  return res.data;
};

const fetchUpdateUserInfo = async (data: {
  avatar: string;
  sex: string;
  description: string;
}) => {
  return await postFetch("/updateUserInfo", data);
};

export { fetchTest, fetchUserInfo, fetchUpdateUserInfo };
