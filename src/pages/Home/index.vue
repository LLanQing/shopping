<template>
	<div>
		<!-- 全局组件，商品分类导航 -->
		<TypeNav />
		<!-- 轮播图+列表 -->
		<ListContainer />
		<!-- 今日推荐 -->
		<Recommend />
		<!-- 商品排行  -->
		<Rank />
		<!-- 猜你喜欢 -->
		<Like />
		<!-- 商品展示楼层 -->
		<!-- Floor这个组件：自己在组件内部是没有发请求的，数据是父组件给的 -->
		<Floor v-for="floor in floorList" :key="floor.id" :floor="floor" />
		<!-- 商标 -->
		<Brand />
	</div>
</template>

<script>
	// 引入主页展示的路由组件
	import ListContainer from '@/pages/Home/ListContainer';
	import Recommend from '@/pages/Home/Recommend';
	import Rank from '@/pages/Home/Rank';
	import Like from '@/pages/Home/Like';
	import Floor from '@/pages/Home/Floor';
	import Brand from '@/pages/Home/Brand';
	// 引入vuex的mapState方法，用来获取state中的数据
	import { mapState } from 'vuex';

	export default {
		name: 'Home',
		components: {
			ListContainer,
			Recommend,
			Rank,
			Like,
			Floor,
			Brand,
		},
		computed: {
			...mapState('home', ['floorList']),
		},
		mounted() {
			/*	1.Floor组件在Home组件中使用了两次，如果将请求放到Floor组件中，
					将会发送两次相同的请求
		*/
			//派发actions,获取商品列表
			this.$store.dispatch('home/getFloorList');
		},
	};
</script>

<style lang="less" scoped></style>
