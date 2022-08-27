import { reqAddressInfo, reqOrderInfo } from '@/api';
const state = {
	address: [],
	orderInfo: {},
};
const mutations = {
	GETUSERADDRESS(state, address) {
		state.address = address;
	},
	GETORDERINFO(state, orderInfo) {
		state.orderInfo = orderInfo;
	},
};
const actions = {
	//获取用户地址信息
	async getUserAddress({ commit }) {
		let result = await reqAddressInfo();
		commit('GETUSERADDRESS', result);
	},
	//获取商品清单数据
	async getOrderInfo({ commit }) {
		let result = await reqOrderInfo();
		commit('GETORDERINFO', result);
	},
};
const getters = {};
export default {
	namespaced: true, //开启命名空间
	state,
	mutations,
	actions,
	getters,
};
