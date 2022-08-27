//封装axios
import axios from 'axios';
//引入进度条
import nprogress from 'nprogress';
//start()开启进度条  done()关闭进度条
//引入进度条样式
import 'nprogress/nprogress.css';

//创建一个新的axios，和原本的axios区别在于没有取消请求和批量发请求的方法, 其它所有语法都是一致的
const request = axios.create({
	//基础路径，会在requests发出的请求url地址前面加上baseURl
	baseURL: '/api',
	//设置超时时间5s
	timeout: 5000,
});

//设置请求拦截器
request.interceptors.request.use(config => {
	//对请求做一些特殊处理
	//主要是对请求头Header配置比如添加token
	// console.log('开启请求拦截器');
	if (localStorage.getItem('TOKEN')) {
		config.headers.token = localStorage.getItem('TOKEN');
	}

	//发出请求时开启进度条
	nprogress.start();
	return config; //必须返回请求，不然拦截了就发不出去了请求
});

//设置响应拦截器
request.interceptors.response.use(
	response => {
		//响应成功的回调函数
		//对响应做一些处理
		//响应成功后关闭进度条
		nprogress.done();
		if (response.data.code == 200) {
			return response.data.data; //返回服务器响应数据
		} else {
			console.log(
				`请求数据失败${response.data.message}---请检查传入参数是否正确`
			);
			return new Promise(() => {});
		}
	},
	error => {
		//响应失败的回调函数
		alert('请求失败了----', error);
		//中断Promise链，便于异步任务使用await关键字不必使用try...catch，因为不会返回失败的Promise
		return new Promise(() => {});
	}
);

//暴露封装好的axios
export default request;
