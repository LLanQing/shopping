<template>
	<!-- 商品分类导航,三级菜单 -->
	<div class="type-nav">
		<div class="container">
			<!-- 绑定鼠标移入移出事件来控制商品分类显示 -->
			<div @mouseenter="showSort" @mouseleave="hideSort">
				<h2 class="all">全部商品分类</h2>
				<!-- 添加过渡动画 -->
				<transition name="sort">
					<div class="sort" v-show="isShow">
						<!--利用事件的委派，给所有分类的父节点绑定点击事件，这样就不用给每个a标签绑定事件 -->
						<!--事件委派问题：
						（1）如何确定我们点击的一定是a标签呢？如何保证我们只能通过点击a标签才跳转呢？
						（2）如何获取子节点标签的商品名称和商品id(**我们是通过商品名称和商品id进行页面跳转的**) 
						-->
						<div class="all-sort-list2" @click="goSearch">
							<div class="item" v-for="c1 in categoryList" :key="c1.categoryId">
								<h3>
									<!-- 解决问题(1)：为三个等级的a标签添加data-*自定义属性data-categoryName绑定商品标签名称来标识a标签 -->
									<!-- 解决问题(2)：为三个等级的a标签再添加data-*自定义属性data-categoryId来获取三个等级a标签的商品id，用于路由跳转。 -->
									<a
										:data-categoryName="c1.categoryName"
										:data-category1Id="c1.categoryId"
										>{{ c1.categoryName }}</a
									>
								</h3>
								<div class="item-list clearfix">
									<div
										class="subitem"
										v-for="c2 in c1.categoryChild"
										:key="c2.categoryId"
									>
										<dl class="fore">
											<dt>
												<a
													:data-categoryName="c2.categoryName"
													:data-category2Id="c2.categoryId"
													>{{ c2.categoryName }}</a
												>
											</dt>
											<dd>
												<em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
													<a
														:data-categoryName="c3.categoryName"
														:data-category3Id="c3.categoryId"
														>{{ c3.categoryName }}</a
													>
												</em>
											</dd>
										</dl>
									</div>
								</div>
							</div>
						</div>
					</div>
				</transition>
			</div>
			<nav class="nav">
				<a href="###">服装城</a>
				<a href="###">美妆馆</a>
				<a href="###">尚品汇超市</a>
				<a href="###">全球购</a>
				<a href="###">闪购</a>
				<a href="###">团购</a>
				<a href="###">有趣</a>
				<a href="###">秒杀</a>
			</nav>
		</div>
	</div>
</template>

<script>
	// 引入mapState、mapGetters、mapActions、mapMutations
	import { mapState } from 'vuex';

	export default {
		name: 'TypeNav',
		data() {
			return { isShow: false };
		},
		computed: {
			//自己写计算属性
			/* categoryList() {
				return this.$store.state.home.categoryList;
			}, */
			//借助mapState生成计算属性：categoryList（对象写法）,属性要写成一个函数
			// ...mapState('home', { categoryList: state => state.categoryList }),
			//数组写法
			...mapState('home', ['categoryList']),
		},
		mounted() {
			// console.log(this.$route);
			//如果是Home组件，就显示TypeNav
			if (this.$route.path === '/') this.isShow = true;
		},
		methods: {
			//三级分类路由跳转到搜索页面的事件回调
			goSearch(event) {
				// 函数中传入event参数，获取当前的点击事件，通过event.target属性获取当前点击节点，
				// 再通过dataset属性获取节点的自定义属性信息(会自动去除data-前缀，且大写变为小写)。
				// console.log(event.target);	//触发事件的dom节点
				// console.log(event.target.dataset);	//dom节点身上的data-*自定义属性
				const { categoryname, category1id, category2id, category3id } =
					event.target.dataset;
				if (categoryname) {
					//存在categoryname属性则一定是a标签，就可以跳转

					// 准备路由跳转的参数对象
					const location = { name: 'search' };

					// 整合传递的query参数
					const query = { categoryName: categoryname };

					//区分一级分类、二级分类、三级分类
					if (category1id) {
						query.category1Id = category1id;
					} else if (category2id) {
						query.category2Id = category2id;
					} else {
						query.category3Id = category3id;
					}
					location.query = query;

					//整合params参数，判断路由中如果有params参数，就需要在传递的时候带上
					if (this.$route.params) location.params = this.$route.params;

					this.$router.push(location);
				}
			},
			//鼠标移入，商品分类显示
			showSort() {
				this.isShow = true;
			},
			//鼠标离开，商品分类隐藏，Home组件除外，因为它需要一直显示
			hideSort() {
				if (this.$route.path !== '/') this.isShow = false;
			},
		},
	};
</script>

<style lang="less" scoped>
	.type-nav {
		border-bottom: 2px solid #e1251b;

		.container {
			width: 1200px;
			margin: 0 auto;
			display: flex;
			position: relative;

			.all {
				width: 210px;
				height: 45px;
				background-color: #e1251b;
				line-height: 45px;
				text-align: center;
				color: #fff;
				font-size: 14px;
				font-weight: bold;
			}

			.nav {
				a {
					height: 45px;
					margin: 0 22px;
					line-height: 45px;
					font-size: 16px;
					color: #333;
				}
			}

			.sort {
				position: absolute;
				left: 0;
				top: 45px;
				width: 210px;
				height: 461px;
				position: absolute;
				background: #fafafa;
				z-index: 999;

				.all-sort-list2 {
					.item {
						h3 {
							line-height: 28px;
							font-size: 14px;
							font-weight: 400;
							overflow: hidden;
							padding: 0 20px;
							margin: 0;

							a {
								color: #333;
							}
						}

						.item-list {
							display: none;
							position: absolute;
							width: 734px;
							min-height: 460px;
							_height: 200px;
							background: #f7f7f7;
							left: 210px;
							border: 1px solid #ddd;
							top: 0;
							z-index: 9999 !important;

							.subitem {
								float: left;
								width: 650px;
								padding: 0 4px 0 8px;

								dl {
									border-top: 1px solid #eee;
									padding: 3px 0;
									overflow: hidden;
									zoom: 1;

									&.fore {
										border-top: 0;
									}

									dt {
										float: left;
										width: 54px;
										line-height: 22px;
										text-align: right;
										padding: 3px 6px 0 0;
										font-weight: 700;
									}

									dd {
										float: left;
										width: 415px;
										padding: 3px 0 0;
										overflow: hidden;

										em {
											float: left;
											height: 14px;
											line-height: 14px;
											padding: 0 8px;
											margin-top: 5px;
											border-left: 1px solid #ccc;
										}
									}
								}
							}
						}

						&:hover {
							.item-list {
								display: block;
							}
						}
					}

					.item:hover {
						background-color: skyblue;
					}
				}
			}

			/* vue封装的动画默认样式名称开头是v，可以改名字
    		在transition标签加上name="xxx"，name开头就必须是xxx */
			/*进入的起点,离开的终点  */
			.sort-enter,
			.sort-leave-to {
				opacity: 0;
			}

			/*进入过程中, 离开过程中 */
			.sort-enter-active,
			.sort-leave-active {
				transition: 0.5 linear;
			}

			/* 进入的终点，离开的起点 */
			.sort-enter-to,
			.sort-leave {
				opacity: 1;
			}
		}
	}
</style>
