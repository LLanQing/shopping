git 代码地址

[我自己关于本项目的 git 仓库地址](https://github.com/LLanQing/shopping)

# 前端 Vue 核心

开发一个前端模块可以概括为以下几个步骤：
（1）写静态页面、拆分为静态组件；
（2）发请求（API）；
（3）vuex（actions、mutations、state 三连操作）；
（4）组件获取仓库数据，动态展示；

[TOC]

# 1、vue 文件目录分析

**public 文件夹**：静态资源，webpack 进行打包的时候会原封不动打包到 dist 文件夹中。

**pubilc/index.html**是一个模板文件，作用是生成项目的入口文件，webpack 打包的 js,css 也会自动注入到该页面中。我们浏览器访问项目的时候就会默认打开生成好的 index.html。

**src 文件夹**（程序员代码文件夹）

    assets： 存放公用的静态资源，webpack打包时会把静态资源当做一个模块，打包到js文件里面
    components： 非路由组件（全局组件），其他组件放在views或者pages文件夹中
    App.vue： 唯一的跟组件
    main.js： 程序入口文件，最先执行的文件

**babel.config.js**: 配置文件（babel 相关）
**package.json**: 项目的详细信息记录，安装的依赖包信息等
**package-lock.json**: 缓存性文件（各种包的来源）

# 2、项目配置

## 2.1 package.json

```js
package.json
    "scripts": {
    "serve": "vue-cli-service serve --open",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
    },
```

## 2.2 关闭 eslint 校验工具（不关闭会有各种规范，不按照规范就会报错）

- 根目录下创建 vue.config.js,进行配置

```js
module.exports = {
	//关闭eslint
	lintOnSave: false,
};
```

## 2.3 src 文件夹配置别名,创建 jsconfig.json，用@/代替 src/，exclude 表示不可以使用该别名的文件

```js
 {
    "compilerOptions": {
        "baseUrl": "./",
            "paths": {
            "@/*": [
                "src/*"
            ]
        }
    },

    "exclude": [
        "node_modules",
        "dist"
    ]
 }
```

## 2.4 配置 eslint

解决 Component name “xxxxx“ should always be multi-word.eslintvue 问题

在根目录下找到 _.eslintrc.js_ 文件，同样如果没有则新建一个（注意文件前有个点）

```json
module.exports = {
	root: true, // 在根目录下寻找.eslintrc.js文件，如果当前工作区打开的项目不是在根目录，则查找.eslintrc.js文件会失败，且eslint检查也不会生效
	env: {
		node: true,
	},
	extends: ['plugin:vue/essential', 'eslint:recommended'],
	parserOptions: {
		parser: '@babel/eslint-parser',
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'vue/multi-word-component-names': 'off', // 不校验组件名
		'vue/no-multiple-template-root': 0, // 不需要使用根元素包裹template的内容
	},	
};

```

# 3、组件页面样式

组件页面的样式使用的是 less 样式，浏览器不识别该样式，需要下载相关依赖
`npm install --save less less-loader@5`
如果想让组件识别 less 样式，则在组件中设置
`<script scoped lang="less">`

# 4、清除 vue 页面默认的样式

vue 是单页面开发，我们只需要修改 public 下的 index.html 文件

`<link rel="stylesheet" href="reset.css">`

# 5、搭建路由

创建 pages 文件夹，并创建路由组件
5.1 创建 router 文件夹，并创建 index.js 进行路由配置，最终在 main.js 中引入注册

5.2 总结  
路由组件和非路由组件区别：

- 非路由组件放在 components 中，路由组件放在 pages 或 views 中

- 非路由组件通过标签使用，路由组件通过路由使用

- 在 main.js 注册玩路由，所有的路由和非路由组件身上都会拥有\$router、 \$route 属性

- $router：一般进行编程式导航进行路由跳转

- $route： 一般获取路由信息（name path params 等）

- 首页路由重定向：当进入首页是，定向到 home

  ```js
  //重定向，项目启动时重定向到首页
  {
      path: "*",
          redirect: "/",
  },
  ```

  5.3 路由跳转方式

- 声明式导航 router-link 标签 <router-link to="path">,可以把 router-link 理解为一个 a 标签，它 也可以加 class 修饰

- 编程式导航 ：声明式导航能做的编程式都能做，而且还可以处理一些业务

  ```js
  //router.push(location, onComplete?, onAbort?)
  //该方法的参数可以是一个字符串路径，或者一个描述地址的对象。例如：

  // 字符串
  router.push('home');

  // 对象
  router.push({ path: 'home' });

  // 命名的路由
  router.push({ name: 'user', params: { userId: '123' } });

  // 带查询参数，变成 /register?plan=private
  router.push({ path: 'register', query: { plan: 'private' } });

  //或者使用router.replace()方法，区别是没有浏览记录
  ```

# 6、footer 组件显示与隐藏

- footer 在登录注册页面是不存在的，所以要隐藏，v-if 或者 v-show
- 这里使用 v-show，因为 v-if 会频繁的操作 dom 元素消耗性能，v-show 只是通过样式将元素显示或隐藏
- 配置路由的时候，可以给路由配置元信息 meta,
- 在路由的原信息中定义 show 属性，用来给 v-show 赋值，判断是否显示 footer 组件

# 7、路由传参

## 7.1、传参方法

- 字符串形式

  ```js
  this.$router.push("/search/"+this.params 传参+"?k="+this.query 传参)
  ```

- 模板字符串

  ```js
  /* 使用模板字符串的形式传参,如果同时传递params、query参数，
  			params的/keyWords必须写在前面，否则会被当做query参数的字符串 ，
  			当没有传递params参数是，可以在路由配置占位符时添加一个'?'，表示该参数可传可不传*/
  this.$router.push(
  	`/search/${this.keyWords}?KW=${this.keyWords.toUpperCase()}`
  );
  ```

  **注意**： 上面字符串的传参方法可以看出 params 参数和'/'结合，query 参数和？结合  
  `http://localhost:8080/#/search/asd?keyword=asd`  
  上面 url 中 asd 为 params 的值，keyword=asd 为 query 传递的值。

- 对象（常用）

  ```js
  // 使用对象形式传参
  /* 关于使用对象形式传递参数时path配置与params参数问题:
  				(1)使用path配置，导致params读取的是path路径上的参数，但是path没有传参数，所以传递过去params是undefined
  			path: '/search',
  			如果要用path配置传递params参数，就必须像字符串写法一样传递完整的参数如下：
  			path: `/search/${this.keyWords}?KW=${this.keyWords.toUpperCase()}`, */
  const result = this.$router.push({
  	name: 'search', //对象写法，传递params参数时则不能使用 path 配置项，必须使用 name 配置
  	params: { keyWords: this.keyWords },
  	query: { KW: this.keyWords.toUpperCase() },
  });
  ```

  以对象方式传参时，如果我们传参中使用了 params，只能使用 name，不能使用 path，如果只是使用 query 传参，可以使用 path

## 7.2、query、params 传参

- query、params 两个属性可以传递参数
  - query 参数：不属于路径当中的一部分，类似于 get 请求，地址栏表现为 /search?k1=v1&k2=v2  
    query 参数对应的路由信息 `path: "/search"`
  - params 参数：属于路径当中的一部分，需要注意，在配置路由的时候，需要**占位** ,地址栏表现为 /search/v1/v2  
    params 参数对应的路由信息要修改为`path: "/search/:keyword"` 这里的/:keyword 就是一个 params 参数的占位符

### 7.2.1 关于使用对象形式传递参数时 path 配置与 params 参数问题

```js
// 2.使用对象形式传参
//使用path配置，导致params读取的是path路径上的参数，但是path没有传参数，所以传递过去params是undefined
// path: '/search',
//如果要用path配置传递params参数，就必须像字符串写法一样传递完整的参数如下：
//path: `/search/${this.keyWords}?KW=${this.keyWords.toUpperCase()}`,
this.$router.push({
	//对象写法，传递params参数时则不能使用 path 配置项，必须使用 name 配置，否则params传递过去的是undefined
	name: 'search',
	params: { keyWords: this.keyWords },
	query: { KW: this.keyWords.toUpperCase() },
});
```

### 7.2.2、如何指定 params 参数可传可不传

```js
  //如果路由path要求传递params参数,但是没有传递,会发现地址栏URL有问题，详情如下：
  Search路由项的path已经指定要传一个keyword的params参数，如下所示：
  path: "/search/:keyword",
  //执行下面进行路由跳转的代码：
  this.$router.push({name:"Search",query:{keyword:this.keyword}})
  //当前跳转代码没有传递params参数
  //地址栏信息：http://localhost:8080/#/?keyword=asd
  //此时的地址信息少了/search
  //正常的地址栏信息: http://localhost:8080/#/search?keyword=asd
  //解决方法：可以通过改变path来指定params参数可传可不传
  path: "/search/:keyword?",?表示该参数可传可不传
```

### 7.2.3、params 如果传递的时空串，如何解决 。

```js
this.$router.push({
	name: 'Search',
	query: { keyword: this.keyword },
	params: { keyword: '' },
});
//出现的问题和1中的问题相同,地址信息少了/search
//解决方法： 加入||undefined，当我们传递的参数为空串时地址栏url也可以保持正常
this.$router.push({
	name: 'Search',
	query: { keyword: this.keyword },
	params: { keyword: '' || undefined },
});
```

## 7.3、路由的 props 配置

```js
{
	name:'xiangqing',
	path:'detail/:id',
	component:Detail,

	//第一种写法：props值为对象，该对象中所有的key-value的组合最终都会通过props传给Detail组件
	// props:{a:900}

	//第二种写法：props值为布尔值，布尔值为true，则把路由收到的所有params参数通过props传给Detail组件
	// props:true

	//第三种写法：props值为函数，该函数返回的对象中每一组key-value都会通过props传给Detail组件
	props(route){
		return {
			id:route.query.id,
			title:route.query.title
		}
	}
}
```

## 7.4 解决避免对当前位置的冗余导航问题：

<strong style="color:red">NavigationDuplicated: Avoided redundant navigation to current location</strong>

```js
//三种方式
//第一种，捕获到错误但是不处理（或者做刷新页面的处理）
this.$router
	.push({
		//对象写法，传递params参数时则不能使用 path 配置项，必须使用 name 配置，否则params传递过去的是undefined
		name: 'search',
		params: { keyWords: this.keyWords },
		query: { KW: this.keyWords.toUpperCase() },
	})
	.catch(() => {}); //添加catch()捕获错误但是不做操作，这样就不会刷新页面
//第二种，在传参的时候加上时间戳(根治)
this.$router.push({
	name: 'search', //对象写法，则不能使用 path 配置项，必须使用 name 配置
	params: { keyWords: this.keyWords },
	query: { KW: this.keyWords.toUpperCase(), timestamp: Date.now() }, //或者在传参的时候加上时间戳
});
```

声明式导航即使用<router-link>标签没有这个问题，因为 vue-router 底层已经处理好了

## 7.5、第三种方式-重写 vueRouter 的 push 和 replace 方法

多次执行相同的 push 问题，控制台会出现警告

多次执行出现警告：  
![在这里插入图片描述](https://img-blog.csdnimg.cn/308f41adccfe4268a6a2e0b4b2d2cfd0.png)

原因：vue-router 底层判断相同路径时发出警告，push 返回的 是一个 promise，promise 需要传递成功回调函数和失败回调函数两个参数或者用 then()方法指定成功/失败的回调，我们的 push 中没有传递就会导致失败直接抛出。

```js
router.push(location, onComplete?, onAbort?)
router.push(location).then(onComplete).catch(onAbort)
```

例如：使用 this.$router.push({name:'Search',params:{keyword:".."||undefined}})时，如果多次执行相同的 push，控制台会出现警告。

```js
let result = this.$router.push({
	name: 'Search',
	query: { keyword: this.keyword },
});
console.log(result);
```

执行一次上面代码：  
![在这里插入图片描述](https://img-blog.csdnimg.cn/d7b3e04b2986474d8009fe970b7b2e63.png)
**解决方法：this.$router.push({name:'Search',params:{keyword:".."||undefined}},()=>{},()=>{})后面两项分别代表执行成功和失败的回调函数。传递空的回调函数，让失败提示不显示。 **
**这种写法治标不治本，将来在别的组件中 push|replace,编程式导航还是会有类似错误**  
push 是 VueRouter.prototype 的一个方法，在 router 中的 index 重写该方法即可(看不懂也没关系，这是前端面试题)

```js
// 第三种方式-重写vueRouter的push和replace方法
//1、先把VueRouter原型对象的push和replace，保存一份
const originPush = VueRouter.prototype.push;
const originReplace = VueRouter.prototype.replace;
//2、重写push|replace
/**
 * @description: 重写push方法，处理次发送相同参数的push和replace请求报错问题
 * @param {*} location	目标路由和传递的参数
 * @param {*} resolve		成功回调
 * @param {*} reject		失败回调
 * @return {*}
 */
VueRouter.prototype.push = function (location, resolve, reject) {
	//如果有成功/失败回调就直接传递过去，没有则添加空的成功/失败回调
	if (resolve && reject) {
		originPush.call(this, location, resolve, reject); //将路由实例对象和其他参数传递给push方法
	} else {
		originPush.call(
			this,
			location,
			() => {},
			() => {}
		); //传入空回调，不让报错显示，但是会在控制台打印undefined
	}
};
VueRouter.prototype.replace = function (location, resolve, reject) {
	//如果有成功/失败回调就直接传递过去，没有则添加空的成功/失败回调
	if (resolve && reject) {
		originReplace.call(this, location, resolve, reject); //将路由实例对象和其他参数传递给push方法
	} else {
		originReplace.call(
			this,
			location,
			() => {},
			() => {}
		); //传入空回调，不让报错显示，但是会在控制台打印undefined
	}
};
```

# 9、定义全局组件

我们的三级联动组件是全局组件，全局的配置都需要在 main.js 中配置

```js
//将三级联动组件注册为全局组件
import TypeNav from '@/pages/Home/TypeNav';
//第一个参数：全局组件名字，第二个参数：全局组件
Vue.component(TypeNav.name, TypeNav);
```

在 Home 组件中使用该全局组件

```js
<template>
<div>
<!--  三级联动全局组件已经注册为全局组件，因此不需要引入-->
  <TypeNav/>
</div>
</template>

```

全局组件可以在任一页面中直接使用，不需要导入声明  



# 10、启动项目自动打开浏览器

根目录下 vue.config.js 文件设置

```js
module.exports = {
	//关闭eslint
	lintOnSave: false,
	//项目启动自动在指定的ip:port打开浏览器
  host: 'localhost',
  port: 8080,
  open: true,
};
```

注意：修改完该配置文件后，要重启一下项目

# 11、Home 首页其它组件

home 文件夹 index.vue

```js
<template>
<div>
<!--  三级联动全局组件已经注册为全局组件，因此不需要引入-->
  <TypeNav/>
<!--  轮播图列表-->
  <ListContainer/>
<!--  今日推荐-->
  <Recommend/>
<!--  商品排行-->
  <Rank/>
<!--  猜你喜欢-->
  <Like/>
<!-- 楼层 -->
  <Floor/>
  <Floor/>
<!--  商标-->
  <Brand/>
</div>
</template>

<script>
import ListContainer from './ListContainer'
import Recommend from './Recommend'
import Rank from './Rank'
import Like from './Like'
import Floor from './Floor'
import Brand from './Brand'
export default {
  name: "index",
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand,
  }
}
</script>

<style scoped>

</style>
```

# 12、axios 二次封装

axios 中文文档，包含详细信息。
[https://www.kancloud.cn/yunye/axios/234845](https://www.kancloud.cn/yunye/axios/234845)
在根目录下创建 api 文件夹，一般 api 目录用来存放网络请求，创建 request.js 文件。
内容如下，当前文件代码还比较少，后续有需求可以增添内容。

```js
//封装axios
import axios from 'axios';

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
	console.log('开启请求拦截器');
	return config; //必须返回请求，不然拦截了就发不出去了请求
});

//设置响应拦截器
request.interceptors.response.use(
	response => {
		//响应成功的回调函数
		//对响应做一些处理
		return response.data.data; //返回服务器响应数据
	},
	error => {
		//响应失败的回调函数
		console.log('请求失败了----', error);
		return new Promise(() => {}); //中断Promise链，便于异步任务使用await关键字
	}
);

//暴露封装好的axios
export default request;
```

# 13、前端通过代理解决跨域问题

在根目录下的 vue.config.js 中配置,proxy 为通过代理解决跨域问题。
我们在封装 axios 的时候已经设置了 baseURL 为 api,所以所有的请求都会携带/api，这里我们就将/api 进行了转换。如果你的项目没有封装 axios，或者没有配置 baseURL，建议进行配置。要保证 baseURL 和这里的代理映射相同，此处都为'/api'。

```js
module.exports = {
	//关闭eslint
	lintOnSave: false,
	devServer: {
		//代理服务器解决跨域
		proxy: {
			// 匹配所有以 '/api'开头的请求路径
			'/api': {
				// 代理目标的基础路径，会在/api前面加上target中的路径
				target: 'http://39.98.123.211',
				//如果匹配到/api后需要去掉或者替换'/api'路径，则需要配置pathRewrite
				//pathRewriter:{"^/api":"要替换的路径"}, //这个项目都是/api的路径所以不需要替换
			},
		},
	},
};
```

[webpack 官网相关知识解读](https://webpack.docschina.org/configuration/dev-server/#devserverproxy)
网站中的 webpack.config.js 就是 vue.config.js 文件。

# 14、请求接口统一封装，方便扩展接口

在文件夹 api 中创建 index.js 文件，用于封装所有请求
**将每个请求封装为一个函数，并暴露出去，组件只需要调用相应函数即可，这样当我们的接口比较多时，如果需要修改只需要修改该文件即可。**

如下所示：

```js
//当前模块，API进行统一管理，即对请求接口统一管理
import requests from '@/api/request';

//首页三级分类接口
export const reqCateGoryList = () => {
	return requests({
		url: '/product/getBaseCategoryList',
		method: 'GET',
	});
};
```

当组件想要使用相关请求时，只需要导入相关函数即可，以上图的 reqCateGoryList 为例:

```js
import { reqCateGoryList } from './api';
//发起请求
reqCateGoryList();
```

# 15、nprogress 进度条插件

打开一个页面时，往往会伴随一些请求，并且会在页面上方出现进度条。它的原理时，在我们发起请求的时候开启进度条，在请求成功后关闭进度条，所以只需要在 request.js 中进行配置。


安装插件

```shell
cnpm i nprogres
```

对应的 request.js 设置

```js
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
	console.log('开启请求拦截器');
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
		return response.data.data; //返回服务器响应数据
	},
	error => {
		//响应失败的回调函数
		console.log('请求失败了----', error);
		return new Promise(() => {}); //中断Promise链，便于异步任务使用await关键字
	}
);

//暴露封装好的axios
export default request;
```

可以通过修改 nprogress.css 文件的 background 来修改进度条颜色。


# 16、手动引入 vuex

首先确保安装了 vuex,根目录创建 store 文件夹，文件夹下创建 index.js，内容如下：

```js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

//对外暴露store的一个实例
export default new Vuex.Store({
	state: {},
	mutations: {},
	actions: {},
});
```

如果想要使用 vuex，还要再 main.js 中引入
main.js:  
(1) 引入文件
(2) 注册 store
**但凡是在 main.js 中的 Vue 实例中注册的实体，在所有的组件中都会有（this.$.实体名）属性**

```js
import store from './store';
new Vue({
	render: h => h(App),
	//注册路由，此时组件中都会拥有$router $route属性
	router,
	//注册store,此时组件中都会拥有$store
	store,
}).$mount('#app');
```

# 17、async await 使用

如果我们没有封装请求 api，而是直接调用 axios，就不需要使用 async await。
案例：我们将一个 axios 请求封装为了函数，我们在下面代码中调用了该函数：

```js
import { reqCateGoryList } from '@/api';
export default {
	actions: {
		categoryList() {
			let result = reqCateGoryList();
			console.log(result);
		},
	},
};
返回了一个 promise,证明这是一个 promise 请求，但是我们想要的是图片中的 data 数据。
没有将函数封装前我们都会通过 then()回调函数拿到服务器返回的数据，现在我们将其封装了，依然可以使用 then 获取数据，代码如下
```

```js
actions:{
        categoryList(){
            let result =  reqCateGoryList().then(
                res=>{
                console.log("res")
                console.log(res)
                return res
                }
            )
            console.log("result")
            console.log(result)
        }
    }
```


由于我们的 promis 是异步请求，我们发现请求需要花费时间，但是它是异步的，所有后面的 console.log("result")；console.log(result)会先执行，等我们的请求得到响应后，才执行 console.log("res")；console.log(res)，这也符合异步的原则，但是我们如果在请求下面啊执行的是将那个请求的结果赋值给某个变量，这样就会导致被赋值的变量先执行，并且赋值为 undefine，因为此时 promise 还没有完成。
![在这里插入图片描述](https://img-blog.csdnimg.cn/afe1c716352248009e7289151e933391.png)
所以我们引入了 async await,async 写在函数名前，await 卸载 api 函数前面。await 含义是**async 标识的函数体内的并且在 await 标识代码后面的代码**先等待 await 标识的异步请求执行完，再执行。这也使得只有 reqCateGoryList 执行完，result 得到返回值后，才会执行后面的输出操作。

```js
   async categoryList(){
            let result = await reqCateGoryList()
            console.log("result")
            console.log(result)
        }
```

结果
![在这里插入图片描述](https://img-blog.csdnimg.cn/160a7e87520d494787915f3fe9fa4640.png)

# 18、vuex（**\***）

state、actions、mutations、getters 的辅助函数使用，当多次访问 store 中的上述属性时，要使用个属性的辅助函数，可以减少代码量。
**在使用上面的函数时，如果需要传递多个参数，需要把多个参数组合为一个对象传入(vuex 是不允许多个参数分开传递的)**。

```js
async addOrUpdateShopCart({commit},{skuId,skuNum}){
        let result = await reqAddOrUpdateShopCart(skuId,skuNum)
        console.log(result)
        if(result.data ===  200){

        }
```

[辅助函数官网链接](https://vuex.vuejs.org/zh/guide/state.html#%E5%9C%A8-vue-%E7%BB%84%E4%BB%B6%E4%B8%AD%E8%8E%B7%E5%BE%97-vuex-%E7%8A%B6%E6%80%81)
**注意**：**使用 action 时，函数的第一个参数，必须是{commit}**，即使不涉及到 mutations 操作，也必须加上该参数，否则会报错。

# 19、loadsh 插件防抖和节流（重点）

在进行窗口的 resize、scroll，输入框内容校验等操作时，如果事件处理函数调用的频率无限制，会加重浏览器的负担，导致用户体验非常糟糕。此时我们可以采用 debounce（防抖）和 throttle（节流）的方式来减少调用频率，同时又不影响实际效果。
安装 lodash 插件，该插件提供了防抖和节流的函数，我们可以引入 js 文件，直接调用。当然也可以自己写防抖和节流的函数
[lodash 官网](https://www.lodashjs.com/)
[防抖函数](https://www.lodashjs.com/docs/lodash.debounce)
[节流函数](https://www.lodashjs.com/docs/lodash.throttle)
防抖：用户操作很频繁，但是只执行一次，减少业务负担。
节流：用户操作很频繁，但是把频繁的操作变为少量的操作，使浏览器有充分时间解析代码
[防抖和节流简述](https://www.jianshu.com/p/c8b86b09daf0)
例如：下面代码就是将 changeIndex 设置了节流，如果操作很频繁，限制 50ms 执行一次。这里函数定义采用的键值对形式。throttle 的返回值就是一个函数，所以直接键值对赋值就可以，函数的参数在 function 中传入即可。

```js
import {throttle} from 'lodash'

 methods: {
    //鼠标进入修改响应元素的背景颜色
    //采用键值对形式创建函数，将changeIndex定义为节流函数，该函数触发很频繁时，设置50ms才会执行一次
    changeIndex: throttle(function (index){
      this.currentIndex = index
    },50),
    //鼠标移除触发时间
    leaveIndex(){
      this.currentIndex = -1
    }
  }
```

# 20、编程式导航+事件委托实现路由跳转

三级标签列表有很多，每一个标签都是一个页面链接，我们要实现通过点击表现进行路由跳转。
路由跳转的两种方法：导航式路由，编程式路由。

>     对于导航式路由，我们有多少个a标签就会生成多少个router-link标签，这样当我们频繁操作时会出现卡顿现象。
>     对于编程式路由，我们是通过触发点击事件实现路由跳转。同理有多少个a标签就会有多少个触发函数。虽然不会出现卡顿，但是也会影响性能。

上面两种方法无论采用哪一种，都会影响性能。我们提出一种：编程时导航+事件委派 的方式实现路由跳转。事件委派即把子节点的触发事件都委托给父节点。这样只需要一个回调函数 goSearch 就可以解决。
**事件委派问题：**
（1）如何确定我们点击的一定是 a 标签呢？如何保证我们只能通过点击 a 标签才跳转呢？
（2）如何获取子节点标签的商品名称和商品 id(**我们是通过商品名称和商品 id 进行页面跳转的**)

**解决方法：**
对于问题 1：为三个等级的 a 标签添加自定义属性 date-categoryName 绑定商品标签名称来标识 a 标签（其余的标签是没有该属性的）。

对于问题 2：为三个等级的 a 标签再添加自定义属性 data-category1Id、data-category2Id、data-category3Id 来获取三个等级 a 标签的商品 id，用于路由跳转。
我们可以通过在函数中传入 event 参数，获取当前的点击事件，通过 event.target 属性获取当前点击节点，再通过 dataset 属性获取节点的属性信息。

```js
 <div class="all-sort-list2" @click="goSearch" @mouseleave="leaveIndex">
          <div class="item"  v-for="(c1,index) in categoryList" v-show="index!==16" :key="c1.categoryId" :class="{cur:currentIndex===index}">
            <h3 @mouseenter="changeIndex(index)"  >
              <a :data-categoryName="c1.categoryName" :data-category1Id="c1.categoryId" >{{c1.categoryName}}</a>
            </h3>
            <div class="item-list clearfix" :style="{display:currentIndex===index?'block':'none'}">
              <div class="subitem" v-for="(c2,index) in c1.categoryChild" :key="c2.categoryId">
                <dl class="fore">
                  <dt>
                    <a :data-categoryName="c2.categoryName" :data-category2Id="c2.categoryId">{{c2.categoryName}}</a>
                  </dt>
                  <dd>
                    <em v-for="(c3,index) in c2.categoryChild"  :key="c3.categoryId">
                      <a :data-categoryName="c2.categoryName" :data-category3Id="c3.categoryId">{{c3.categoryName}}</a>
                    </em>
</dd></dl></div></div></div></div>
```

**注意**：event 是系统属性，所以我们只需要在函数定义的时候作为参数传入，在函数使用的时候不需要传入该参数。

```js
//函数使用
<div class="all-sort-list2" @click="goSearch" @mouseleave="leaveIndex">
//函数定义
goSearch(event){
      console.log(event.target)
    }
对应的 goSearrch 函数
```

```js
goSearch(event){
      let element = event.target
      //html中会把大写转为小写
      //获取目前鼠标点击标签的categoryname,category1id,category2id,category3id，
      // 通过四个属性是否存在来判断是否为a标签，以及属于哪一个等级的a标签
      let {categoryname,category1id,category2id,category3id} = element.dataset


      //categoryname存在，表示为a标签
      if(categoryname){
        //category1id一级a标签
        //整理路由跳转的参数
        let location = {name:'Search'}//跳转路由name
        let query = {categoryName:categoryname}//路由参数

        if(category1id){
          query.category1Id = category1id
        }else if(category2id){
        //category2id二级a标签
          query.category2Id = category2id
        }else if(category3id){
        //category3id三级a标签
          query.category3Id = category3id
        }
        //整理完参数
        location.query = query
        //路由跳转
        this.$router.push(location)

      }
    },
```

# 21、商品三级分类的显示问题

## 21.1、Search 组件中商品分类与过渡动画

> 1.Search 组件中默认商品分类列表是隐藏的，通过 v-show 来实现
>
> Home 组件一直是显示状态所以需要判断路由，来决定商品分类的显示
>
> ```js
> <div class="sort" v-show="isShow">
>
> //如果是Home组件，就显示TypeNav
> if (this.$route.path === '/') this.isShow = true;
> ```
>
> 2.绑定鼠标移入移出事件来控制商品分类显示
>
> ```js
> <!-- 绑定鼠标移入移出事件来控制商品分类显示 -->
> <div @mouseenter="showSort" @mouseleave="hideSort">
>
>   //鼠标移入，商品分类显示
>   showSort() {
>   this.isShow = true;
> },
>   //鼠标离开，商品分类隐藏，Home组件除外，因为它需要一直显示
>   hideSort() {
>     if (this.$route.path !== '/') this.isShow = false;
>   },
> ```
>
> 3.通过 transitios 添加动画
>
> ```html
> <!-- 添加过渡动画 -->
> <transition name="sort">
> 	/* vue封装的动画默认样式名称开头是v，可以改名字
> 	在transition标签加上name="xxx"，name开头就必须是xxx */
> 	/*进入的起点,离开的终点 */ .sort-enter, .sort-leave-to { opacity: 0; }
> 	/*进入过程中, 离开过程中 */ .sort-enter-active, .sort-leave-active {
> 	transition: 0.5 linear; } /* 进入的终点，离开的起点 */ .sort-enter-to,
> 	.sort-leave { opacity: 1; }</transition
> >
> ```

## 21.2、Vue 路由销毁问题

**Vue 在路由切换的时候会销毁旧路由**。
我们在三级列表全局组件 TypeNav 中的 mounted 进行了请求一次商品分类列表数据。
由于**Vue 在路由切换的时候会销毁旧路由**，当我们再次使用三级列表全局组件时还会发一次请求。
如下图所示：当我们在包含三级列表全局组件的不同组件之间进行切换时，都会进行一次信息请求。

由于信息都是一样的，出于性能的考虑我们希望该数据只请求一次，所以我们把这次请求放在 App.vue 的 mounted 中。（根组件 App.vue 的 mounted 只会执行一次）
**注意**：虽然 main.js 也是只执行一次，但是不可以放在 main.js 中。所有的业务操作都应该放在组件中。

## 21.3、整合路由参数

> 点击商品分类链接跳转到 Search 模块只能传递 query 参数，点击搜索框只能传递 params 参数，需要整合在一起（实际工作中要统一，这里是为了演示整合参数）
>
> TypeNav 组件(商品分类路由跳转)中：
>
> ```js
> //整合params参数，判断路由中如果有params参数，就需要在传递的时候带上
> if (this.$route.params) location.params = this.$route.params;
> ```
>
> Header 组件(搜索框路由跳转)中：
>
> ```js
> //整合params参数，判断路由中如果有params参数，就需要在传递的时候带上
> const location = {
> 	name: 'search', //对象写法，则不能使用 path 配置项，必须使用 name 配置
> 	params: { keyWords: this.keyWords || undefined }, //加入||undefined，当我们传递的参数为空串时地址栏url也可以保持正常
> };
> if (this.$route.query) location.query = this.$route.query;
> this.$router.push(location);
> ```



# 22、mock 插件使用

mock 用来拦截前端 ajax 请求，返回我么们自定义的数据用于测试前端接口。
将不同的数据类型封装为不同的 json 文件，创建 mockServer.js 文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/8e20660af0b14a6396937a4fb10818f1.png)
banner、floor 分别为轮播图和页面底部的假数据。
mockServer.js 文件

```js
import Mock from 'mockjs';
//webpack默认对外暴露：json、图片
import banner from './banner.json';
import floor from './floor.json';

//mock数据：第一个参数请求地址、第二个参：请求数据
Mock.mock('/mock/banner', { code: 200, data: banner });
Mock.mock('/mock/floor', { code: 200, data: floor });
//记得要在main.js中引入一下
//import ''@/mock/mockServer
```

# 23、vuex 数据存储与使用

我们会把公共的数据放在 store 中，然后使用时再去 store 中取。
以我们的首页轮播图数据为例。
1、在轮播图组件 ListContainer.vue 组件加载完毕后发起轮播图数据请求。

```js
 mounted() {
    this.$store.dispatch("getBannerList")
  },
```

2、请求实际是在 store 中的 actions 中完成的

```js
actions:{
        //获取首页轮播图数据
        async getBannerList({commit}){
            let result = await reqGetBannerList()
            if(result.code ===  200){
                commit("BANNERLIST",result.data)
            }
        }
    }
```

3、获取到数据后存入 store 仓库，在 mutations 完成

```js
/唯一修改state的部分
    mutations:{
        BANNERLIST(state,bannerList){
            state.bannerList = bannerList
        }
    },
```

4、轮播图组件 ListContainer.vue 组件在 store 中获取轮播图数据。由于在这个数据是通过异步请求获得的，所以我们要通过计算属性 computed 获取轮播图数据。
ListContainer.vue 代码

```js
 <script>
import {mapState} from "vuex";
export default {
  name: "index",
  //主键挂载完毕，请求轮播图图片
  mounted() {
    this.$store.dispatch("getBannerList")
  },
  computed:{
    ...mapState({
      bannerList: (state => state.home.bannerList)
    })
  }
}
</script>
```

**总结**：只要是公共数据都会放在 store 中，之后的实现步骤就是上面的固定步骤。

# 24、swiper 插件实现轮播图（重点）

[swiper 官网](https://www.swiper.com.cn/usage/index.html)
官网中给出了代码实例：
做一个简要总结：（代码可以直接复制本小节最后面的代码）

> （1）安装 swiper
> （2）在需要使用轮播图的组件内导入 swpier 和它的 css 样式
> （3）在组件中创建 swiper 需要的 dom 标签（html 代码，参考官网代码）
> （4）创建 swiper 实例
>
>  new Swiper(swiperContainer, parameters)
>
> | 参数名          | 类型                  | 是否必填 | 描述                                                     |
> | --------------- | --------------------- | -------- | -------------------------------------------------------- |
> | swiperContainer | HTMLElement or string | 必选     | Swiper 容器的 css 选择器，例如`".swiper"`；或者 dom 元素 |
> | parameters      | object                | 可选     | Swiper 的个性化配置                                      |

**注意**：在创建 swiper 对象时，我们会传递一个参数用于获取展示轮播图的 DOM 元素，官网直接通过 class（**而且这个 class 不能修改，是 swiper 的 css 文件自带的**）获取。但是这样有缺点：当页面中有多个轮播图时，因为它们使用了相同的 class 修饰的 DOM，就会出现所有的 swiper 使用同样的数据，这肯定不是我们希望看到的。
解决方法：在轮播图最外层 DOM 中添加 ref 属性
`<div class="swiper-container" id="mySwiper" ref="cur">`
通过 ref 属性值获取 DOM
`let mySwiper = new Swiper(this.$refs.cur,{...})`

```js
 <!--banner轮播-->
        <div class="swiper-container" id="mySwiper" ref="cur">

          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(carouse,index) in bannerList" :key="carouse.id">
              <img :src="carouse.imgUrl" />
            </div>
          </div>

          <!-- 如果需要分页器 -->
          <div class="swiper-pagination"></div>

          <!-- 如果需要导航按钮 -->
          <div class="swiper-button-prev" ></div>
          <div class="swiper-button-next"></div>
        </div>
<script>
//引入Swiper
import Swiper from 'swiper'
//引入Swiper样式
import 'swiper/css/swiper.css'
</script>
```

接下来要考虑的是什么时候去加载这个 swiper，我们第一时间想到的是在 mounted 中创建这个实例。
但是会出现无法加载轮播图片的问题。
原因：

> 我们在 mounted 中先去异步请求了轮播图数据，然后又创建的 swiper 实例。由于请求数据是异步的，所以浏览器不会等待该请求执行完再去创建 swiper，而是先创建了 swiper 实例，但是此时我们的轮播图数据还没有获得，就导致了轮播图展示失败。

```js
mounted() {
	//请求数据
    this.$store.dispatch("getBannerList")
    //创建swiper实例
    let mySwiper = new Swiper(".swiper-container",{
        pagination:{
          el: '.swiper-pagination',
          clickable: true,
        },
        // 如果需要前进后退按钮
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        // 如果需要滚动条
        scrollbar: {
          el: '.swiper-scrollbar',
        },
      })
  },
```

解决方法一：等我们的数据请求完毕后再创建 swiper 实例。只需要加一个 1000ms 时间延迟再创建 swiper 实例.。将上面代码改为：

```js
mounted() {
    this.$store.dispatch("getBannerList")
    setTimeout(()=>{
      let mySwiper = new Swiper(document.getElementsByClassName("swiper-container"),{
        pagination:{
          el: '.swiper-pagination',
          clickable: true,
        },
        // 如果需要前进后退按钮
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        // 如果需要滚动条
        scrollbar: {
          el: '.swiper-scrollbar',
        },
      })
    },1000)
  },
```

方法一肯定不是最好的，但是我们开发的第一要义就是实现功能，之后再完善。

解决方法二：我们可以使用 watch 监听 bannerList 轮播图列表属性，因为 bannerList 初始值为空，当它有数据时，我们就可以创建 swiper 对象

```js
watch:{
    bannerList(newValue,oldValue){
        let mySwiper = new Swiper(this.$refs.cur,{
          pagination:{
            el: '.swiper-pagination',
            clickable: true,
          },
          // 如果需要前进后退按钮
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          // 如果需要滚动条
          scrollbar: {
            el: '.swiper-scrollbar',
          },
        })
    }
  }
```

即使这样也还是无法实现轮播图，原因是，我们轮播图的 html 中有 v-for 的循环，我们是通过 v-for 遍历 bannerList 中的图片数据，然后展示。我们的 watch 只能保证在 bannerList 变化时创建 swiper 对象，但是并不能保证此时 v-for 已经执行完了。假如 watch 先监听到 bannerList 数据变化，执行回调函数创建了 swiper 对象，之后 v-for 才执行，这样也是无法渲染轮播图图片（**因为 swiper 对象生效的前提是 html 即 dom 结构已经渲染好了**）。

**完美解决方案**：使用 watch+[this.$nextTick()](https://cn.vuejs.org/v2/api/#vm-nextTick)
官方介绍：this. $nextTick 它会将回调延迟到下次 DOM **更新循环之后执行**（循环就是这里的 v-for）。
**个人理解**：无非是等我们页面中的结构都有了再去执行回调函数

完整代码

```js
<template>
  <!--列表-->
  <div class="list-container">
    <div class="sortList clearfix">
      <div class="center">
        <!--banner轮播-->
        <div class="swiper-container" id="mySwiper">

          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(carouse,index) in bannerList" :key="carouse.id">
              <img :src="carouse.imgUrl" />
            </div>
          </div>

          <!-- 如果需要分页器 -->
          <div class="swiper-pagination"></div>

          <!-- 如果需要导航按钮 -->
          <div class="swiper-button-prev" ></div>
          <div class="swiper-button-next"></div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>
<script>
//引入Swiper
import Swiper from 'swiper'
//引入Swiper样式
import 'swiper/css/swiper.css'

import {mapState} from "vuex";

export default {
  name: "index",
  //主键挂载完毕，ajax请求轮播图图片
  mounted() {
    this.$store.dispatch("getBannerList")
  },
  computed:{
    ...mapState({
    //从仓库中获取轮播图数据
      bannerList: (state) => {return state.home.bannerList}
    })
  },
  watch:{
    bannerList(newValue,oldValue){
        //this.$nextTick()使用
        this.$nextTick(()=>{
          let mySwiper = new Swiper('#mySwiper',{
            pagination:{
              el: '.swiper-pagination',
              clickable: true,		//分页器是否可点击切换
            },
            // 如果需要前进后退按钮
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            // 如果需要滚动条
            scrollbar: {
              el: '.swiper-scrollbar',
            },
          })
        })
    }
  }
}
</script>
```

注意：之前我们在学习 watch 时，一般都是监听的定义在 data 中的属性，但是我们这里是监听的 computed 中的属性，这样也是完全可以的，并且如果你的业务数据也是从 store 中通过 computed 动态获取的，也需要 watch 监听数据变化执行相应回调函数，完全可以模仿上面的写法。

# 25、props 父子组件通信

> 适用场景：数据在父组件，需要在子组件中展示，由父组件决定子组件展示哪些信息
>
> 原理：父组件设置一个属性绑定要传递的数据，子组件 props 接受该属性值
>
> 1.  功能：让组件接收外部传过来的数据
>
> 2.  传递数据：`<Demo name="xxx"/>`
>
> 3.  接收数据：
>
> 4.  第一种方式（只接收）：`props:['name'] `
>
> 5.  第二种方式（限制类型）：`props:{name:String}`
>
> 6.  第三种方式（限制类型、限制必要性、指定默认值）：
>
>     ```js
>     props:{
>     	name:{
>     	type:String, //类型
>     	required:true, //必要性
>     	default:'老王' //默认值
>     	}
>     }
>     ```
>
> 备注：props 是只读的，Vue 底层会监测你对 props 的修改，如果进行了修改，就会发出警告，若业务需求确实需要修改，那么请复制 props 的内容到 data 中一份，然后去修改 data 中的数据。

> 父组件:Home 组件

```js
<template>
<div>
//...省略
<!--  父组件通过自定义属性list给子组件传递数据-->
  <Floor v-for="floor in floorList"  :key="floor.id" :floor="floor"/>
<!--  商标-->

</div>
</template>

```

> 子组件：Floor 组件

```js
<template>
  <!--楼层-->
  <div class="floor">
    //...省略
  </div>
</template>

<script>
export default {
  name: "Floor",
//子组件通过props属性接受父组件传递的数据
  props:['floor']
}
</script>
```

## $attrs

> 一个包含了组件所有透传 attributes 的对象。
>
> - **详细信息**
>
> [透传 Attributes](https://cn.vuejs.org/guide/components/attrs.html) 是指由父组件传入，且没有被子组件声明为 props 或是组件自定义事件的 attributes 和事件处理函数。
>
> 默认情况下，若是单一根节点组件，`$attrs` 中的所有属性都是直接自动继承自组件的根元素。而多根节点组件则不会如此，同时你也可以通过配置 [`inheritAttrs`](https://cn.vuejs.org/api/options-misc.html#inheritattrs) 选项来显式地关闭该行为。

# 26、将轮播图模块提取为公共组件

需要注意的是我们要把定义 swiper 对象放在 mounted 中执行，并且还要设置 immediate：true 属性，这样可以实现，无论数据有没有变化，上来立即监听一次。
上一小节刚刚讲了 props 实现父组件向子组件传递消息，这里同样也会将轮播图列表传递给子组件，原理相同。
公共组件 Carousel 代码

```js
<template>
  <div class="swiper-container" ref="cur" id="floor1Swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(carouse,index) in carouselList" :key="carouse.id">
        <img :src="carouse.imgUrl">
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
import Swiper from "swiper";
import 'swiper/css/swiper.css'
export default {
  name: "Carousel",
  props:["carouselList"],
  watch: {
    carouselList: {
      //这里监听，无论数据有没有变化，上来立即监听一次
      immediate: true,
      //监听后执行的函数
      handler(){
        //第一次ListContainer中的轮播图Swiper定义是采用watch+ this.$nextTick()实现

        this.$nextTick(() => {
          let mySwiper = new Swiper(this.$refs.cur,{
            loop: true, // 循环模式选项

            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
              // clickable: true
            },

            // 如果需要前进后退按钮
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },

            // 如果需要滚动条
            scrollbar: {
              el: '.swiper-scrollbar',
            },
          })
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
```

Floor 组件引用 Carousel 组件`<Carousel :carouselList="list.carouselList"/>`
我们还记得在首页上方我们的 ListContainer 组件也使用了轮播图，同样我们替换为我们的公共组件。
ListContainer 组件引用 Carousel 组件` <Carouse :carouselList="bannerList"/>`
**注意**：
（1）老师将该组件在 main.js 中引入，并定义为全局组件。我这里只是在使用到该组件的地方引入并声明（个人认为轮播图组件还算不上全局组件）。
（2）引用组件时要在 components 中声明引入的组件。
（3）我们将轮播图组件已经提取为公共组件 Carouse，所以我们只需要在 Carouse 中引入 swiper 和相应 css 样式。

# 27、getters 使用

getters 是 vuex store 中的计算属性。
[getters 使用](https://vuex.vuejs.org/zh/guide/getters.html#%E9%80%9A%E8%BF%87%E5%B1%9E%E6%80%A7%E8%AE%BF%E9%97%AE)
如果不使用 getters 属性，我们在组件获取 state 中的数据表达式为：`this.$store.state.子模块.属性`，
如果有多个组件需要用到此属性，我们要么复制这个表达式，或者抽取到一个共享函数然后在多处导入它——无论哪种方式都不是很理想。
Vuex 允许我们在 store 中定义“getter”（可以认为是 store 的计算属性）。就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。
**个人理解**：getters 将获取 store 中的数据封装为函数，代码维护变得更简单（和我们将请求封装为 api 一样）。而且 getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。
**注意**：仓库中的 getters 是全局属性，是不分模块的。即 store 中所有模块的 getter 内的函数都可以通过`$store.getters.函数名`获取

我们在 Search 模块中获取商品列表数据就是通过 getters 实现，需要注意的是当网络出现故障时应该将返回值设置为空，如果不设置返回值就变成了 undefined。

store 中 search 模块代码

```js
import { reqGetSearchInfo } from '@/api';
const state = {
	searchList: {},
};
const mutations = {
	SEARCHLIST(state, searchList) {
		state.searchList = searchList;
	},
};
const actions = {
	//第二个参数data默认是一个空对象
	async getSearchListr({ commit }, data = {}) {
		let result = await reqGetSearchInfo(data);

		if (result.code === 200) {
			commit('SEARCHLIST', result.data);
		}
	},
};
const getters = {
	goodsList(state) {
		//网络出现故障时应该将返回值设置为空
		return state.searchList.goodsList || [];
	},
};
export default {
	state,
	mutations,
	actions,
	getters,
};
```

在 Search 组件中使用 getters 获取仓库数据

```js
//只展示了使用getters的代码
<script>
  //引入mapGetters
  import {mapGetters} from 'vuex'
  export default {
    name: 'Search',
    computed:{
      //使用mapGetters，参数是一个数组，数组的元素对应getters中的函数名
      ...mapGetters(['goodsList'])
    }
  }
</script>
```

后续数据的动态渲染就和之前模块相同，没有什么难度。

# 28、Object.asign 实现对象拷贝（浅拷贝）

[参考链接](https://www.jianshu.com/p/f9ec860ecd81)

```js
Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
Object.assign(target, ...sources)    【target：目标对象】，【souce：源对象（可多个）】
举个栗子：
const object1 = {
  a: 1,
  b: 2,
  c: 3
};

const object2 = Object.assign({c: 4, d: 5}, object1);

console.log(object2.c, object2.d);
console.log(object1)  // { a: 1, b: 2, c: 3 }
console.log(object2)  // { c: 3, d: 5, a: 1, b: 2 }

注意：
1.如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。后面的源对象的属性将类似地覆盖前面的源对象的属性
2.Object.assign 方法只会拷贝源对象自身的并且可枚举的属性到目标对象。该方法使用源对象的[[Get]]和目标
对象的[[Set]]，所以它会调用相关 getter 和 setter。因此，它分配属性，而不仅仅是复制或定义新的属性。如
果合并源包含getter，这可能使其不适合将新属性合并到原型中。为了将属性定义（包括其可枚举性）复制到
原型，应使用Object.getOwnPropertyDescriptor()和Object.defineProperty() 。
```

# 29、对象深拷贝

```js
针对深拷贝，需要使用其他办法，因为 Object.assign()拷贝的是属性值。假如源对象的属性值是一个对象的引用，那么它也只指向那个引用。
let obj1 = { a: 0 , b: { c: 0}};
let obj2 = Object.assign({}, obj1);
console.log(JSON.stringify(obj2)); // { a: 0, b: { c: 0}}

obj1.a = 1;
console.log(JSON.stringify(obj1)); // { a: 1, b: { c: 0}}
console.log(JSON.stringify(obj2)); // { a: 0, b: { c: 0}}

obj2.a = 2;
console.log(JSON.stringify(obj1)); // { a: 1, b: { c: 0}}
console.log(JSON.stringify(obj2)); // { a: 2, b: { c: 0}}

obj2.b.c = 3;
console.log(JSON.stringify(obj1)); // { a: 1, b: { c: 3}}
console.log(JSON.stringify(obj2)); // { a: 2, b: { c: 3}}
最后一次赋值的时候，b是值是对象的引用，只要修改任意一个，其他的也会受影响

// Deep Clone （深拷贝）
obj1 = { a: 0 , b: { c: 0}};
let obj3 = JSON.parse(JSON.stringify(obj1));
obj1.a = 4;
obj1.b.c = 4;
console.log(JSON.stringify(obj3)); // { a: 0, b: { c: 0}}
```

# 30、利用路由信息变化实现动态搜索

最初想法：在每个三级列表和收缩按钮加一个点击触发事件，只要点击了就执行搜索函数。
这是一个很蠢的想法，如果这样就会生成很多回调函数，很耗性能。
最佳方法：我们每次进行新的搜索时，我们的 query 和 params 参数中的部分内容肯定会改变，而且这两个参数是路由的属性。我们可以通过监听路由信息的变化来动态发起搜索请求。

如下图所示，$route 是组件的属性，所以 watch 是可以监听的（watch 可以监听组件 data 中所有的属性）
**注意**：组件中 data 的属性包括：自己定义的、系统自带的（如 $route）、父组件向子组件传递的等等。

search 组件 watch 部分代码。

```js
watch:{
      $route(newValue,oldValue){
        Object.assign(this.searchParams,this.$route.query,this.$route.params)
        this.searchInfo()
        //如果下一次搜索时只有params参数，拷贝后会发现searchParams会保留上一次的query参数
        //所以每次请求结束后将相应参数制空
        this.searchParams.category1Id = '';
        this.searchParams.category2Id = '';
        this.searchParams.category3Id = '';
        this.$route.params.keyword = '';
      }
    },
```

# 31、面包屑相关操作

本次项目的面包屑操作主要就是两个删除逻辑。
分为：
当分类属性（query）删除时删除面包屑同时修改路由信息。
当搜索关键字（params）删除时删除面包屑、修改路由信息、同时删除输入框内的关键字。
1、query 删除时
因为此部分在面包屑中是通过 categoryName 展示的，所所以删除时应将该属性值制空或 undefined。
可以通过路由再次跳转修改路由信息和 url 链接

```js
//删除分类
      removeBread(){
        this.searchParams.categoryName = undefined
        this.$router.push({name:'Search',params:this.$route.params})
      },
```

2、params 删除时
和 query 删除的唯一不同点是此部分会多一步操作：删除输入框内的关键字（因为 params 参数是从输入框内获取的）
输入框实在 Header 组件中的
![在这里插入图片描述](https://img-blog.csdnimg.cn/9ac79f322e224152964806f448ed7bf9.png)
header 和 search 组件是兄弟组件，要实现该操作就要通过兄弟组件之间进行通信完成。
![在这里插入图片描述](https://img-blog.csdnimg.cn/86253180f85a48a3be90d98ea7d228ea.png)
这里通过$bus实现header和search组件的通信。
$bus 使用
（1）在 main.js 中注册

```js
new Vue({
	//全局事件总线$bus配置
	beforeCreate() {
		//此处的this就是这个new Vue()对象
		//网络有很多bus通信总结，原理相同，换汤不换药
		Vue.prototype.$bus = this;
	},
	render: h => h(App),
	//router2、注册路由，此时组件中都会拥有$router $route属性
	router,
	//注册store,此时组件中都会拥有$store
	store,
}).$mount('#app');
```

（2）search 组件使用$bus 通信，第一个参数可以理解为为通信的暗号，还可以有第二个参数（用于传递数据），我们这里只是用于通知 header 组件进行相应操作，所以没有设置第二个参数。

```js
//删除搜索关键字
      removeBreadParams(){
        this.searchParams.keyword = undefined
        //通知兄弟组件header删除输入框的keyword关键字
        this.$bus.$emit("clear")
        this.$router.push({name:'Search',query:this.$route.query})
      },
```

（3）header 组件接受$bus 通信
注意：组件挂载时就监听 clear 事件

```js
mounted() {
  //  组件挂载时就监听clear事件，clear事件在search模块中定义
  //  当删除关键字面包屑时，触发该事件，同时header的输入框绑定的keyword要删除
    this.$bus.$on("clear",()=>{
      this.keyword = ''
    })
  }
```

# 32、组件通信方式

**第一种父子组件通信：**

> $ on、$emit 自定义事件实现子组件给父组件传递信息。 props 实现父组件给子组件传递数据。

**第二种全局事件总线 $bus**（适用于所有的场景）
**第三种 Vuex**
**第四中插槽**（适用于父子组件通信）

[组件通信方式连接](https://www.cnblogs.com/yszblog/p/10135969.html)

# 33、SearchSelector 子组件传参及面包屑操作

在**31 小节**中描述了通过 query、params 参数生成面包屑，以及面包屑的删除操作对应地址栏 url 的修改。
SearchSelector 组件有两个属性也会生成面包屑，分别为品牌名、手机属性。
此处生成面包屑时会涉及到子组件向父组件传递信息操作（在 32 小节有相关知识点），之后的操作和前面 31 小姐讲的面包屑操作原理相同。唯一的区别是，这里删除面包屑时不需要修改地址栏 url，因为 url 是由路由地址确定的，并且只有 query、params 两个参数变化回影响路由地址变化。
在具体的操作内还会涉及一些小的知识点，例如
字符串拼接 ·${}·，使用方法如下

```js
var a = 1;
console.log(`a的值是：${a}`); //a的值是：1
```

至此面包屑部分内容结束。
总结：面包屑由四个属性影响：parads、query、品牌、手机属性
**面包屑生成逻辑**
判断 searchParams 相关属性是否存在，存在即显示。
**面包屑删除逻辑**
Search.vue js 代码()

```js
<script>
  import SearchSelector from './SearchSelector/SearchSelector'
  import {mapGetters} from 'vuex'
  export default {
    name: 'Search',
    components: {
      SearchSelector
    },
    data(){
      return{
        //动态获取searchParams
        searchParams:{
          category1Id: "",//一级分类id
          category2Id: "",//二级分类id
          category3Id: "",//三级分类id
          categoryName: "",
          keyword: "",
          order: "1:desc",
          pageNo: 1,
          pageSize: 10,
          props: [],//平台售卖属性
          trademark: ""//品牌
        },
      }
    },
    //在组件挂在之前动态编辑searchParams的值，因为组件挂在之后会使用到searchParams
    beforeMount() {
      //Object.assign方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
      //Object.assign 方法只会拷贝源对象自身的并且可枚举的属性到目标对象
      Object.assign(this.searchParams,this.$route.query,this.$route.params)
    },
    methods:{
      //搜索
      searchInfo(){
        this.$store.dispatch("getSearchListr",this.searchParams)
      },
      //删除分类(query)面包屑
      removeBread(){
        this.searchParams.categoryName = undefined
        this.$router.push({name:'Search',params:this.$route.params})
      },
      //删除搜索关键字(params)面包屑
      removeBreadParams(){
        this.searchParams.keyword = undefined
        //通知兄弟组件header删除输入框的keyword关键字
        this.$bus.$emit("clear")
        this.$router.push({name:'Search',query:this.$route.query})
      },
      //获取子组件传递的品牌信息（自定义事件）
      tradeMarkInfo(tradeMark){
        //接口文档中trademark的信息是"ID:品牌名称"形式
        this.searchParams.trademark = `${tradeMark.tmId}:${tradeMark.tmName}`
        this.searchInfo()
      },
      //删除品牌面包屑
      removeTradeMark(){
        this.searchParams.trademark = undefined
        this.searchInfo()
      },
      //获取子组件传递的属性信息（自定义事件）
      attrInfo(attr,attrValue){
        //searchParams.props元素为字符串形式，api文档有介绍
        let props = `${attr.attrId}:${attrValue}:${attr.attrName}`
        //数组去重
        if(this.searchParams.props.indexOf(props)===-1){
          this.searchParams.props.push(props)
          this.searchInfo()
        }
      },
      //删除属性面包屑
      removeAttr(index){
        this.searchParams.props.splice(index,1)
      }
    },
    mounted() {
      this.searchInfo()
    },
    computed:{
      ...mapGetters(['goodsList'])
    },
    //watch可以监听组件上的属性
    watch:{
      $route:{
        handler(newValue,oldValue){
          console.log(this.$route)
          Object.assign(this.searchParams,this.$route.query,this.$route.params)
          this.searchInfo()
          //如果下一次搜索时只有params参数，拷贝后会发现searchParams会保留上一次的query参数
          //所以每次请求结束后将相应参数制空
          this.searchParams.category1Id = '';
          this.searchParams.category2Id = '';
          this.searchParams.category3Id = '';
        },
      }
    },
  }
</script>
```

# 34、商品排序

排序的逻辑比较简单，只是改变一下请求参数中的 order 字段，后端会根据 order 值返回不同的数据来实现升降序。
order 属性值为字符串，例如‘1：asc’、‘2：desc’。1 代表综合，2 代表价格，asc 代表升序，desc 代表降序。

我们的升降序是通过箭头图标来辨别的，如图所示：
![在这里插入图片描述](https://img-blog.csdnimg.cn/c8c9d5160f5847b18e0d5e31dc52c261.png)
图标是 iconfont 网站的图标，通过引入在线 css 的方式引入图标

在 public 文件 index 引入该 css
` <link rel="stylesheet" href="https://at.alicdn.com/t/font_2994457_qqwrvmss9l9.css">`

在 search 模块使用该图标

```js
<div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
<!-- 这里isOne、isTwo、isAsc、isDesc是计算属性，如果不使用计算属性要在页面中写很长的代码-->
                <li :class="{active:isOne}" @click="changeOrder('1')">
<!--                  阿里图标前置类iconfont-->
                  <a  >综合<span v-show="isOne" class="iconfont" :class="{'icon-up':isAsc,'icon-down':isDesc}"></span></a>
                </li>
                <li :class={active:isTwo} @click="changeOrder('2')">
                  <a >价格<span v-show="isTwo" class="iconfont" :class="{'icon-up':isAsc,'icon-down':isDesc}"></span></a>
                </li>
              </ul>
            </div>
          </div>
```

isOne、isTwo、isAsc、isDesc 计算属性代码

```js
computed:{
      ...mapGetters(['goodsList']),
      isOne(){
        return this.searchParams.order.indexOf('1')!==-1
      },
      isTwo(){
        return this.searchParams.order.indexOf('2')!==-1
      },
      isDesc(){
        return this.searchParams.order.indexOf('desc')!==-1
      },
      isAsc(){
        return this.searchParams.order.indexOf('asc')!==-1
      },
    },
```

点击‘综合’或‘价格’的触发函数 changeOrder

```js
//flag用于区分综合、价格，1：综合，2：价格
      changeOrder(flag){
        let newSearchOrder = this.searchParams.order
        //将order拆为两个字段orderFlag(1:2)、order(asc:desc)
        let orderFlag = this.searchParams.order.split(':')[0]
        let order = this.searchParams.order.split(':')[1]
        //由综合到价格、由价格到综合
        if(orderFlag!==flag){
          //点击的不是同一个按钮
          newSearchOrder = `${flag}:desc`
          this.searchInfo()
        }else{
          //多次点击的是不是同一个按钮
          newSearchOrder = `${flag}:${order==='desc'?'asc':'desc'}`
          }
        //需要给order重新赋值
        this.searchParams.order = newSearchOrder;
        //再次发请求
        this.searchInfo();
      }
```

# 35、手写分页器（重点）

实际开发中是不会手写的，一般都会用一些开源库封装好的分页，比如 element ui。但是这个知识还是值得学习一下的。
核心属性：
pageNo（当前页码）、pageSize(每页多少数据)、total(一共多少条数据)、continues（连续展示的页码个数，一般是奇数 5,因为奇数对称）
核心逻辑是获取连续页码的起始页码和末尾页码，通过计算属性获得。（计算属性如果想返回多个数值，可以通过对象形式返回）

```js
  //连续页码的起始页码、末尾页码
    startNumAndEnd(){
      let start = 0 , end = 0;
      //规定连续页码数字5（totalPage至少5页）
      //不正常现象
      if(this.continues > this.totalPage){
        start = 1
        end = this.totalPage
      }else{
        //正常现象      Math.floor:想下取整
        start = this.pageNo - Math.floor(this.continues/2)
        end = this.pageNo + Math.floor(this.continues/2)
        //start出现不正常现象纠正
        if(start < 1){
          start = 1
          end = this.continues
        }
        //end出现不正常现象纠正
        if(end > this.totalPage){
          end = this.totalPage
          start = this.totalPage - this.continues + 1
        }
      }
      return {start,end}
    }
```

当点击页码会将 pageNo 传递给父组件，然后父组件发起请求，最后渲染。这里还是应用通过自定义事件实现子组件向父组件传递信息。

# 36、字符串拼接

如果你想在你的字符串内加入某个变量的值，就需要字符串拼接使用 ``（飘符号），由于 `飘`在 markdown 是单行代码标记所以下面我们用··代替。
字符串拼接 ·${}·，使用方法如下：
**在 js 中使用**

```js
var a = 1;
console.log(`a的值是：${a}`); //a的值是：1
```

**在 html 中使用**

```js
<router-link :to="`/detail/${goods.id}`"></router-link>
```

# 37、滚动条

使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样。 vue-router 能做到，而且更好，它让你可以自定义路由切换时页面如何滚动。
[router 滚动行为](https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html)

# 38、undefined 细节(**\***)

访问 undefined 的属性值会引起红色警告，可以不处理，但是要明白警告的原因。
以获取商品 categoryView 信息为例，categoryView 是一个对象。
对应的 getters 代码

```js
const getters = {
	categoryView(state) {
		return state.goodInfo.categoryView;
	},
};
```

对应的 computed 代码

```js
 computed:{
      ...mapGetters(['categoryView'])
    }
```

html 代码

```js
<div class="conPoin">
        <span v-show="categoryView.category1Name" >{{categoryView.category1Name}}</span>
        <span v-show="categoryView.category2Name" >{{categoryView.category2Name}}</span>
        <span v-show="categoryView.category3Name" >{{categoryView.category3Name}}</span>
      </div>
```

下细节在于 getters 的返回值。如果 getters 按上面代码写为`return state.goodInfo.categoryView`，页面可以正常运行，但是会出现红色警告。

**原因**：假设我们网络故障，导致 goodInfo 的数据没有请求到，即 goodInfo 是一个空的对象，当我们去调用 getters 中的`return state.goodInfo.categoryView`时，因为 goodInfo 为空，所以也不存在 categoryView，即我们 getters 得到的 categoryView 为 undefined。所以我们在 html 使用该变量时就会出现没有该属性的报错。
即：网络正常时不会出错，一旦无网络或者网络问题就会报错。
**总结**：所以我们在写 getters 的时候要养成一个习惯在返回值后面加一个||条件。即当属性值 undefined 时，会返回||后面的数据，这样就不会报错。
如果返回值为对象加||{}，数组：||[ ]。
此处 categoryView 为对象，所以将 getters 代码改为`return state.goodInfo.categoryView||{}`

# 39、商品详情（重点）

商品详情唯一难点就是点击轮播图图片时，改变放大镜组件展示的图片。

老师的方法很巧妙：在轮播图组件中设置一个 currendIndex，用来记录所点击图片的下标，并用 currendIndex 实现点击图片高亮设置。当符合图片的下标满足`currentIndex===index`时，该图片就会被标记为选中。

```js
  <div class="swiper-container" ref="cur">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(skuImage,index) in skuImageList" :key="skuImage.id">
        <img :src="skuImage.imgUrl" :class="{active:currentIndex===index}" @click="changeImg(index)">
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
```

轮播图组件和放大镜组件是兄弟组件，所以要通过全局总线通信。
在轮播图组件中，点击图片触发全局事件 changeImg，参数为图片所在数组的下标。

```js
 changeImg(index){
        //将点击的图片标识位高亮
        this.currentIndex = index
        //通知兄弟组件修改大图图片
        this.$bus.$emit("changeImg",index)
      }
```

对应的放大镜组件，首先在 mounted 监听该全局事件

```js
mounted() {
      this.$bus.$on("changeImg",(index)=>{
        //修改当前响应式图片
        this.currentIndex = index;
      })
    },
```

放大镜组件中也会有一个 currentIndex，他用表示大图中显示的图片的下标（因为放大镜组件只能显示一张图片），全局事件传递的 index 赋值给 currentIndex ，通过 computed 计算属性改变放大镜组件展示的图片下标。

```js
computed:{
      imgObj(){
          return this.skuImageList[this.currentIndex] || {}
      }
    },
```

放大镜组件展示图片的 html 代码

```js
<img :src="imgObj.imgUrl " />
```

至于放大镜相关知识，因为之前没有学过，而且我只是想学习一下前端业务逻辑，所以就丢弃了放大镜相关知识。
**但是**我还是要贴一个链接，如果用到，直接模仿这个链接的内容就可以实现。[js 实现放大镜](https://blog.csdn.net/weixin_40758850/article/details/89445629)

# 40、失焦事件

blur 与 change 事件在绝大部分情况下表现都非常相似，输入结束后，离开输入框，会先后触发 change 与 blur，唯有两点例外。
（1） 没有进行任何输入时，不会触发 change。
在这种情况下，输入框并不会触发 change 事件，但一定会触发 blur 事件。在判断表单修改状态时，这种差异会非常有用，通过 change 事件能轻易地找到哪些字段发生了变更以及其值的变更轨迹。

（2）输入后值并没有发生变更。
这种情况是指，在没有失焦的情况下，在输入框内进行返回的删除与输入操作，但最终的值与原值一样，这种情况下，keydown、input、keyup、blur 都会触发，但 change 依旧不会触发。

# 41、加入购物车成功路由

点击加入购物车时，会向后端发送 API 请求，但是该请求的返回值中 data 为 null，所以我们只需要根据状态码 code 判断是否跳转到‘加入购物车成功页面’。
detail 组件‘加入购物车’请求函数：

```js
async addShopCar() {
        try{
          await  this.$store.dispatch("addOrUpdateShopCart", {
            skuId: this.$route.params.skuId,
            skuNum: this.skuNum
          });
          //一些简单的数据，比如skuNum通过query传过去
          //复杂的数据通过session存储，
          //sessionStorage、localStorage只能存储字符串        sessionStorage.setItem("SKUINFO",JSON.stringify(this.skuInfo))
          this.$router.push({name:'AddCartSuccess',query:{'skuNum':this.skuNum}})
        }catch (error){
          alert(error.message)
        }

      }
```

detail store 对应代码

```js
//将产品添加到购物车中
    async addOrUpdateShopCart({commit},{skuId,skuNum}){
        let result = await reqAddOrUpdateShopCart(skuId,skuNum)
        if(result.code === 200){
            return 'ok'
        }else{
            return Promise.reject(new Error('faile'))
        }
    }
```

其实这里当不满足`result.code === 200`条件时，也可以返回字符串‘faile’，自己在 addShopCar 中判断一下返回值，如果为‘ok’则跳转，如果为‘faile’(或者不为‘ok’)直接提示错误。当然这里出错时返回一个 Promise.reject 更加符合程序的逻辑。

> 跳转‘加入购物车成功页面’的同时要携带商品的信息。本项目只是传递的商品的一些标签属性，并没有传递商品的型号类别的信息，比如颜色、内存等信息，自己可以手动实现，比较简单。

当我们想要实现**两个毫无关系**的组件传递数据时，首相想到的就是路由的 query 传递参数，但是 query 适合传递单个数值的简单参数，所以如果想要**传递对象**之类的复杂信息，就可以通过**Web Storage**实现。

**sessionStorage、localStorage 概念**：
**sessionStorage**：为每一个给定的源维持一个独立的存储区域，该区域在页面会话期间可用（即只要浏览器处于打开状态，包括页面重新加载和恢复）。
**localStorage**：同样的功能，但是在浏览器关闭，然后重新打开后数据仍然存在。
**注意**：无论是 session 还是 local 存储的值都是字符串形式。如果我们想要存储对象，需要在存储前 JSON.stringify()将对象转为字符串，在取数据后通过 JSON.parse()将字符串转为对象。

# 42、购物车组件开发

根据 api 接口文档封装请求函数

```js
export const reqGetCartList = () => {
	return requests({
		url: '/cart/cartList',
		method: 'GET',
	});
};
```

但是如果想要获取详细信息，还需要一个用户的 uuidToken，用来验证用户身份。但是该请求函数没有参数，所以我们只能把 uuidToken 加在请求头中。

创建 utils 工具包文件夹，创建生成 uuid 的 js 文件，对外暴露为函数（记得导入 uuid => `npm install uuid`）。
**生成临时游客的 uuid（随机字符串）,每个用户的 uuid 不能发生变化，还要持久存储**

```js
import { v4 as uuidv4 } from 'uuid';
//生成临时游客的uuid（随机字符串）,每个用户的uuid不能发生变化，还要持久存储
export const getUUID = () => {
	//1、判断本地存储是否由uuid
	let uuid_token = localStorage.getItem('UUIDTOKEN');
	//2、本地存储没有uuid
	if (!uuid_token) {
		//2.1生成uuid
		uuid_token = uuidv4();
		//2.2存储本地
		localStorage.setItem('UUIDTOKEN', uuid_token);
	}
	//当用户有uuid时就不会再生成
	return uuid_token;
};
```

用户的 uuid_token 定义在 store 中的 detail 模块

```js
const state = {
	goodInfo: {},
	//游客身份
	uuid_token: getUUID(),
};
```

在 request.js 中设置请求头

```js
import store from '@/store';
requests.interceptors.request.use(config => {
	//config内主要是对请求头Header配置

	//1、先判断uuid_token是否为空
	if (store.state.detail.uuid_token) {
		//2、userTempId字段和后端统一
		config.headers['userTempId'] = store.state.detail.uuid_token;
	}
	//比如添加token

	//开启进度条
	nprogress.start();
	return config;
});
```

注意 this.$store 只能在组件中使用，不能再 js 文件中使用。如果要在 js 中使用，需要引入`import store from '@/store';`

# 43、购物车商品数量修改及个人疑问

1、购物车商品信息展示比较简单，就不多做赘述。
2、every 函数使用

> every 遍历某个数组，判断数组中的元素是否满足表达式，全部为满足返回 true，否则返回 false

例如判断底部勾选框是否全部勾选代码部分

```js
//判断底部勾选框是否全部勾选
      isAllCheck() {
        //every遍历某个数组，判断数组中的元素是否满足表达式，全部为满足返回true，否则返回false
        return this.cartInfoList.every(item => item.isChecked === 1)
      }
```

3、修改商品数量前端代码部分：
**注意**：通过@click、@change 触发 handler 函数改变商品数量。
**引申**：在我自己写代码的同时，我发现，当使用函数的参数个数不同时，例如：handler('minus',-1,cartInfo)和 handler('minus',-1)，执行的还是同一个 method 的 handler 函数，只是对应的参数变为了 undefined。即 js 不会像 java 一样，有代码的重载。

```js
 <li class="cart-list-con5">
     <a href="javascript:void(0)" class="mins" @click="handler('minus',-1,cartInfo)">-</a>
     <input autocomplete="off" type="text" :value="cartInfo.skuNum" @change="handler('change',$event.target.value,cartInfo)" minnum="1" class="itxt">
     <a href="javascript:void(0)" class="plus" @click="handler('add',1,cartInfo)">+</a>
 </li>
```

handler 函数，修改商品数量时，加入**节流**操作。

> 添加到购物车和对已有物品进行数量改动使用的同一个 api，可以查看 api 文档。
> handler 函数有三个参数，type 区分操作，disNum 用于表示数量变化（正负）,cart 商品的信息

```js
 //加入节流操作
 handler: throttle(async  function(type,disNum,cart){
       //减按钮判断当前数量是否为1
    if(type === 'minus') {
       //当商品数量为1是，不可以再减少
       if(cart.skuNum === 1){
           return;
       }
    }
   //输入框修改,难点：要判断输入的内容是否合法
    if(type === 'change'){
       //输入内容不合法时
        if(isNaN(disNum * 1)  || disNum <= 0){
          disNum = 0;
        }else{
          disNum = parseInt(disNum) - cart.skuNum
        }
    }
   //加按钮disNum不需要改变
   try{
       await this.$store.dispatch('addOrUpdateShopCart',{skuId:cart.skuId,skuNum:disNum})
    //商品数量修改成功后再次获取服务器数据
       await this.$store.dispatch("getCartList")

   }catch (error){
       alert(error)
   }
},100),
```

**个人疑点**：在最后一步更新商品信息时，我最初的想法时使用`this.$router.push('/shopcart')`实现。因为，我们 shopcart 页面的 mounted 会去获取商品信息。当路由跳转时会执行 mounted 的内容，实现商品数据信息更新。

```js
mounted(){
      this.$store.dispatch("getCartList")
    },
```

但是这样做不会更新商品数据，原因是：因为我要跳往的路由和当前路由相同，并且路由参数没有改变，所以他就不会跳转。

vue-router 判断路由相同时会如下报错，但是项目刚开始时候重写过路由的 push 方法，将错误掩盖了

<strong style="color:red">NavigationDuplicated: Avoided redundant navigation to current location</strong>

## a 标签阻止点击事件

> ```css
> .click-disabled {
>
> ​       // 给a标签添加css属性，禁止点击a标签
>
> ​       pointer-events: none; //阻止所有点击事件
>
> ​      }
> ```

# 44、购物车状态修改和商品删除

这部分都比较简单，这里不多做赘述，唯一需要注意的是当 store 的 action 中的函数返回值 data 为 null 时，应该采用下面的写法（**重点是 if，else 部分**）

action 部分：以删除购物车某个商品数据为例

```js
//修改购物车某一个产品的选中状态
    async reqUpdateCheckedById({commit},{skuId,isChecked}){
        let result = await reqUpdateCheckedById(skuId,isChecked)
        if(result.code === 200){
            return 'ok'
        }else{
            return Promise.reject(new Error('fail'))
        }
    }
```

method 部分：（**重点是 try、catch**）

```js
async reqUpdateCheckedById(cart,event){
        let isChecked = event.target.checked ? 1 :0
        try{
          await this.$store.dispatch("reqUpdateCheckedById",{skuId:cart.skuId,isChecked:isChecked})
          //修改成功，刷新数据
          this.$store.dispatch()
        }catch (error){
          this.$store.dispatch("getCartList")
        }
      }
```

# 45、删除多个商品（actions 扩展）

由于后台只提供了删除单个商品的接口，所以要删除多个商品时，只能多次调用 actions 中的函数。
我们可能最简单的方法是在 method 的方法中多次执行 dispatch 删除函数，当然这种做法也可行，但是为了深入了解 actions，我们还是要将批量删除封装为 actions 函数。
actions 扩展
官网的教程，一个标准的 actions 函数如下所示：

```js
 deleteAllCheckedById(context) {
        console.log(context)

    }
```

我们可以看一下 context 到底是什么。
![在这里插入图片描述](https://img-blog.csdnimg.cn/f2767f2ab7df4046b71e675d979ca3ec.png)
context 中是包含 dispatch、getters、state 的，即我们可以在 actions 函数中通过 dispatch 调用其他的 actions 函数，可以通过 getters 获取仓库的数据。
这样我们的批量删除就简单了，对应的 actions 函数代码让如下

```js
/删除选中的所有商品
    deleteAllCheckedById({dispatch,getters}) {
        getters.getCartList.cartInfoList.forEach(item =>  {
            let result = [];
            //将每一次返回值添加到数组中
            result.push(item.isChecked === 1?dispatch('deleteCartById',item.skuId):'')


        })
	return Promise.all(result)
    },
```

上面代码使用到了 Promise.all

> Promise.all 可以将多个 Promise 实例包装成一个新的 Promise 实例。同时，成功和失败的返回值是不同的，成功的时候返回的是一个结果数组，而失败的时候则返回最先被 reject 失败状态的值。

购物车组件 method 批量删除函数

```js
//删除选中的所有商品
      async deleteAllCheckedById(){
        try{
          await this.$store.dispatch('deleteAllCheckedById')
          //删除成功，刷新数据
          this.$store.dispatch("getCartList")
        }catch (error){
          alert(error)
        }
      },
```

修改商品的全部状态和批量删除的原理相同，直接贴代价。
actions

```js
//修改购物车全部产品的选中状态
    async updateAllChecked({dispatch,getters},flag){
        let result = []
        getters.getCartList.cartInfoList.forEach(item => {
            result.push(dispatch('reqUpdateCheckedById',{skuId:item.skuId,isChecked:flag
            }))
        })
        return Promise.all(result)
    }
```

method

```js
 //修改全部商品的状态
      async allChecked(event){
         let flag =  event.target.checked ? 1 : 0
         console.log(flag)
         try{
           await this.$store.dispatch('updateAllChecked',flag)
           //修改成功，刷新数据
           this.$store.dispatch("getCartList")
         }catch (error){
           alert(error)
         }
      }
```

**bug 纠正**
computed 中的 cartInfoList 没有写[ ]返回值。当后台返回的购物车数据为空时，cartInfoList 就会为 undefined，会导致后面的 total、isAllCheck 等计算属性使用到 cartInfoList 时产生计算错误。

正确代码:

```js
 cartInfoList(){
        return this.getCartList.cartInfoList || [];
      },
```

错误代码:

```js
 cartInfoList(){
        return this.getCartList.cartInfoList;
      },
```

# 46、注册登录业务(重点)

**1、ES6 const 新用法**

```js
const { comment, index, deleteComment } = this;
```

上面的这句话是一个简写，最终的含义相当于:

```js
const comment = this.comment;
const index = this.index;
const deleteComment = this.deleteComment;
```

**2、用户注册模块**
actions 部分(验证码部分省略)

```js
//用户注册
    async userRegister({commit},data){
        let result = await reqPostRegister(data)
        if(result.code === 200){
            return 'ok'
        }else{
            return Promise.reject(new Error(result.message))
        }
    }
```

methods 注册功能
注册成功跳转到登陆页面，并且携带用户账号（个人完善）

```js
      async userRegister(){
        const{phone,password,code} = this
        try{
          phone && password && code && await this.$store.dispatch('userRegister',{phone,password,code})
          //注册成功跳转到登陆页面，并且携带用户账号
          await this.$router.push({path:'/login',query:{name:this.phone}})
        }catch (error){
          alert(error)
        }
      },
```

`this.$store.dispatch('userRegister',{phone,password,code})`因为 K 、V 相同，所以只传 K
3、登录模块
前端部分内容

```js
			<form >
              <div class="input-text clearFix">
                <span></span>
                <input type="text" placeholder="邮箱/用户名/手机号" v-model="phone">
              </div>
              <div class="input-text clearFix">
                <span class="pwd"></span>
                <input type="password" placeholder="请输入密码" v-model="password">
              </div>
              <div class="setting clearFix">
                <label class="checkbox inline">
                  <input name="m1" type="checkbox" value="2" checked="">
                  自动登录
                </label>
                <span class="forget">忘记密码？</span>
              </div>
              <button class="btn" @click.prevent="goLogin">登&nbsp;&nbsp;录</button>
            </form>
```

由于登录按钮的父节点是一个 form 表单，如果使用@click 触发登录事件，form 表单会执行默认事件 action 实现页面跳转。这里我们使用`@click.prevent`，它可以阻止自身默认事件的执行。

actions 登陆函数

```js
//登录
    async userLogin({commit},data){
        let result = await reqPostLogin(data)
        //服务器会返回token
        if(result.code === 200){
            //token存入vuex
            commit("SETUSERTOKEN",result.data.token)
            //持久化存储token
            localStorage.setItem('TOKEN',result.data.token)
            return 'ok'
        }else{
            return Promise.reject(new Error(result.message))
        }
    },
```

mutations 设置用户 token

```js
//设置用户token
    SETUSERTOKEN(state,token){
        state.token = token
    }
```

登陆组件 methods 登陆函数

```js
 async goLogin(){
        try{
          //会将this中的phone,password以对象的形式返回
          const {phone,password} = this
          phone && password && await this.$store.dispatch('userLogin',{phone,password})
          //路由跳转到home首页
          this.$router.push('/')
        }catch (error){
          alert(error)
        }
      }
```

登陆成功后获取用户信息
actions 函数

```js
async getUserInfo({commit}){
        let result = await reqGetUserInfo();
        //将用户信息存储到store中
        if(result.code === 200){
            //vuex存储用户信息
            commit('SETUSERINFO',result.data)
            return  'ok'
        }else{
            return Promise.reject(new Error(result.message))
        }
    },
```

mutations 存储用户信息

```js
//存储用户信息
    SETUSERINFO(state,data){
        state.userInfo = data
    },
```

# 47、导航守卫


为什么要判断 name？

> 因为 store 中的 token 是通过 localStorage 获取的，token 有存放在本地。当页面刷新时，本地 token 不会消失，所以 store 中的 token 也不会消失。但是，store 中的其他数据（用户信息等）会清空，此时会出现用户信息不存在，但是有 token，这种情况是不可以访问其他页面的，必须先去获取用户信息。由于用户信息是一个对象，所以我们通过它的一个属性 name 判断用户信息是否存在。
> 所以不仅要判断 token,还要判断用户信息



router index.js 全局前置守卫代码

```js
//设置全局导航前置守卫
router.beforeEach(async (to, from, next) => {
	let token = store.state.user.token;
	let name = store.state.user.userInfo.name;
	//1、有token代表登录，全部页面放行
	if (token) {
		//1.1登陆了，不允许前往登录页
		if (to.path === '/login') {
			next('/');
		} else {
			//1.2、因为store中的token是通过localStorage获取的，token有存放在本地
			// 当页面刷新时，token不会消失，但是store中的其他数据会清空，
			// 所以不仅要判断token,还要判断用户信息

			//1.2.1、判断仓库中是否有用户信息，有放行，没有派发actions获取信息
			if (name) next();
			else {
				//1.2.2、如果没有用户信息，则派发actions获取用户信息
				try {
					await store.dispatch('getUserInfo');
					next();
				} catch (error) {
					//1.2.3、获取用户信息失败，原因：token过期
					//清除前后端token，跳转到登陆页面
					await store.dispatch('logout');
					next('/login');
				}
			}
		}
	} else {
		//2、未登录，首页或者登录页可以正常访问
		if (to.path === '/login' || to.path === '/' || to.path === '/register')
			next();
		else {
			alert('请先登录');
			next('/login');
		}
	}
});
```

# 48、交易模块（重点）

如果前面的知识你都理解了，后面的模块开发都会比较简单。无非就是老师讲到的开发四步骤
（1）封装 API
（2）vuex 三件套
（3）dispatch 发请求
（4）数据渲染
**注意：**（3）中，如果在发请求之后还有一些对返回数据的操作，应考虑到是否需要 async await。
**至此，个人认为本项目中的 vue 前端知识点应该就这些了，后面的相关组件开发，用到的知识在前面都有使用。如果有新知识，会继续更新。**

登录账号：13700000000/111111

```js
 //点击支付按钮，弹出支付二维码
      async opens(){

        this.$alert(`<img height="200px" width="200px" src="${this.payImg}"  / >`, '请使用微信扫码', {
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
          center: true
        });
        //需要知道订单是否支付成功
        //成功则跳转，失败则提示信息
        if(!this.timer){
          //定时器间歇发送请求获取订单支付状态
          this.timer = setInterval(async ()=>{
            let result = await this.$API.reqGetPayStatus(this.payInfo.orderId)
            console.log(result)
            //因为每次支付都要花钱，所以直接205（支付中）就跳转了，
            if(result.code === 205){
              //1、清除定时器
              clearInterval(this.timer)
              this.timer = null
              //2、保存支付成功返回的code
              this.code = result.code
              //3、关闭弹出框
              this.$msgbox.close()
              //4、跳转到下一个路由
              this.$router.push('/paysuccess')
            }
          },1000)
        }
      }
```


如果 code===200 跳转，我们必须支付后台提供的二维码，才会返回 200，所以这里直接 205 就跳转了，后面的支付信息感觉没有意义了。所以，后面的支付内容就不写了。

## Vue 图片引入

因为在引入我们个人支付二维码图片遇到了一些问题，所以这里就介绍一下图片引入的方式。
图片引入分两种：js 内引入图片，非 js 内引入图片。

**非 js 内引入图片（html）**：一般都是通过路径引入，例如：`<img src="../assets/pay.jpg">`。

### _js 中引入图片为什么需要 require 或者 import?_

> 原因：webpack 会将 js 中引入的东西都当做模块，模块只能通过 require(CommonJS 语法)或 import(ES6 语法)

**js 内引入图片**: 可分为通过路径引入和不通过路径引入。
1、如果想要通过**路径方式**在 vue 中的 js 引入图片，**必须 require 引入**。
例如：js 中引入个人支付二维码可以通过下面方式实现

```js
this.$alert(
	`<img height="200px" width="200px" src="${require('@/assets/pay.jpg')}"  / >`,
	'请使用微信扫码',
	{
		dangerouslyUseHTMLString: true,
		showCancelButton: true,
		center: true,
	}
);
```

2、当然也可以不使用 require，如果使用 require，就不能通过路径方式引入。有两种方式：
（1）直接引入网页图片链接（前面引入个人收款码就是通过该方法实现）
（2）在< script >中通过 import 导入图片，然后在 js 中使用

```js
<script>
import payImg  from '@/assets/pay.jpg'
export default {
methods:{
      //点击支付按钮，弹出支付二维码1
      async opens(){
        this.$alert(`<img height="200px" width="200px" src="${require('@/assets/pay.jpg')}"  / >`, '请使用微信扫码', {
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
          center: true
        });
       }
}
</script>
```



# 49、个人中心

终于用到了二级路由，虽然二级路由在后台管理系统常用，但是我们的个人中心也可以用到二级路由。
routers.js

> **注意：** 二级路由要么不写/，要么写全：'/center/myorder'。_VueRouter 已经自动加上了/_

```js
//个人中心
    {
        name: 'Center',
        path: '/center',
        component:  () => import('@/pages/Center'),
        children: [
            {
                //二级路由要么不写/，要么写全：'/center/myorder'
                path: 'myorder',
                component: () => import('@/pages/Center/MyOrder')
            },
            {
                path: 'groupbuy',
                component: () => import('@/pages/Center/GroupOrder'),
            },
            //默认显示
            {
                path: '',
                redirect: 'myorder'
            }
        ]
    }
```

## 关于 router-view

> <router-view>是一个路由展示占位符，能且只能展示当前组件下的下一级路由组件。如果是展示下下级路由，则需要在下级路由中使用<router-view>

## 默认路由重定向

个人中心会显示子路由中其中一个页面作为默认页面，这里我们把 MyOrder 组件作为默认页面。

` { path: '', redirect: 'myorder' }`表示当我们访问 center 路由时，center 中的 router-view 部分默认显示 myorder 二级路由内容。

我们的子路由最好放在父路由文件夹下。


> Named Route 'Center' has a default child route. When navigating to this named route (:to="{name: 'Center'"), the default child route will not be rendered. Remove the name from this route and use the name of the default child route for named links instead.
>
> **警告缘由**：Center 路由有默认子路由，如果路由跳转使用命名路由，则无法渲染默认的子路由。解决办法是去掉 name:'Center'就好了。

对应的代码

```js
//个人中心
    {
        name: 'Center',
        path: '/center',
        component:  () => import('@/pages/Center'),
        children: [
            {
                //二级路由要么不写/，要么写全：'/center/myorder'
                path: '/center/myorder',
                component: () => import('@/pages/Center/MyOrder')
            },
            {
                path: '/center/groupbuy',
                component: () => import('@/pages/Center/GroupOrder'),
            },
            //默认显示
            {
                path: '',
                redirect: 'myorder'
            }
        ]
    }
```

# 50、路由独享的守卫(**\***)

全局导航守卫已经帮助我们限制未登录的用户不可以访问相关页面。但是还会有一个问题。
例如：

> 用户已经登陆，用户在 home 页直接通过地址栏访问 trade 结算页面，发现可以成功进入该页面，正常情况，用户只能通过在 shopcart 页面点击去结算按钮才可以到达 trade 页面。我们可以通过路由独享守卫解决该问题

路由独享的守卫：只针对一个路由的守卫，所以该守卫会定义在某个路由中。
以上面问题为例，我们可以通过路由独享的守卫解决。
在 trade 路由信息中加入路由独享守卫

```js
//交易组件
    {
        name: 'Trade',
        path: '/trade',
        meta: {show:true},
        component:  () => import('@/pages/Trade'),
        //路由独享首位
        beforeEnter: (to, from, next) => {

            if(from.path ===  '/shopcart' ){
                next()
            }else{
              //next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
                next(false)
            }
        }
    },
```

上面的代码已经实现了 trade 路由只能从 shopcart 路由跳转。`next(false)`指回到 from 路由。
但是，上面的代码还会有 bug，就是当我们在 shopcart 页面通过地址栏访问 trade 时还是会成功。正常情况应该是只有当我们点击**去结算按钮**后才可以进入到 trade 页面。（这只是我个人观点）
**解决办法：**
在 shopcart 路由信息**meta**中加一个**flag**，初始值为 false。当点击去结算按钮后，将 flag 置为 true。在 trade 的独享路由守卫中判断一下 flag 是否为 true，当 flag 为 true 时，代表是通过点击去结算按钮跳转的，所以就放行。
shopcart 路由信息

```js
 //购物车
    {
        path: "/shopcart",
        name: 'ShopCart',
        component: ()=> import('../pages/ShopCart'),
        meta:{show: true,flag: false},
    },
```

shopcart 组件去结算按钮触发事件

```js
toTrade(){
        this.$route.meta.flag = true
        this.$router.push('/trade')
      }
```

trade 路由信息

```js
//交易组件
    {
        name: 'Trade',
        path: '/trade',
        meta: {show:true},
        component:  () => import('@/pages/Trade'),
        //路由独享首位
        beforeEnter: (to, from, next) => {
            if(from.path ===  '/shopcart' && from.meta.flag === true){
                from.meta.flag = false
                next()
            }else{
                next(false)
            }
        }
    },
```

**注意，判断通过后，在跳转之前一定要将 flag 置为 false。**

## 关于在 trade 和 pay 页刷新回到 home 问题

> 原因：刷新相当于由'/'跳转到'/trade'或者'/pay'，因为加了判断，所以会停留在路由为'/'的页面。然后因为我们重定向了路由，如果路由为'/'则跳转到'/'。（此处 vue-DevTools 显示的路由 from 是有问题的）
>
> 解决办法：不能用路由的 path 来判断，最好使用 meta 里面添加标识，来标记路由是从目标路由跳转过来的

# 51、图片懒加载

[懒加载 vue-lazyload 插件官网](https://www.npmjs.com/package/vue-lazyload)
插件的使用直接参考官方教程，很简单。



## 挖个坑，自己封装图片懒加载插件





## vue 使用插件的原理

每个插件都会有一个 install 方法，install 后就可以在我们的代码中可以使用该插件。这个 install 有两类参数，第一个为 Vue 实例，后面的参数可以自定义。
vue 使用插件的步骤
1、引入插件 `import VueLazyload from "vue-lazyload";`
2、注册插件`Vue.use(VueLazyload)`
这里的 Vue.use()实际上就是调用了插件的 install 方法。如此之后，我们就可以使用该插件了。

# 52、表单验证

## vee-validate表单验证（不推荐，太难用了）

> Vue3用npm i vee-validate@4
>
> Vue2用npm i vee-validate@2或者3版本 推荐用2版本，3版本看不懂

##  element ui 的 from 表单验证（推荐）

[element ui from 表单验证链接](https://element.eleme.cn/#/zh-CN/component/form)



## 自己封装表单验证插件（用js实现，了解验证过程）





# 53、路由懒加载

原来我一直使用的 import()是路由懒加载，哈哈!，

当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。
[路由懒加载链接](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)
我还是喜欢下面的写法，不太喜欢官网的写法。
代码示例：

```js
  //详情页面组件
    {
        //需要params传参（产品id）
        path: "/detail/:skuId",
        name: 'Detail',
        component: ()=> import('../pages/Detail'),
        meta:{show: true},
    },
    //添加购物车成功
    {
        path: "/addcartsuccess",
        name: 'AddCartSuccess',
        component: ()=> import('../pages/AddCartSuccess'),
        meta:{show: true},
    },
```

# 54、打包项目

项目到此基本就完成了，接下来就是打包上线。在项目文件夹下执行`npm run build`。会生成 dist 打包文件。
dist 就是我们打包好的项目文件

dist 文件下的 js 文件存放我们所有的 js 文件，并且经过了加密，并且还会生成对应的 map 文件。

**map 文件作用**：因为代码是经过加密的，如果运行时报错，输出的错误信息无法准确得知时那里的代码报错。有了 map 就可以向未加密的代码一样，准确的输出是哪一行那一列有错。

当然 map 文件也可以去除（map 文件大小还是比较大的）
在 vue.config.js 配置`productionSourceMap: false`即可。
注意：vue.config.js 配置改变，需要重启项目



# 55、部署项目

## 1.购买服务器+nginx反向代理

购买腾讯云或者阿里云，然后设置安全组开放端口。在云服务器安装nginx。

进入到Nginx的配置文件夹中：

```shell
cd /usr/local/nginx/conf/
```

编辑Nginx配置文件：

```shell
vim nginx.conf
```

```shell
server {                                                                     
    listen       80;                                                         
    listen  [::]:80;                                                         
    server_name  frontvue-xxx.com;                 
                                                                             
    #access_log  /var/log/nginx/host.access.log  main;                       
                                                                             
    location / {                                                             
        root   /etc/nginx/html;                                        
        index  index.html index.htm;                                         
    }                                                                        
                                                                             
    location /auth {                                                         
        proxy_pass http://xxx.com:30000;
    }                                                                        
                                                                             
    location /api-apm {                                                      
        proxy_pass http://abcxxx.com:30000;
    }                                                                   
                                                                        
    #error_page  404              /404.html;                            
                                                                        
    # redirect server error pages to the static page /50x.html          
    #                                                                   
    error_page   500 502 503 504  /50x.html;                            
    location = /50x.html {                                              
        root   /etc/nginx/html;                                   
    } 
}    
```

## 2.本地使用NodeJS+Express部署前端

> 前提：下载express,connect-history-api-fallback,http-proxy-middleware

将打包的dist目录放到node项目中，

sever.js文件

```js
const express = require('express');
const history = require('connect-history-api-fallback');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
//中间件
//服务器中间件专门解决history模式(vue)出错的问题 (前端路由,后端路由混杂)
///注意如果是hash模式就不会有这个问题
app.use(history());
app.use(express.static(`${__dirname}/dist`));
// 代理前端请求地址，当请求的前缀是/api，直接转发请求到服务器http://gmall-h5-api.atguigu.cn
app.use(
	'/api',
	createProxyMiddleware({
		target: 'http://gmall-h5-api.atguigu.cn',
		changeOrigin: true,
	})
);

app.listen(5001, error => {
	if (!error) console.log('服务器启动了');
});

```





# 56、组件间通信方式

常用的有6种，还有一些不常用的了解就行

## 1、props 

### 1.1使用子组件使用props接受

>使用场景:[父子通信]
>
>传递数据类型：
>1:可能是函数  -----------实质子组件想给父亲传递数据
>2:可能不是函数-----------实质就是父亲给子组件传递数据
><TodoList :todos="123"  updateChecked="hander">
>
>特殊情况：路由传递props
>1:布尔值类型，把路由中params参数映射为组件props数据
>2:对象，静态数据，很少用
>3:函数，可以把路由中params|query参数映射为组件props数据

自定义组件使用props传递数据。比如我们之前自定义的分页器组件例如：

```js
<PageNation @click="getPageNo"
:pageNo="searchParams.pageNo"
:pageSize="searchParams.pageSize"
:total="totals"
:continues="5"/>
```

> 这里的@click 并不是原生 DOM 事件，而是我们自定义的事件。我们通常使用此类自定义事件实现子组件给父组件通信。（即在子组件中会有事件名为 click 的自定义事件）
> 这里的:pageNo 是 props，可以实现父组件给子组件传递信息。

**注意**：刚开始这里有一个问题，我们上面:continues="5"传递的明明是一个常量为什么还需要 v-bind 绑定事件呢？
官方解释

> 传递字符串常量：`<blog-post title="My journey with Vue"></blog-post>`
> 传入一个数字 即便 `42` 是常量，我们仍然需要 `v-bind` 来告诉 Vue。这是一个 JavaScript 表达式而不是一个字符串 `<blog-post v-bind:likes="42"></blog-post>`

[props 官方文档](https://cn.vuejs.org/v2/guide/components-props.html)

### 1.2[非 Prop 的 Attribute](https://v2.cn.vuejs.org/v2/guide/components-props.html#非-Prop-的-Attribute)

`$attrs`：组件实例的属性，可以获取到父亲传递的props数据（前提子组件没有通过props接受）



## 2、组件的自定义事件

### 2.1、常规：绑定自定义事件

1. 一种组件间通信的方式，适用于：<strong style="color:red">子组件 ===> 父组件</strong>

2. 使用场景：A 是父组件，B 是子组件，B 想给 A 传数据，那么就要在 A 中给 B 绑定自定义事件（<span style="color:red">事件的回调在 A 中</span>）。

3. 绑定自定义事件：

   1. 第一种方式，在父组件中通过@绑定：`<Demo @atguigu="test"/>` 或 `<Demo v-on:atguigu="test"/>`

   2. 第二种方式，在父组件中：

      通过$on绑定。

      ```js
      <Demo ref="demo"/>
      ......
      mounted(){
         this.$refs.xxx.$on('atguigu',this.test)
      }
      ```

   3. 若想让自定义事件只能触发一次，可以使用`once`修饰符，或`$once`方法。

4. 触发自定义事件：`this.$emit('atguigu',数据)`

5. 解绑自定义事件`this.$off('atguigu')`

6. 组件上也可以绑定原生 DOM 事件，需要使用`native`修饰符。

7. 注意：通过`this.$refs.xxx.$on('atguigu',回调)`绑定自定义事件时，回调<span style="color:red">要么配置在 methods 中</span>，<span style="color:red">要么用箭头函数</span>，否则 this 指向会出问题！

8. <strong style="color:red">$listeners：组件实例的属性，可以获取到父亲传递自定义事件（对象形式呈现）</strong>

9. ### [使用事件抛出一个值](https://v2.cn.vuejs.org/v2/guide/components.html#使用事件抛出一个值)

`有的时候用一个事件来抛出一个特定的值是非常有用的。例如我们可能想让 `<blog-post>` 组件决定它的文本要放大多少。这时可以使用 `$emit` 的第二个参数来提供这个值：

```html
<button v-on:click="$emit('enlarge-text', 0.1)">
  Enlarge text
</button>
```

9.1然后当在父级组件监听这个事件的时候，我们可以通过 `$event` 访问到被抛出的这个值：

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += $event"
></blog-post>
```

9.2或者，如果这个事件处理函数是一个方法：

```html
<blog-post
  ...
  v-on:enlarge-text="onEnlargeText"
></blog-post>
```

那么这个值将会作为第一个参数传入这个方法：

```js
methods: {
  onEnlargeText: function (enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

### 2.2、v-model实现组件通信？

#### 2.2.1、v-model实现双向数据绑定

`v-model` 指令在表单 `<input>`、`<textarea>` 及 `<select>` 元素上创建双向数据绑定。它会根据控件类型自动选取正确的方法来更新元素。尽管有些神奇，但 `v-model` 本质上不过是语法糖。它负责``监听用户的输入事件以更新数据``，并对一些极端场景进行一些特殊处理。

> *对于非组件标签，v-model只能应用在表单类元素（输入类元素）上*
>
> ```html
> <h2 v-model:x="value">错误写法</h2>
> <!-- 错误写法,报错：Error compiling template:
> <h2 v-model="value">: v-model is not supported on this element type. 
>  -->
> ```
>
> 

> `v-model` 会忽略所有表单元素的 `value`、`checked`、`selected` attribute 的初始值而总是将 Vue 实例的数据作为数据来源。你应该通过 JavaScript 在组件的 `data` 选项中声明初始值。
>
> *收集表单数据：*
>
> ​    *若：<input type="text"/>，则v-model收集的是value值，用户输入的就是value值。*
>
> ​    *若：<input type="radio"/>，则v-model收集的是value值，且要给标签配置value值。*
>
> ​    *若：<input type="checkbox"/>*
>
> ​     *1.没有配置input的value属性，那么收集的就是checked（勾选 or 未勾选，是布尔值）*
>
> ​     *2.配置input的value属性:*
>
> ​       *(1)v-model的初始值是非数组，那么收集的就是checked（勾选 or 未勾选，是布尔值）*
>
> ​       *(2)v-model的初始值是数组，那么收集的的就是value组成的数组*
>
> ​    *备注：v-model的三个修饰符：*
>
> ​      *lazy：失去焦点再收集数据*
>
> ​      *number：输入字符串转为有效的数字*
>
> ​      *trim：输入首尾空格过滤*



> v-model实现原理：  
>
> `v-model` 在内部为不同的输入元素使用不同的 property 并抛出不同的事件：
>
> - text 和 textarea 元素使用 `value` property 和 `input` 事件；
> - checkbox 和 radio 使用 `checked` property 和 `change` 事件；
> - select 字段将 `value` 作为 prop 并将 `change` 作为事件。

#### 2.2.2、v-model实现父子通信且数据同步

[自定义组件的 `v-model`官网描述]((https://v2.cn.vuejs.org/v2/guide/components-custom-events.html#自定义组件的-v-model))

> <strong style="color:red">一个组件上的 v-model 默认会利用名为 value 的 prop 和名为 input 的事件</strong>

```html
<CustomInput v-model="msg"></CustomInput>
<!-- 这行代码相当于(v-model是语法糖)
<CustomInput :value='msg' @input='msg = $event'></CustomInput>
-->
```

> 上面一行代码：v-model绑定的"msg"通过props以value这个属性传给CustomInput这个子组件，即在CustomInput组件中可以使用 `props:['value']` 接收到 ``"msg"``。并且给CustomInput组件绑定了名为 ``'input'``的自定义事件，即`@input`
>
> 当CustomInput组件触发一个 `input` 事件并附带一个新的值的时候,即 `$emit('input',newValue)`这个 `msg` 的 property 将会被更新
>
> ```vue
> <template>
>   <div style="background: #ccc; height: 50px;">
>     <h2>input包装组件----{{value}}</h2>
>     <input :value="value"  @input="$emit('input',$event.target.value)"/>
>   </div>
> </template>
> 
> <script type="text/ecmascript-6">
>   export default {
>     name: 'CustomInput',
>     props:['value']
>   }
> </script>
> 
> ```
>
> `msg`的数据在父子组件里面是同步的，父组件传递给子组件，子组件触发自定义事件又修改了msg的值，父子组件`msg`双向绑定。



> 但是像单选框、复选框等类型的输入控件可能会将 value attribute 用于不同的目的。model 选项可以用来避免这样的冲突：
>
> ```js
> Vue.component('base-checkbox', {
>   model: {
>     prop: 'checked',
>     event: 'change'
>   },
>   props: {
>     checked: Boolean
>   },
>   template: `
>     <input
>       type="checkbox"
>       v-bind:checked="checked"
>       v-on:change="$emit('change', $event.target.checked)"
>     >
>   `
> })
> ```
>
> 



### 2.3、属性修饰符.sync，可以实现父子数据同步。

以后在elementUI组件中出现，实现父子数据同步。

[.sycn修饰符官网解释](https://v2.cn.vuejs.org/v2/guide/components-custom-events.html)

> 父组件:
>
> ```html
> <!-- props传递money，绑定自定义事件'update:money' -->	
> <Child :money="money" @update:money="money = $event"></Child>
> <h2>使用sync修改符等价于上面的代码，其实就是语法糖</h2>
> <Child2 :money.sync="money"></Child2>
> ```
>
> 子组件：
>
> ```html
> <button @click="$emit('update:money', money - 100)">花钱</button>
> ```
>
> 注意带有 `.sync` 修饰符的 `v-bind` **不能**和表达式一起使用 (例如 `v-bind:title.sync=”doc.title + ‘!’”` 是无效的)。取而代之的是，你只能提供你想要绑定的 property 名，类似 `v-model`。



>当我们用一个对象同时设置多个 prop 的时候，也可以将这个 `.sync` 修饰符和 `v-bind` 配合使用：
>
>```html
><text-document v-bind.sync="doc"></text-document>
>
><script type="text/ecmascript-6">
>	import text-document from './text-document.vue'
>	export default {
>	  name: 'SyncTest',
>	  data() {
>	    return {
>	      doc:{
>	      	title:'.sync修饰符',
>	      	content:'自定义事件'
>	      }
>	    }
>	  },
>	  components: {
>	    text-document
>	  }
>	}
></script>
>```
>
>
>
>这样会把 `doc` 对象中的每一个 property (如 `title`、`content`) 都作为一个独立的 prop 传进去，然后各自添加用于更新的 `v-on` 监听器。
>
>注意：将 `v-bind.sync` 用在一个字面量的对象上，例如 `v-bind.sync=”{ title: doc.title }”`，是无法正常工作的，因为在解析一个像这样的复杂表达式的时候，有很多边缘情况需要考虑。

### 2.4、$listeners(用的不多了解就行)

> Vue 提供了一个 `$listeners` property，它是一个对象，里面包含了父组件绑定到子组件上的所有监听器
>
> 父组件：
>
> ```html
> <HintButton
> 			type="success"
> 			icon="el-icon-plus"
> 			title="封装el-button"
> 			@click="handler"
> 			@dblclick="1"
> 			@el-button="2"
> 		/>
> ```
>
> 子组件：
>
> ```html
> <el-button v-bind="$attrs" v-on="$listeners">添加</el-button>
> <!-- v-on="$listeners":
>           相当于 @click="$emit('click')"  @dblclick="$emit('dblclick')" @el-button="$emit('el-button')"-->
> <script>
> 	export default {
> 		name: '',
> 		props: ['title'],
> 		mounted() {
> 			//this.$attrs:可以获取到父亲传递的数据【props】
> 			//this.$attrs是可以获取父亲传递的props数据，如果子组件通过
> 			//props:[],接受，this.$attrs属性是获取不到的
> 			console.log(this.$attrs);
> 			console.log(this.$listeners); //{click: ƒ, dblclick: ƒ, el-button: ƒ}
> 		},
> 	};
> </script>
> 
> ```
>
> 可以通过 `v-on="$listeners"` 传入子组件——在创建更高层次的组件时非常有用



## 3、全局事件总线$bus（GlobalEventBus）

1. 一种组件间通信的方式，适用于<span style="color:red">任意组件间通信</span>。

2. 安装全局事件总线：

   ```js
   new Vue({
   	......
   	beforeCreate() {
   		Vue.prototype.$bus = this //安装全局事件总线，$bus就是当前应用的vm
   	},
       ......
   })
   ```

3. 使用事件总线：

   1. 接收数据：A 组件想接收数据，则在 A 组件中给$bus 绑定自定义事件，事件的<span style="color:red">回调留在 A 组件自身。</span>

      ```js
      methods(){
        demo(data){......}
      }
      ......
      mounted() {
        this.$bus.$on('xxxx',this.demo)
      }
      ```

   2. 提供数据：`this.$bus.$emit('xxxx',数据)`

4. 最好在 beforeDestroy 钩子中，用$off 去解绑<span style="color:red">当前组件所用到的</span>事件。



## 4、消息订阅与发布（pubsub）

`在Vue框架里面用得少，因为完全可以用事件总线代替还不用考虑this指向问题`

1. 一种组件间通信的方式，适用于<span style="color:red">任意组件间通信</span>。

2. 使用步骤：

   1. 安装 pubsub：`npm i pubsub-js`

   2. 引入: `import pubsub from 'pubsub-js'`

   3. 接收数据：A 组件想接收数据，则在 A 组件中订阅消息，订阅的<span style="color:red">回调留在 A 组件自身。</span>

      ```js
      methods(){
        demo(data){......}
      }
      ......
      mounted() {
        this.pid = pubsub.subscribe('xxx',this.demo) //订阅消息
      }
      ```

   4. 提供数据：`pubsub.publish('xxx',数据)`

   5. 最好在 beforeDestroy 钩子中，用`PubSub.unsubscribe(pid)`去<span style="color:red">取消订阅。</span>



## 5、Vuex

### 1.概念

 在 Vue 中实现集中式状态（数据）管理的一个 Vue 插件，对 vue 应用中多个组件的共享状态进行集中式的管理（读/写），也是一种组件间通信的方式，且适用于任意组件间通信。

### 2.何时使用？

 多个组件需要共享数据时







## 6、插槽slot--父子通信【结构】

插槽也是可以用来传数据的
子组件 HintButton

```js
<template>
  <div>
    <slot  :item1="{'a':1,'b':2}" item2="asd1">e了吗</slot>
  </div>
</template>
```

父组件

```js
<template>
  <div>
    <HintButton title="提示" icon="el-icon-delete" type="danger" @click="handler">
      <template v-slot:default="slopProps" >
        <p>{{slopProps}}</p>
        <p>{{slopProps.item1}}</p>
        <p v-for="(item,index) in slopProps.item1">{{index}}----{{item}}</p>
      </template>
    </HintButton>
  </div>
</template>
```

**插槽的原理就是在子组件（HintButton）内定义一个 slot（插槽），父组件可以向该插槽内插入数据。**
父组件向子组件传递信息还是通过 props 传递，这里就不多做赘述。
子组件想父组件传递信息时可以通过插槽传递。



> （1）在子组件 HintButton 的 slot 内绑定要传递的数据。绑定在 `<slot>` 元素上的 attribute 被称为**插槽 prop**
>
> （2） 父组件通过 v-slot:default="slotProps"可以接收到全部的信息。

箭头所指内容就是子组件通过插槽传递给父组件的信息。接受的数据是键值对的形式。
![在这里插入图片描述](https://img-blog.csdnimg.cn/c22b1de529b74548873f10399807d86c.png)

[插槽官方链接](https://v2.cn.vuejs.org/v2/guide/components-slots.html#%E4%BD%9C%E7%94%A8%E5%9F%9F%E6%8F%92%E6%A7%BD)



## 9、ref 使用

我们可以通过 ref 获取组件的信息，并且可以写该组件的信息：
例如：**父组件想要获取子组件的信息或者修改子组件的数据**，就可以通过 ref 获取。

**使用步骤**：

> （1）在被操作的标签定义 ref="name"
> （2）在父组件可以通过 this.$refs.name 获取标签的全部信息，也可以进行数据的修改。

[ref 使用参考链接](https://www.cnblogs.com/xumqfaith/p/7743387.html)

## 10、\$ children ​\$parent 使用(尽量不要使用，了解就行)

> 在 56 小节中讲到，如果我们父组件想要获取修改子组件信息，可以通过 ref 实现。但是，当子组件较多时，就会出现多次的$refs 操作，会十分的麻烦。所以，引入了 children 属性。

**\$children 属性**
每个组件都有 \$children 属性，可以通过 this.$ children 操作，该属性会返回当前组件的所有子组件信息，接下来就可以实现子组件信息的获取和修改。

> 当前实例的直接子组件。**需要注意 `$children` 并不保证顺序，也不是响应式的。**如果你发现自己正在尝试使用 `$children` 来进行数据绑定，考虑使用一个数组配合 `v-for` 来生成子组件，并且使用 Array 作为真正的来源。

**\$parent 属性**
了解了 \$children 属性，那么 \$parent 也比较好理解。子组件可以通过 \$parent 属性获取父组件的全部信息，同样也可以修改父组件的信息。

**例题**：想要通过点击子组件，使得父组件的 money 变量减 100。

> 不使用 parents：子组件通过之前常用的自定事件来通知父组件修改 money，然后父组件 money 执行减操作。
> 使用 parents：子组件直接通过 this.$parent 属性获取父组件，然后在子组件内部对 money 执行减操作。





## 
