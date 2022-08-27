//封装防抖函数
/**
 * @description: 防抖函数
 * @param {*} callback  回调函数,不能是箭头函数，否则this指向会出问题
 * @param {*} wait  延迟执行毫秒数
 * @param {*} immediate  true 表示回调函数立即执行，false 表非立即执行
 */
function debounce(callback, wait, immediate) {
	// console.log('debounce---', this); //undefined，因为是严格模式，所以是undefined，非严格模式则指向window
	let timeout;
	// 返回一个函数，形成闭包，闭包里面保存了timeout
	return function (...params) {
		// console.log('return function---', this); //触发事件的dom元素
		if (timeout) {
			console.log('清除超时器');
			clearTimeout(timeout);
		}
		if (immediate) {
			//立即执行
			//修改callback的this让其指向throttle方法的调用者，并传入参数
			if (!timeout) callback.call(this, ...params); //将触发事件的对象传递给回调函数
			console.log('开启超时任务');
			timeout = setTimeout(() => {
				timeout = null;
			}, wait);
		} else {
			//延迟执行
			console.log('开启超时任务');
			timeout = setTimeout(() => {
				// console.log('setTimeout---', this); //触发事件的dom元素
				callback.call(this, ...params);
			}, wait);
		}
	};
}

export default debounce;
