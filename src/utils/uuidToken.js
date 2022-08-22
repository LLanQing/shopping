import { v4 as uuidv4 } from 'uuid';
//要生成一个随机字符串，且每次执行不能发生变化，游客身份持久存储
export default () => {
	//单例模式，保证uuidToken有且只能存在一个
	//先从本地存储获取uuid（看一下本地存储里面是否有）
	let uuidToken = localStorage.getItem('uuidToken');
	//如果没有
	if (!uuidToken) {
		//生成游客临时身份
		uuidToken = uuidv4();
		//本地存储存储一次
		localStorage.setItem('uuidToken', uuidToken);
	}
	//切记有返回值,没有返回值undefined
	return uuidToken;
};
