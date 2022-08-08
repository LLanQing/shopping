import Vue from "vue";
import App from "./App.vue";
// 引入vue-router
import VueRouter from "vue-router";
// 引入router,路径不写全，默认引入文件夹下的index文件
import router from "./router";
// 引入商品三级分类导航菜单
import TypeNav from "@/components/TypeNav.vue";

//关闭生产提示
Vue.config.productionTip = false;
//使用vue-router插件
Vue.use(VueRouter);
//将商品三级分类导航菜单注册为全局组件
//第一个参数：全局组件名字，第二个参数：全局组件
Vue.component(TypeNav.name, TypeNav);

new Vue({
	// 注册App组件
	render: h => h(App),
	// 注册路由，router配置简写方式
	router,
}).$mount("#app"); //指定根容器
