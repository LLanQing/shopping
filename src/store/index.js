// 该文件用于创建Vuex中最核心的store
// 引入vuex插件
import Vuex from 'vuex';
// 引入Vue
import Vue from 'vue';
// 引入其他store模块
import home from './home.js';
import search from './search.js';
import detail from './detail';
import shopcart from './shopcart';
import user from './user';
import trade from './trade';

// 使用vuex插件
Vue.use(Vuex);

// 创建并暴露store,创建Store实例之前必须先使用插件
export default new Vuex.Store({
	modules: {
		home,
		search,
		detail,
		shopcart,
		user,
		trade,
	},
});
