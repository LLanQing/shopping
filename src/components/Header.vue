<template>
	<!-- 头部 -->
	<header class="header">
		<!-- 头部的第一行 -->
		<div class="top">
			<div class="container">
				<div class="loginList">
					<p>尚品汇欢迎您！</p>
					<!-- 没有用户名：未登录 -->
					<p v-if="!userName">
						<span>请</span>
						<router-link to="/login">登录</router-link>
						<router-link to="/register" class="register">免费注册</router-link>
					</p>
					<!-- 登录了 -->
					<p v-else>
						<a>{{ userName }}</a>
						<a class="register" @click="logout">退出登录</a>
					</p>
				</div>
				<div class="typeList">
					<router-link to="/center">我的订单</router-link>
					<router-link to="/shopcart">我的购物车</router-link>
					<router-link to="/communication">组件间通信</router-link>
					<a href="###">尚品汇会员</a>
					<a href="###">企业采购</a>
					<a href="###">关注尚品汇</a>
					<a href="###">合作招商</a>
					<a href="###">商家后台</a>
				</div>
			</div>
		</div>
		<!--头部第二行 搜索区域-->
		<div class="bottom">
			<h1 class="logoArea">
				<router-link class="logo" to="/">
					<img src="/images/logo.png" alt="" />
				</router-link>
			</h1>
			<div class="searchArea">
				<form action="###" class="searchForm">
					<input
						type="text"
						id="autocomplete"
						class="input-error input-xxlarge"
						v-model="keyword"
					/>
					<!-- 点击按钮，跳转到搜索页面 -->
					<button
						class="sui-btn btn-xlarge btn-danger"
						type="button"
						@click="goSearch"
					>
						搜索
					</button>
				</form>
			</div>
		</div>
	</header>
</template>

<script>
	import { mapGetters } from 'vuex';

	export default {
		name: 'Header',
		data() {
			return {
				keyword: '',
			};
		},
		computed: {
			...mapGetters('user', ['userName']),
			// userName() {
			// 	//从仓库中获取获取用户信息(直接从localStorage里面获取的数据不是响应式的,里面的数据更新了，计算属性不会更新)
			// 	console.log('从仓库获取用户信息');
			// 	return this.$store.getters['user/userName'];
			// },
		},
		//监听路由变化，如果路由中的params参数改变，输入框的keyword也需要改变(推荐方案)
		// watch: {
		// 	$route(newValue) {
		// 		this.keyword = newValue.params.keyword;
		// 	},
		// },
		//通过全局事件总线通知兄弟组件Header清除关键字
		mounted() {
			this.$bus.$on('clear', () => {
				this.keyword = '';
			});
		},
		methods: {
			//搜索按钮的回调函数，跳转到搜索页面
			goSearch() {
				/* 当传入params传入的参数为空字符串时，路由跳转地址不正确的解决办法：
				判断为空时传入undefined，当我们传递的参数为空串时地址栏url也可以保持正常，
				原因：传参的值为undefined时，ajax会处理将这个参数去掉不传。 */
				//整合params参数，判断路由中如果有params参数，就需要在传递的时候带上
				const location = {
					name: 'search', //对象写法，则不能使用 path 配置项，必须使用 name 配置
					params: { keyword: this.keyword || undefined }, //加入||undefined，当我们传递的参数为空串时地址栏url也可以保持正常
				};
				if (this.$route.query) location.query = this.$route.query;
				this.$router.push(location);
			},

			// 退出登录
			async logout() {
				await this.$store.dispatch('user/logout');
				// 登出成功跳转到首页
				this.$router.push('/');
			},
		},
	};
</script>

<style lang="less" scoped>
	.header {
		& > .top {
			background-color: #eaeaea;
			height: 30px;
			line-height: 30px;

			.container {
				width: 1200px;
				margin: 0 auto;
				overflow: hidden;

				.loginList {
					float: left;

					p {
						float: left;
						margin-right: 10px;

						.register {
							border-left: 1px solid #b3aeae;
							padding: 0 5px;
							margin-left: 5px;
							cursor: pointer;
						}
					}
				}

				.typeList {
					float: right;

					a {
						padding: 0 10px;

						& + a {
							border-left: 1px solid #b3aeae;
						}
					}
				}
			}
		}

		& > .bottom {
			width: 1200px;
			margin: 0 auto;
			overflow: hidden;

			.logoArea {
				float: left;

				.logo {
					img {
						width: 175px;
						margin: 25px 45px;
					}
				}
			}

			.searchArea {
				float: right;
				margin-top: 35px;

				.searchForm {
					overflow: hidden;

					input {
						box-sizing: border-box;
						width: 490px;
						height: 32px;
						padding: 0px 4px;
						border: 2px solid #ea4a36;
						float: left;

						&:focus {
							outline: none;
						}
					}

					button {
						height: 32px;
						width: 68px;
						background-color: #ea4a36;
						border: none;
						color: #fff;
						float: left;
						cursor: pointer;

						&:focus {
							outline: none;
						}
					}
				}
			}
		}
	}
</style>
