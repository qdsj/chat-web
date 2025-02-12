<script setup lang="ts">
import { fetchTest } from "@/apis/auth";
import { storeRefreshToken } from "@/apis/util";

onMounted(() => {
	// openWindow = window.open("http://localhost:3111/authqdsj/login", "_blank");
});

// fetchTest();
</script>

<template>
	<el-button @click="fetchTest">测试</el-button>
</template>

<style scoped lang="scss"></style>
