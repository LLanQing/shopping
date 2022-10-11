//将路由配置封装成一个模块
// 引入路由组件，路径不写全，默认读取该路径下的index文件
import Home from '@/pages/Home';
// import Search from '@/pages/Search';
// import Login from '@/pages/Login';
// import Register from '@/pages/Register';
// import Detail from '@/pages/Detail';
// import AddCartSuccess from '@/pages/AddCartSuccess';
// import ShopCart from '@/pages/ShopCart';

/* 当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。
	如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，
	这样就更加高效了。 */

export default [
	{
		path: '/center',
		component: () => import('@/pages/Center'),
		//meta配置中的属性提供给router使用，
		//isFooterShow:判断页面是否需要显示Footer
		// isRequiredAuth:判断页面是否需要用户信息验证
		meta: { isFooterShow: true, isRequiredAuth: true },
		children: [
			{
				path: 'myorder', //二级路由要么不写/，要么写全：'/center/myorder'。*VueRouter已经自动加上了/*
				component: () => import('@/pages/Center/MyOrder/MyOrder'),
			},
			{
				path: 'grouporder',
				component: () => import('@/pages/Center/GroupOrder/GroupOrder'),
			},
			//这只默认展示子路由，进入Center组件重定向到myorder
			{
				path: '',
				redirect: 'myorder',
			},
		],
	},
	{
		path: '/paysuccess',
		component: () => import('@/pages/PaySuccess'),
		//meta配置中的属性提供给router使用，
		//isFooterShow:判断页面是否需要显示Footer
		// isRequiredAuth:判断页面是否需要用户信息验证
		meta: { isFooterShow: true, isRequiredAuth: true },
		// 独享守卫，只能从交易界面, 才能跳转到支付界面
		beforeEnter(to, from, next) {
			// 如果不是从购物车页面跳转的，则留在当前页面
			// 有bug，当前页刷新的from.path == '/'，所以判断路由最好用meta添加标识而不是用path判断
			if (from.path === '/pay') {
				next();
			} else {
				//next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
				next(from.path);
			}
		},
	},
	{
		path: '/pay',
		component: () => import('@/pages/Pay'),
		//meta配置中的属性提供给router使用，
		//isFooterShow:判断页面是否需要显示Footer
		// isRequiredAuth:判断页面是否需要用户信息验证
		meta: { isFooterShow: true, isRequiredAuth: true },
		// 独享守卫，只能从交易界面, 才能跳转到支付界面
		beforeEnter(to, from, next) {
			// 如果不是从购物车页面跳转的，则留在当前页面
			// from.path == '/'当前页面刷新
			if (from.path === '/trade') {
				next();
			} else {
				//next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
				next(from.path);
			}
		},
	},
	{
		path: '/trade',
		component: () => import('@/pages/Trade'),
		//meta配置中的属性提供给router使用，
		//isFooterShow:判断页面是否需要显示Footer
		// isRequiredAuth:判断页面是否需要用户信息验证
		meta: { isFooterShow: true, isRequiredAuth: true },
		// 独享守卫，只能从购物车界面, 才能跳转到交易界面
		beforeEnter(to, from, next) {
			// 如果不是从购物车页面跳转的，则留在当前页面
			// from.path == '/'当前页面刷新
			console.log(to, from);
			if (from.path == '/shopcart') {
				next();
			} else {
				//next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
				// next(false);	//有bug，无法跳转到from 路由对应的地址
				next(from.path);
			}
		},
	},
	{
		path: '/shopcart',
		component: () => import('@/pages/ShopCart'),
		//meta配置中的属性提供给router使用，
		//isFooterShow:判断页面是否需要显示Footer
		// isRequiredAuth:判断页面是否需要用户信息验证
		meta: { isFooterShow: true, isRequiredAuth: true },
	},
	{
		path: '/addcartsuccess',
		component: () => import('@/pages/AddCartSuccess'),
		//meta配置中的属性提供给router使用，
		//isFooterShow:判断页面是否需要显示Footer
		// isRequiredAuth:判断页面是否需要用户信息验证
		meta: { isFooterShow: true, isRequiredAuth: true },
	},
	{
		path: '/detail/:skuId?',
		component: () => import('@/pages/Detail'),
		//meta配置中的属性提供给router使用，
		//isFooterShow:判断页面是否需要显示Footer
		meta: { isFooterShow: true },
	},
	{
		path: '/',
		name: 'home',
		component: () => import('@/pages/Home'),
		//meta配置中的属性提供给router使用，
		//isFooterShow:判断页面是否需要显示Footer
		meta: { isFooterShow: true },
	},
	{
		name: 'search', // 使用name配置命名路由可以简化路由的跳转。
		path: '/search/:keyword?', //使用占位符声明接收params参数,?表示该参数可传可不传
		component: () => import('@/pages/Search'),
		meta: { isFooterShow: true },
	},
	{
		path: '/login',
		component: () => import('@/pages/Login'),
		meta: { isFooterShow: false }, //登录和注册页面不需要显示Footer组件
		// 独享守卫
		beforeEnter(to, from, next) {
			// 用户未登录，能访问登录页面
			if (!localStorage.getItem('userInfo')) {
				next();
			} else {
				// 已经登录了，跳转到首页Home
				next('/');
			}
		},
	},
	{
		path: '/register',
		component: () => import('@/pages/Register'),
		meta: { isFooterShow: false },
		// 独享守卫
		beforeEnter(to, from, next) {
			// 用户未登录，能访问登录页面
			if (!localStorage.getItem('userInfo')) {
				next();
			} else {
				// 已经登录了，跳转到首页Home
				next('/');
			}
		},
	},
	//重定向，项目启动时重定向到首页
	{
		path: '*',
		redirect: '/',
	},

	// 测试路由
	{
		path: '/communication',
		component: () => import('@/pages/Communication/Communication'),
		children: [
			{
				path: 'event',
				component: () => import('@/pages/Communication/EventTest/EventTest'),
				meta: {
					isHideFooter: true,
				},
			},
			{
				path: 'model',
				component: () => import('@/pages/Communication/ModelTest/ModelTest'),
				meta: {
					isHideFooter: true,
				},
			},
			{
				path: 'sync',
				component: () => import('@/pages/Communication/SyncTest/SyncTest'),
				meta: {
					isHideFooter: true,
				},
			},
			{
				path: 'attrs-listeners',
				component: () =>
					import('@/pages/Communication/AttrsListenersTest/AttrsListenersTest'),
				meta: {
					isHideFooter: true,
				},
			},
			{
				path: 'children-parent',
				component: () =>
					import('@/pages/Communication/ChildrenParentTest/ChildrenParentTest'),
				meta: {
					isHideFooter: true,
				},
			},
			{
				path: 'scope-slot',
				component: () =>
					import('@/pages/Communication/ScopeSlotTest/ScopeSlotTest'),
				meta: {
					isHideFooter: true,
				},
			},
		],
	},
];
