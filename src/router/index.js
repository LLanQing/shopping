//引入vue-router
import VueRouter from 'vue-router';
// 引入路由组件，路径不写全，默认读取该路径下的index文件
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

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
	routes: [
		{
			path: '/home',
			component: Home,
			//meta配置中的属性提供给router使用，
			//isFooterShow:判断页面是否需要显示Footer
			meta: { isFooterShow: true },
		},
		{
			name: 'search', // 使用name配置命名路由可以简化路由的跳转。
			path: '/search/:keyWords?', //使用占位符声明接收params参数,?表示该参数可传可不传
			component: Search,
			meta: { isFooterShow: true },
		},
		{
			path: '/login',
			component: Login,
			meta: { isFooterShow: false }, //登录和注册页面不需要显示Footer组件
		},
		{
			path: '/register',
			component: Register,
			meta: { isFooterShow: false },
		},
		//重定向，项目启动时重定向到首页
		{
			path: '*',
			redirect: '/home',
		},
	],
});

//全局前置守卫
/* router.beforeEach((to, from, next) => {
	// isFooterShow为true时，路由才会跳转
	if (to.meta.isFooterShow) {
		next();
	}
}); */

// 将路由实例暴露出去
export default router;
