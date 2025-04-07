// 上传文件的接口
import { getFetch } from "./http";
import { v4 as uuid } from "uuid";

// 获取临时签名
const getSignature = async () => {
	let data = null;
	try {
		const res = await getFetch("/oss/getTempSignature");
		data = res.data;

		if (data.code !== 200) {
			console.error("获取签名失败", data.msg);
			return null;
		}
	} catch (error) {
		console.error("获取签名失败", error);
		return null;
	}

	return data;
};
export const uploadFile = async (params: { file: File }) => {
	const data = await getSignature();
	if (!data) {
		return null;
	}

	try {
		const { file } = params;
		const filename = uuid();
		const formData = new FormData();
		formData.append("name", filename);
		formData.append("policy", data.policy);
		formData.append("OSSAccessKeyId", data.ossAccessKeyId);
		formData.append("success_action_status", "200");
		formData.append("signature", data.signature);
		formData.append("key", filename);
		formData.append("file", file);

		return fetch(data.host, { method: "POST", body: formData });
	} catch (error) {
		console.error("上传文件失败", error);
		return null;
	}
};
