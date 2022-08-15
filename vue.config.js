const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
	transpileDependencies: true,
	// 关闭eslint代码保存校验
	lintOnSave: false,
	//开启代理服务器解决跨域问题
	devServer: {
		proxy: {
			// 当请求的前缀是/api，直接转发请求到服务器5500端口
			'/api': {
				target: 'http://gmall-h5-api.atguigu.cn',
			},
		},
	},
});
