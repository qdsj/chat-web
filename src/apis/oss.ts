// 上传文件的接口
import { getFetch } from "./http";
import { v4 as uuid } from "uuid";
import { I_UploadFileApiResult } from "./types/oss";

// 获取临时签名
const getSignature = async () => {
	let data = null;
	try {
		const res = await getFetch("/oss/getTempSignature");

		if (res.status !== 200) {
			console.error("获取签名失败", res.msg);
			return null;
		}
		data = res.data;
	} catch (error) {
		console.error("获取签名失败", error);
		return null;
	}

	return data;
};
export const uploadFile = async (params: { file: File }): Promise<I_UploadFileApiResult | null> => {
	const data = await getSignature();
	if (!data) {
		return null;
	}

	try {
		const { file } = params;
		const filename = uuid() + file.name.substring(file.name.lastIndexOf("."));
		const formData = new FormData();
		formData.append("name", filename);
		formData.append("policy", data.policy);
		formData.append("OSSAccessKeyId", data.ossAccessKeyId);
		formData.append("success_action_status", "200");
		formData.append("signature", data.signature);
		formData.append("key", filename);
		formData.append("file", file);

		const res = await fetch(data.host, { method: "POST", body: formData });
		return {
			url: `${res.url}${filename}`,
			status: res.status,
			statusText: res.statusText,
			type: res.type,
		};
	} catch (error) {
		console.error("上传文件失败", error);
		return null;
	}
};
