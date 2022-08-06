//引入vue-router
import VueRouter from "vue-router";
// 引入路由组件，路径不写全，默认读取该路径下的index文件
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

// 创建路由实例
const router = new VueRouter({
	routes: [
		{
			path: "/home",
			component: Home,
			//meta配置中的属性提供给router使用，添加一个属性判断页面是否需要显示Footer
			meta: { isFooterShow: true },
		},
		{
			name: "search", // 使用name配置命名路由可以简化路由的跳转。
			path: "/search/:keyWords?", //使用占位符声明接收params参数,?表示该参数可传可不传
			component: Search,
			meta: { isFooterShow: true },
		},
		{
			path: "/login",
			component: Login,
			meta: { isFooterShow: false }, //登录和注册页面不需要显示Footer组件
		},
		{
			path: "/register",
			component: Register,
			meta: { isFooterShow: false },
		},
		//重定向，项目启动时重定向到首页
		{
			path: "*",
			redirect: "/home",
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
