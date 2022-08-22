<template>
	<div class="spec-preview" ref="preview">
		<img :src="imgObj.imgUrl" />
		<div class="event" @mousemove="handler"></div>
		<div class="big">
			<img :src="imgObj.imgUrl" ref="big" />
		</div>
		<!-- 遮罩层 -->
		<div class="mask" ref="mask"></div>
	</div>
</template>

<script>
	export default {
		name: 'Zoom',
		props: ['skuImageList'],
		data() {
			return {
				//当前展示的图片索引值
				currentIndex: 0,
			};
		},
		computed: {
			imgObj() {
				return this.skuImageList[this.currentIndex] || {};
			},
		},
		mounted() {
			//全局事件总线：获取兄弟组件传递过来的索引值
			this.$bus.$on('getIndex', index => {
				//修改当前响应式数据
				this.currentIndex = index;
			});
		},
		methods: {
			handler(event) {
				let { preview, mask, big } = this.$refs;
				/* console.dir(event);
				console.log(mask.offsetWidth);
				console.log(preview.offsetWidth);
				console.dir(preview); */
				// 设置遮罩层距离父元素的左偏移量和顶部偏移量
				let left = event.offsetX - mask.offsetWidth / 2;
				let top = event.offsetY - mask.offsetHeight / 2;
				//偏移量的返回需要限制,offsetXXX属性都包含了边框，clientXXX属性不包含边框
				// 显然，遮罩层不能将父元素边框的宽度算进去
				if (left < 0) {
					left = 0;
				} else if (left > preview.clientWidth - mask.offsetWidth) {
					left = preview.clientWidth - mask.offsetWidth;
				}
				if (top < 0) {
					top = 0;
				} else if (top > preview.clientHeight - mask.offsetHeight) {
					top = preview.clientHeight - mask.offsetHeight;
				}
				//修改遮罩层的偏移量（注意offset属性只读且不带单位，style的属性可读可修改且需要带上单位）
				mask.style.left = left + 'px';
				mask.style.top = top + 'px';
				//放大镜的图偏移量和遮罩层相反，且是它的两倍，因为图放大了两倍
				big.style.left = -2 * left + 'px';
				big.style.top = -2 * top + 'px';
			},
		},
	};
</script>

<style lang="less">
	.spec-preview {
		position: relative;
		width: 400px;
		height: 400px;
		border: 1px solid #ccc;

		img {
			width: 100%;
			height: 100%;
		}

		.event {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 998;
		}

		.mask {
			width: 50%;
			height: 50%;
			background-color: rgba(0, 255, 0, 0.3);
			position: absolute;
			left: 0;
			top: 0;
			display: none;
		}

		.big {
			width: 100%;
			height: 100%;
			position: absolute;
			top: -1px;
			left: 100%;
			border: 1px solid #aaa;
			overflow: hidden;
			z-index: 998;
			display: none;
			background: white;

			img {
				width: 200%;
				max-width: 200%;
				height: 200%;
				position: absolute;
				left: 0;
				top: 0;
			}
		}

		.event:hover ~ .mask,
		.event:hover ~ .big {
			display: block;
		}
	}
</style>
