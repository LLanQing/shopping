const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
	transpileDependencies: true,
	// 关闭eslint代码保存校验
	lintOnSave: false,
});
