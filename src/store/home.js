// 将Home组件的状态相关的代码封装在home模块中
//引入统一请求管理模块的请求
import {
	reqGetCategoryList,
	reqGetBannerList,
	reqGetFloorList,
} from '@/api/index.js';

export default {
	/* 默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的
		 ——这样使得多个模块能够对同一 mutation 或 action 作出响应。
		 启用了命名空间的 getter 和 action 会收到局部化的 getter，dispatch 和 commit。
     注意：开启命名空间后，在组件中发送给vuex的请求都需要带上命名空间的名称！！！
   */

	// 开启命名空间
	namespaced: true,
	// 准备state——用于存储数据
	state: {
		//state中的默认初始值不能随便写，要根据服务器返回的数据类型进行初始化
		//商品菜单数据
		categoryList: [],
		//轮播图数据
		bannerList: [],
		// 商品展示数据
		floorList: [],
	},

	//准备actions——用于响应组件中的动作,处理业务逻辑、ajax请求等
	actions: {
		/* 有一个与组件dispatch发过来的type一样的key对应的方法去处理事件
	    actions里面的事件回调函数收到两个参数:
        context:上下文对象，与 store 实例具有相同方法和属性
        value:dispatch传过来的值 
    */
		async getCategoryList(context, value) {
			console.log('发送axios请求---获取商品菜单列表');
			const result = await reqGetCategoryList();
			context.commit('CATEGORYLIST', result);
		},

		async getBannerList(context) {
			console.log('发送axios请求---获取轮播图图片列表');
			const result = await reqGetBannerList();
			context.commit('BANNERLIST', result);
		},

		async getFloorList(context) {
			console.log('发送axios请求---获取商品展示列表');
			const result = await reqGetFloorList();
			context.commit('FLOORLIST', result);
		},
	},

	//准备mutations——用于操作数据（state）
	mutations: {
		//处理action传过来的事件
		/* mutations里面的事件回调函数收到两个参数：
          state,
          value:commit()传递过来的参数
    */
		CATEGORYLIST(state, value) {
			console.log('操作state数据---存储商品菜单列表');
			state.categoryList = value;
		},

		BANNERLIST(state, value) {
			console.log('操作state数据---存储轮播图图片列表');
			state.bannerList = value;
		},

		FLOORLIST(state, value) {
			console.log('操作state数据---存储商品展示列表');
			state.floorList = value;
		},
	},

	// 当 state 中的数据需要经过加工后再使用时，可以使用 getters 加工。
	//类似于computed
	getters: {},
};
