//封装节流函数
/**
 * @description: 节流函数
 * @param {*} callback  回调函数
 * @param {*} wait  延迟执行毫秒数
 * @param {*} immediate true 表示回调函数立即执行，false 表非立即执行
 */
function throttle(callback, wait, immediate) {
	let timeout;
	return function () {
		if (immediate) {
			//立即执行
			if (!timeout) {
				callback.call(this);
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
					callback.call(this);
				}, wait);
			}
		}
	};
}

export default throttle;
