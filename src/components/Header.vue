<template>
	<!-- 头部 -->
	<header class="header">
		<!-- 头部的第一行 -->
		<div class="top">
			<div class="container">
				<div class="loginList">
					<p>尚品汇欢迎您！</p>
					<p>
						<span>请</span>
						<router-link to="/login">登录</router-link>
						<router-link to="/register" class="register">免费注册</router-link>
					</p>
				</div>
				<div class="typeList">
					<a href="###">我的订单</a>
					<a href="###">我的购物车</a>
					<a href="###">我的尚品汇</a>
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
				<router-link class="logo" to="/home">
					<img src="@/images/logo.png" alt="" />
				</router-link>
			</h1>
			<div class="searchArea">
				<form action="###" class="searchForm">
					<input
						type="text"
						id="autocomplete"
						class="input-error input-xxlarge"
						v-model="keyWords"
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
export default {
	name: "Header",
	data() {
		return {
			keyWords: "",
		};
	},
	methods: {
		//搜索按钮的回调函数，跳转到搜索页面
		goSearch() {
			/* 1.使用模板字符串的形式传参,如果同时传递params、query参数，
			params的/keyWords必须写在前面，否则会被当做query参数的字符串 ，
			当没有传递params参数是，可以在路由配置占位符时添加一个'?'，表示该参数可传可不传*/
			// this.$router.push(
			// 	`/search/${this.keyWords}?KW=${this.keyWords.toUpperCase()}`
			// );

			// 2.使用对象形式传参
			/* 关于使用对象形式传递参数时path配置与params参数问题:
			使用path配置，导致params读取的是path路径上的参数，但是path没有传参数，所以传递过去params是undefined
			path: '/search',
			如果要用path配置传递params参数，就必须像字符串写法一样传递完整的参数如下：
			path: `/search/${this.keyWords}?KW=${this.keyWords.toUpperCase()}`, */
			const result = this.$router.push({
				name: "search", //对象写法，传递params参数时则不能使用 path 配置项，必须使用 name 配置
				params: { keyWords: this.keyWords },
				query: { KW: this.keyWords.toUpperCase() },
			});
			console.log(result);

			/* //指定 params 参数可传可不传,在路由配置里面path配置的params占位符后面加上一个?
			this.$router.push({name:"Search",query:{keyword:this.keyword}}) */

			/* //当传入params传入的参数为空字符串时，路由跳转地址不正确的解决办法
			this.$router.push({
				name: "search", //对象写法，则不能使用 path 配置项，必须使用 name 配置
				params: { keyWords: "" || undefined }, //加入||undefined，当我们传递的参数为空串时地址栏url也可以保持正常
				query: { KW: this.keyWords.toUpperCase() },
			}); */

			/* // 解决避免对当前位置的冗余导航问题:NavigationDuplicated: Avoided redundant navigation to current location
			//三种方式
			//第一种，捕获到错误但是不处理（或者做刷新页面的处理）
			this.$router.push({
				//对象写法，传递params参数时则不能使用 path 配置项，必须使用 name 配置，否则params传递过去的是undefined
					name: "search", 
				params: { keyWords: this.keyWords },
				query: { KW: this.keyWords.toUpperCase() },
			}).catch(() => {});	//添加catch()捕获错误但是不做操作，这样就不会刷新页面
			//第二种，在传参的时候加上时间戳
			this.$router.push({
				name: "search", //对象写法，则不能使用 path 配置项，必须使用 name 配置
				params: { keyWords: this.keyWords },
				query: { KW: this.keyWords.toUpperCase(), timestamp:Date.now() },	//或者在传参的时候加上时间戳
			}); */
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
