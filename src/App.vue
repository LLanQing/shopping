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
	import Header from './components/Header.vue';
	import Footer from './components/Footer.vue';
	//引入swiper样式，因为有多处用到了swiper，所以在App里面引入样式作为全局样式
	import 'swiper/css/swiper.css';

	export default {
		name: 'App',
		components: {
			Header,
			Footer,
		},
		mounted() {
			// 由于Vue在路由切换的时候会销毁旧路由，当我们再次使用三级列表全局组件时还会发一次请求。
			// 由于信息都是一样的，出于性能的考虑我们希望该数据只请求一次，所以我们把这次请求放在App.vue的mounted中。（根组件App.vue的mounted只会执行一次）
			//三级菜单加载完毕时，向vuex发送获取三级菜单请求
			// console.log('派发actions---获取商品菜单列表');
			this.$store.dispatch('home/getCategoryList');
		},
	};
</script>

<style></style>
