//封装节流函数
/**
 * @description: 节流函数
 * @param {*} callback  回调函数
 * @param {*} wait  延迟执行毫秒数
 * @param {*} immediate true 表示回调函数立即执行，false 表非立即执行
 */
function throttle(callback, wait, immediate) {
	let timeout;
	// 返回一个函数，形成闭包，闭包里面保存了timeout
	return function (...params) {
		if (immediate) {
			//立即执行
			if (!timeout) {
				//修改callback的this让其指向throttle方法的调用者，并传入参数
				callback.call(this, ...params);
				console.log('开启超时任务----');
				timeout = setTimeout(() => {
					timeout = null;
				}, wait);
			}
		} else {
			//等待延时后执行
			if (!timeout) {
				console.log('开启超时任务----');
				timeout = setTimeout(() => {
					timeout = null;
					// console.log(this);
					callback.call(this, ...params);
				}, wait);
			}
		}
	};
}

export default throttle;
