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
		<Floor />
		<!-- 商标 -->
		<Brand />
	</div>
</template>

<script>
// 引入主页展示的路由组件
import ListContainer from "@/pages/Home/ListContainer";
import Recommend from "@/pages/Home/Recommend";
import Rank from "@/pages/Home/Rank";
import Like from "@/pages/Home/Like";
import Floor from "@/pages/Home/Floor";
import Brand from "@/pages/Home/Brand";

export default {
	name: "Home",
	components: {
		ListContainer,
		Recommend,
		Rank,
		Like,
		Floor,
		Brand,
	},
};
</script>

<style lang="less" scoped></style>
