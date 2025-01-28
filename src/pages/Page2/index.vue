<script setup lang="ts">
import { io } from "socket.io-client";

onMounted(() => {
	const client = io("http://localhost:3210");

	client.on("connect", () => {
		console.log("连接成功");

		client.emit("test", "hello", (data: any) => {
			console.log(data);
		});

		client.emit("connect-server", {
			id: client.id,
			name: "zhangsan",
		});

		client.emit("join-room", {
			id: client.id,
			roomId: "1",
			name: "zhangsan",
		});

		client.emit("findAllOnline", (data: any) => {
			console.log(data);
		});
	});

	client.on("connect_error", () => {
		console.log("error");
	});

	client.on("data", (data) => {
		console.log("data: ", data);
	});
});
</script>

<template>
	<div>page2</div>
</template>

<style scoped lang="scss"></style>
