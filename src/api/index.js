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

//搜索商品的请求地址  /api/list   POST
//获取搜索商品的数据，给服务器传递一个请求体参数【至少是一个空对象】
const reqGetSearchInfo = params => request.post('/list', params);

//获取产品详情信息的接口  URL: /api/item/{ skuId }  请求方式：get
// axios传递params参数只能通过拼接在url里面
const reqGetGoodsInfo = skuId => request.get(`/item/${skuId}`);

//将产品添加到购物车中（获取更新某一个产品的个数）
///api/cart/addToCart/{ skuId }/{ skuNum }  POST
const reqAddOrUpdateShopCart = (skuId, skuNum) =>
	request.post(`/cart/addToCart/${skuId}/${skuNum}`);

//获取购物车列表数据接口
//URL:/api/cart/cartList   method:get
const reqCartList = () => request.get('/cart/cartList ');

//删除购物产品的接口
//URL:/api/cart/deleteCart/{skuId}   method:DELETE
const reqDeleteCartById = skuId => request.delete(`/cart/deleteCart/${skuId}`);

//修改商品的选中状态
//URL:/api/cart/checkCart/{skuId}/{isChecked}   method:get
const reqUpdateCheckedById = (skuId, isChecked) =>
	request.get(`/cart/checkCart/${skuId}/${isChecked}`);

//将封装好的请求统一暴露出去
export {
	reqGetCategoryList,
	reqGetBannerList,
	reqGetFloorList,
	reqGetSearchInfo,
	reqGetGoodsInfo,
	reqAddOrUpdateShopCart,
	reqCartList,
	reqDeleteCartById,
	reqUpdateCheckedById,
};
