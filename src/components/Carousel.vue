<template>
	<!-- 轮播图 -->
	<div class="swiper-container" ref="swiper">
		<!-- 轮播的图片 -->
		<div class="swiper-wrapper">
			<div
				class="swiper-slide"
				v-for="carousel in carouselList"
				:key="carousel.id"
			>
				<img :src="carousel.imgUrl" />
			</div>
		</div>
		<!-- 如果需要分页器 -->
		<div class="swiper-pagination"></div>

		<!-- 如果需要导航按钮 -->
		<div class="swiper-button-prev"></div>
		<div class="swiper-button-next"></div>
	</div>
</template>

<script>
	// 引入Swiper
	import Swiper from 'swiper';

	export default {
		name: 'Carousel',
		props: {
			carouselList: {
				type: Array, //类型
				required: true, //必要性
			},
		},
		watch: {
			//监听carouselList数据变化，发生改变即代表数据获取成功，再创建Swiper
			/* 为什么watch监听不到carouselList：因为这个数据从来没有发生变化
				（数据是父亲给的，父亲给的时候就是一个对象，对象里面该有的数据都是有的）
				解决办法：开启立即监听，一上来就执行一次handler */
			carouselList: {
				//立即监听：不管你数据有没有变化，我上来立即监听一次
				immediate: true,
				handler() {
					// 数据获取成功之后不代表dom结构更新完毕，需要使用this.$nextTick下一次 DOM 更新结束后执行其指定的回调
					this.$nextTick(() => {
						new Swiper(this.$refs.swiper, {
							// 如果需要分页器
							pagination: {
								el: '.swiper-pagination',
								clickable: true, //分页器是否可点击切换
							},

							// 如果需要前进后退按钮
							navigation: {
								nextEl: '.swiper-button-next',
								prevEl: '.swiper-button-prev',
							},

							// 如果需要滚动条
							/* scrollbar: {
              el: '.swiper-scrollbar',
              }, */
						});
					});
				},
			},
		},
		mounted() {},
	};
</script>

<style></style>
