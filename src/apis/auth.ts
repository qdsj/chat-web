import { getFetch } from "./http";

const fetchTest = () => {
	getFetch("/chat").then((res) => {
		console.log(res);
	});
};

const fetchUserInfo = async () => {
	const res = await getFetch("/getUserInfo");
	return res.data;
};

export { fetchTest, fetchUserInfo };
