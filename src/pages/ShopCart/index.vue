<template>
	<div class="cart">
		<h4>全部商品</h4>
		<div class="cart-main">
			<div class="cart-th">
				<div class="cart-th1">全部</div>
				<div class="cart-th2">商品</div>
				<div class="cart-th3">单价（元）</div>
				<div class="cart-th4">数量</div>
				<div class="cart-th5">小计（元）</div>
				<div class="cart-th6">操作</div>
			</div>
			<!-- 购物车列表 -->
			<div class="cart-body">
				<ul
					class="cart-list"
					v-for="cartInfo in cartInfoList"
					:key="cartInfo.id"
				>
					<!-- 商品可选框 -->
					<li class="cart-list-con1">
						<input
							type="checkbox"
							name="chk_list"
							:checked="cartInfo.isChecked == 1"
							@change="updateChecked(cartInfo.skuId, $event.target.checked * 1)"
						/>
					</li>
					<!-- 商品图片 -->
					<li class="cart-list-con2">
						<img :src="cartInfo.imgUrl" />
						<div class="item-msg">{{ cartInfo.skuName }}</div>
					</li>
					<!-- 商品单价 -->
					<li class="cart-list-con4">
						<span class="price">{{ (cartInfo.skuPrice || 0).toFixed(2) }}</span>
					</li>
					<!-- 商品数量 -->
					<li class="cart-list-con5">
						<a
							href="javascript:void(0)"
							class="mins"
							@click="handler('mins', -1, cartInfo)"
							:class="{ 'click-disabled': cartInfo.skuNum == 1 }"
							>-</a
						>
						<input
							autocomplete="off"
							type="text"
							minnum="1"
							class="itxt"
							:value="cartInfo.skuNum"
							@change="handler('change', $event.target.value * 1, cartInfo)"
						/>
						<a
							href="javascript:void(0)"
							class="plus"
							@click="handler('add', 1, cartInfo)"
							>+</a
						>
					</li>
					<!-- 商品小计 -->
					<li class="cart-list-con6">
						<span class="sum">{{
							(cartInfo.skuNum * cartInfo.skuPrice).toFixed(2)
						}}</span>
					</li>
					<!-- 操作 -->
					<li class="cart-list-con7">
						<a href="#none" class="sindelet" @click="deleteCart(cartInfo.skuId)"
							>删除</a
						>
						<br />
						<a href="#none">移到收藏</a>
					</li>
				</ul>
			</div>
		</div>
		<!-- 购物车工具按钮 -->
		<div class="cart-tool">
			<div class="select-all">
				<input class="chooseAll" type="checkbox" v-model="isCheckedAll" />
				<span>全选</span>
			</div>
			<div class="option">
				<a href="#none" @click="deleteCheckedCart">删除选中的商品</a>
				<a href="#none">移到我的关注</a>
				<a href="#none">清除下柜商品</a>
			</div>
			<div class="money-box">
				<div class="chosed">
					已选择 <span>{{ chosedSum }}</span
					>件商品
				</div>
				<div class="sumprice">
					<em>总价（不含运费） ：</em>
					<i class="summoney">{{ sumPrice }}</i>
				</div>
				<div class="sumbtn">
					<router-link class="sum-btn" to="/trade">结算</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import {
		reqAddOrUpdateShopCart,
		reqDeleteCartById,
		reqUpdateCheckedById,
	} from '@/api';
	import throttle from '@/utils/throttle';

	export default {
		name: 'ShopCart',
		computed: {
			...mapGetters('shopcart', ['cartList']),
			//购物车数据
			cartInfoList() {
				return this.cartList.cartInfoList || [];
			},

			//计算已勾选的商品总数量
			chosedSum() {
				let sum = 0;
				this.cartInfoList.forEach(cartInfo => {
					if (cartInfo.isChecked) {
						sum += cartInfo.skuNum;
					}
				});
				return sum;
			},

			//计算已勾选的商品总价格
			sumPrice() {
				let total = 0;
				this.cartInfoList.forEach(cartInfo => {
					if (cartInfo.isChecked) {
						total += cartInfo.skuNum * cartInfo.skuPrice;
					}
				});
				return total.toFixed(2);
			},

			//判断底部‘全选’复选框是否勾选，【全部产品都选中时，才勾选】
			// 点击全选时，勾选所有商品；取消全选时，取消所有商品
			/* array.every() 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。
					如果回调函数的每一次返回都为 truthy 值，返回 true，否则返回 false。
					备注： 若收到一个空数组，此方法在任何情况下都会返回 true。 */
			isCheckedAll: {
				get() {
					//购物车没有商品时，全选按钮为false
					if (this.cartInfoList.length > 0) {
						return this.cartInfoList.every(cartInfo => {
							return cartInfo.isChecked;
						});
					} else {
						return false;
					}
				},
				//全选按钮修改产品的选中状态
				async set(value) {
					// 因为是批量发送axios请求，可能有某个或多个请求失败，需要使用all方法判断是否所有请求都成功
					const promiseArr = [];
					this.cartInfoList.forEach(cartInfo => {
						// 商品状态与全选框状态不一样就改变商品状态
						if (cartInfo.isChecked != value) {
							let promise = reqUpdateCheckedById(cartInfo.skuId, value * 1);
							promiseArr.push(promise);
						}
					});
					await Promise.all(promiseArr);
					// 等待所有请求都成功，重新获取数据
					this.getData();
				},
			},
		},
		// 组件挂载完毕获取数据
		mounted() {
			this.getData();
		},

		methods: {
			// 将派发actions获取购物车列表数据封装成函数
			getData() {
				this.$store.dispatch('shopcart/getCartList');
			},

			//修改某一个产品的个数[节流]
			handler: throttle(async function (type, disNum, cartInfo) {
				//type:为了区分这三个元素
				//disNum形参:+ 变化量（1）  -变化量（-1）   input最终的个数（并不是变化量）
				//cartInfo:哪一个产品【身上有id】
				//向服务器发请求，修改数量
				// console.log(type);
				// console.log(disNum);
				// console.log(cartInfo);
				switch (type) {
					//加号
					case 'add':
						disNum = 1;
						break;
					case 'minus':
						//判断产品的个数大于1，才可以传递给服务器-1
						//如果出现产品的个数小于等于1，传递给服务器个数0（原封不动）
						disNum = cartInfo.skuNum > 1 ? -1 : 0;
						break;
					case 'change':
						// //用户输入进来的最终量，如果非法的（带有汉字|出现负数），带给服务器数字零
						if (isNaN(disNum) || disNum < 1) {
							disNum = 0;
						} else {
							//属于正常情况（小数：取证），带给服务器变化的量 用户输入进来的 - 产品的起始个数
							disNum = parseInt(disNum) - cartInfo.skuNum;
						}
						// disNum = (isNaN(disNum)||disNum<1)?0:parseInt(disNum) - cartInfo.skuNum;
						break;
				}
				//没有返回数据的不需要vuex，直接发请求
				//修改购物车物品数量，若成功则执行后面的代码，失败则不执行
				await reqAddOrUpdateShopCart(cartInfo.skuId, disNum);
				//再一次获取服务器最新的数据进行展示
				this.getData();
			}, 1000),

			// 修改商品选中状态，没有返回数据的不需要vuex，直接发请求
			async updateChecked(skuId, isChecked) {
				console.log(isChecked);
				await reqUpdateCheckedById(skuId, isChecked);
				//修改商品选中状态成功后，重新获取购物车列表数据
				this.getData();
			},

			// 删除购物车物品，没有返回数据的不需要vuex，直接发请求
			async deleteCart(skuId) {
				await reqDeleteCartById(skuId);
				//删除成功后，重新获取购物车列表数据
				this.getData();
			},

			// 删除所有选中的商品
			async deleteCheckedCart() {
				// 因为是批量发送axios请求，可能有某个或多个请求失败，需要使用all方法判断是否所有请求都成功
				const promiseArr = [];
				this.cartInfoList.forEach(cartInfo => {
					// 商品状态与全选框状态不一样就改变商品状态
					if (cartInfo.isChecked == 1) {
						let promise = reqDeleteCartById(cartInfo.skuId);
						promiseArr.push(promise);
					}
				});
				await Promise.all(promiseArr);
				// 等待所有请求都成功，重新获取数据
				this.getData();
			},
		},
	};
