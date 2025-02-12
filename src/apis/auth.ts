import { getFetch } from "./http";

const fetchTest = () => {
	getFetch("/chat").then((res) => {
		console.log(res);
	});
};

export { fetchTest };
