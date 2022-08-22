import Vue from 'vue';
import App from './App.vue';
// 引入vue-router
import VueRouter from 'vue-router';
// 引入router,路径不写全，默认引入文件夹下的index文件
import router from './router';

// 引入商品三级分类导航菜单
import TypeNav from '@/components/TypeNav.vue';
// 引入轮播图组件
import Carousel from '@/components/Carousel.vue';
// 引入分页组件
import Pagination from '@/components/Pagination';

// 引入store,路径不写全，默认引入文件夹下的index文件
import store from './store';
// 引入mock模拟数据，需要在程序启动时执行一次
import '@/mock/mockServer.js';

//关闭生产提示
Vue.config.productionTip = false;
//使用vue-router插件
Vue.use(VueRouter);

//第一个参数：全局组件名字，第二个参数：全局组件
//将商品三级分类导航菜单注册为全局组件
Vue.component(TypeNav.name, TypeNav);
//将轮播图注册为全局组件
Vue.component('Carousel', Carousel);
//将分页器注册为全局组件
Vue.component('Pagination', Pagination);

new Vue({
	// 注册App组件
	render: h => h(App),
	// 注册路由，router配置简写方式,组件中都会拥有$router $route属性(在Vue的原型对象中)
	router,
	//注册store,此时组件中都会拥有$store属性(在Vue实例和组件实例中)
	store,

	beforeCreate() {
		Vue.prototype.$bus = this; //安装全局事件总线，$bus就是当前应用的vm
	},
}).$mount('#app'); //指定根容器
