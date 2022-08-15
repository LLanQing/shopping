/*将每个请求封装为一个函数，并暴露出去，组件只需要调用相应函数即可，
这样当我们的接口比较多时，如果需要修改只需要修改该文件即可 
 */
//当前模块，API进行统一管理，即对请求接口统一管理
import request from './request.js';

//商品分类导航,三级菜单接口
const getBaseCategoryList = () => {
	return request.get('/product/getBaseCategoryList');
};

//将封装好的请求统一暴露出去
export { getBaseCategoryList };
