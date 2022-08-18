// 将Search组件的状态相关的代码封装在search模块中
export default {
	/* 默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的
		 ——这样使得多个模块能够对同一 mutation 或 action 作出响应。
		 启用了命名空间的 getter 和 action 会收到局部化的 getter，dispatch 和 commit。 */
	// 开启命名空间
	namespaced: true,
	// 准备state——用于存储数据
	state: {},

	//准备actions——用于响应组件中的动作,处理业务逻辑、ajax请求等
	actions: {
		/* 有一个与组件dispatch发过来的type一样的key,对应的方法去处理事件
	    收到两个参数，context:上下文对象，里面有当前所需要的属性或方法,相当于一个ministore
      value:dispatch传过来的值 */
	},

	//准备mutations——用于操作数据（state）
	mutations: {
		//处理action传过来的事件
	},

	// 当 state 中的数据需要经过加工后再使用时，可以使用 getters 加工。
	//类似于computed
	getters: {},
};
