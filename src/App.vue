<template>
	<div>
		<!-- 头部导航按钮和搜索框 -->
		<Header />
		<!-- 路由组件出口的地方:展示的地方 -->
		<router-view></router-view>
		<!-- 底部 -->
		<Footer v-show="$route.meta.isFooterShow" />
	</div>
</template>

<script>
// 引入非路由组件
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

export default {
	name: "App",
	components: {
		Header,
		Footer,
	},
};
</script>

<style></style>
