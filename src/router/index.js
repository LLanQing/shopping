//引入vue-router
import VueRouter from 'vue-router';
// 引入路由配置模块
import routes from './routes.js';

// 第三种方式-重写vueRouter的push和replace方法
//1、先把VueRouter原型对象的push和replace，保存一份
const originPush = VueRouter.prototype.push;
const originReplace = VueRouter.prototype.replace;
//2、重写push|replace
/**
 * @description: 重写push方法，处理次发送相同参数的push和replace请求报错问题
 * @param {*} location	目标路由和传递的参数
 * @param {*} resolve		成功回调
 * @param {*} reject		失败回调
 * @return {*}
 */
VueRouter.prototype.push = function (location, resolve, reject) {
	//如果有成功/失败回调就直接传递过去，没有则添加空的成功/失败回调
	if (resolve && reject) {
		originPush.call(this, location, resolve, reject); //将路由实例对象和其他参数传递给push方法
	} else {
		originPush.call(
			this,
			location,
			() => {},
			() => {}
		); //传入空回调，不让报错显示，但是会在控制台打印undefined
	}
};
VueRouter.prototype.replace = function (location, resolve, reject) {
	//如果有成功/失败回调就直接传递过去，没有则添加空的成功/失败回调
	if (resolve && reject) {
		originReplace.call(this, location, resolve, reject); //将路由实例对象和其他参数传递给push方法
	} else {
		originReplace.call(
			this,
			location,
			() => {},
			() => {}
		); //传入空回调，不让报错显示，但是会在控制台打印undefined
	}
};

// 创建路由实例
const router = new VueRouter({
	//mode配置路由工作模式，其值有两个：'hash'、'history'，默认是hash模式
	mode: 'history',
	//路由配置
	routes,
	//滚动行为
	scrollBehavior(to, from, savedPosition) {
		// return 期望滚动到哪个的位置
		// 始终滚动到顶部
		return { y: 0 };
	},
});

//全局前置守卫
router.beforeEach((to, from, next) => {
	// isRequiredAuth为true时，需要验证用户信息路由才会跳转
	if (to.meta.isRequiredAuth) {
		if (localStorage.getItem('userInfo')) {
			// 1.如果有用户信息则跳转
			next();
		} else {
			/**
			 * 2.没有用户信息则跳转到登录页面
			 * 	2.1并且登录完成之后会跳转到登录前想去的页面（比如想去购物车，
			 * 		 没登录会跳转到登录页面，然后登录成功后应该跳转到购物车而不是主页）
			 * 	2.2所以需要保存想要去的页面的路由，这里使用to.path保存在query参数里面,
			 * 		 在登录成功后，判断query中有没有redirect，如果有就跳到redirect中
			 */
			next(`/login?redirect=${to.path}`);
		}
	} else {
		next();
	}
});

// 将路由实例暴露出去
export default router;
