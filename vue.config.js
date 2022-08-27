const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
	// 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。你可以启用本选项，以避免构建后的代码中出现未转译的第三方依赖。
	transpileDependencies: true,
	// 关闭eslint代码保存校验
	lintOnSave: false,
	//开启代理服务器解决跨域问题
	devServer: {
		proxy: {
			// 当请求的前缀是/api，直接转发请求到服务器http://gmall-h5-api.atguigu.cn
			'/api': {
				target: 'http://gmall-h5-api.atguigu.cn',
			},
		},
	},
	// 打包生成的js文件是否需要生成source map
	productionSourceMap: false,
});
