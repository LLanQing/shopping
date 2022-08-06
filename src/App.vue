<template>
	<div>
		<Header></Header>
		<!-- 路由组件出口的地方:展示的地方 -->
		<router-view></router-view>
		中间待补充
		<Footer v-show="$route.meta.isFooterShow"></Footer>
	</div>
</template>

<script>
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