</script>

<style lang="less" scoped>
	.cart {
		width: 1200px;
		margin: 0 auto;

		h4 {
			margin: 9px 0;
			font-size: 14px;
			line-height: 21px;
		}

		.cart-main {
			.cart-th {
				background: #f5f5f5;
				border: 1px solid #ddd;
				padding: 10px;
				overflow: hidden;

				& > div {
					float: left;
				}

				.cart-th1 {
					width: 25%;

					input {
						vertical-align: middle;
					}

					span {
						vertical-align: middle;
					}
				}

				.cart-th2 {
					width: 25%;
				}

				.cart-th3,
				.cart-th4,
				.cart-th5,
				.cart-th6 {
					width: 12.5%;
				}
			}

			.cart-body {
				margin: 15px 0;
				border: 1px solid #ddd;

				.cart-list {
					padding: 10px;
					border-bottom: 1px solid #ddd;
					overflow: hidden;

					& > li {
						float: left;
					}

					.cart-list-con1 {
						width: 15%;
					}

					.cart-list-con2 {
						width: 35%;

						img {
							width: 82px;
							height: 82px;
							float: left;
						}

						.item-msg {
							float: left;
							width: 150px;
							margin: 0 10px;
							line-height: 18px;
						}
					}

					.cart-list-con4 {
						width: 10%;
					}

					.cart-list-con5 {
						width: 17%;

						.mins {
							border: 1px solid #ddd;
							border-right: 0;
							float: left;
							color: #666;
							width: 6px;
							text-align: center;
							padding: 8px;
						}

						input {
							border: 1px solid #ddd;
							width: 40px;
							height: 33px;
							float: left;
							text-align: center;
							font-size: 14px;
						}

						.plus {
							border: 1px solid #ddd;
							border-left: 0;
							float: left;
							color: #666;
							width: 6px;
							text-align: center;
							padding: 8px;
						}

						.click-disabled {
							// 给a标签添加css属性，禁止点击a标签
							pointer-events: none; //阻止所有点击事件
						}
					}

					.cart-list-con6 {
						width: 10%;

						.sum {
							font-size: 16px;
						}
					}

					.cart-list-con7 {
						width: 13%;

						a {
							color: #666;
						}
					}
				}
			}
		}

		.cart-tool {
			overflow: hidden;
			border: 1px solid #ddd;

			.select-all {
				padding: 10px;
				overflow: hidden;
				float: left;

				span {
					vertical-align: middle;
				}

				input {
					vertical-align: middle;
				}
			}

			.option {
				padding: 10px;
				overflow: hidden;
				float: left;

				a {
					float: left;
					padding: 0 10px;
					color: #666;
				}
			}

			.money-box {
				float: right;

				.chosed {
					line-height: 26px;
					float: left;
					padding: 0 10px;
				}

				.sumprice {
					width: 200px;
					line-height: 22px;
					float: left;
					padding: 0 10px;

					.summoney {
						color: #c81623;
						font-size: 16px;
					}
				}

				.sumbtn {
					float: right;

					a {
						display: block;
						position: relative;
						width: 96px;
						height: 52px;
						line-height: 52px;
						color: #fff;
						text-align: center;
						font-size: 18px;
						font-family: 'Microsoft YaHei';
						background: #e1251b;
						overflow: hidden;
					}
				}
			}
		}
	}
</style>
