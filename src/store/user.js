// 将Search组件的状态相关的代码封装在search模块中
//引入统一请求管理模块的请求
import {
	reqGetCode,
	reqUserRegister,
	reqUserLogin,
	reqUserInfo,
	reqLogout,
} from '@/api';

export default {
	/* 默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的
		 ——这样使得多个模块能够对同一 mutation 或 action 作出响应。
		 启用了命名空间的 getter 和 action 会收到局部化的 getter，dispatch 和 commit。 */
	// 开启命名空间
	namespaced: true,
	// 准备state——用于存储数据
	state: {
		// 验证码
		code: '',
		// 用户信息
		userInfo: JSON.parse(localStorage.getItem('userInfo')) || {},
	},

	//准备actions——用于响应组件中的动作,处理业务逻辑、ajax请求等
	actions: {
		/* 有一个与组件dispatch发过来的type一样的key,对应的方法去处理事件
	    actions里面的事件回调函数收到两个参数:
        context:上下文对象，与 store 实例具有相同方法和属性
        value:dispatch传过来的值 
		*/
		// 获取验证码
		async getCode(context, phone) {
			console.log('发送axios请求---获取验证码');
			const result = await reqGetCode(phone);
			context.commit('CODE', result);
			return result;
		},
		// 用户注册
		async userRegister(context, data) {
			console.log('发送axios请求---用户注册');
			return await reqUserRegister(data);
			// return Promise.reject('注册失败');
		},
		// 用户登录
		async userLogin(context, data) {
			console.log('发送axios请求---用户登录');
			const result = await reqUserLogin(data);
			//将返回的token存储到localStorage
			localStorage.setItem('TOKEN', result.token);
			return result;
		},
		// 获取用户信息
		async userInfo(context) {
			console.log('发送axios请求---获取用户信息');
			const result = await reqUserInfo();
			context.commit('USERINFO', result);
			// 将返回的用户信息存储到localStorage
			localStorage.setItem('userInfo', JSON.stringify(result));
			return result;
		},
		// 退出登录
		async logout(context) {
			console.log('发送axios请求---退出登录');
			const result = await reqLogout();
			// 清空仓库中的用户信息
			context.commit('CLEAR');
			// 清空浏览器缓存的token和用户信息
			localStorage.clear();
			return result;
		},
	},

	//准备mutations——用于操作数据（state）
	mutations: {
		//处理action传过来的事件
		CODE(state, value) {
			console.log('操作state数据---存储验证码');
			state.code = value;
		},
		USERINFO(state, value) {
			console.log('操作state数据---存储用户信息');
			state.userInfo = value;
		},
		// 清空仓库中的用户信息
		CLEAR(state) {
			state.userInfo = {};
		},
	},

	// 当 state 中的数据需要经过加工后再使用时，可以使用 getters 加工。
	//类似于computed，为了简化获取store中的数据
	//goodsInfo数据结构比较复杂，利用getters简化获取数据
	//防止网络或者其他问题导致没有数据，将其初始化为[]或{}以免报错
	getters: {
		// 后台数据结构有问题，这里用getters处理
		userName(state) {
			console.log('从仓库获取用户信息');
			return state.userInfo.name;
		},
	},
};
