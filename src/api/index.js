/*将每个请求封装为一个函数，并暴露出去，组件只需要调用相应函数即可，
这样当我们的接口比较多时，如果需要修改只需要修改该文件即可 
切记:api函数执行需要把axios返回的Promise实例返回给api函数调用者
 */
//当前模块，API进行统一管理，即对请求接口统一管理
import request from './request.js';
import mockRequest from './mockRequest';

//三级菜单的请求地址  /api/product/getBaseCategoryList   GET    没有任何参数
//商品分类导航,三级菜单接口
const reqGetCategoryList = () => request.get('/product/getBaseCategoryList');

//获取banner（Home首页轮播图接口）
const reqGetBannerList = () => mockRequest.get('/banner');
//获取floor数据（Home首页商品大图展示接口）
const reqGetFloorList = () => mockRequest.get('/floor');

//将封装好的请求统一暴露出去
export { reqGetCategoryList, reqGetBannerList, reqGetFloorList };
