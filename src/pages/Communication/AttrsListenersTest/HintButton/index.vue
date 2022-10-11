<template>
	<div>
		<a :title="title" @change="alert('change')" @blur="alert('blur')">
			<el-button v-bind="$attrs" v-on="$listeners">添加</el-button>
			<!-- v-on="$listeners":
          相当于 @click="$emit('click')"  @dblclick="$emit('dblclick')" @el-button="$emit('el-button')"-->
		</a>
	</div>
</template>

<script>
	export default {
		name: '',
		props: ['title'],
		mounted() {
			//this.$attrs:可以获取到父亲传递的数据【props】
			//this.$attrs是可以获取父亲传递的props数据，如果子组件通过
			//props:[],接受，this.$attrs属性是获取不到的
			console.log(this.$attrs);
			console.log(this.$listeners); //{click: ƒ, dblclick: ƒ, el-button: ƒ}
		},
	};
</script>

<style scoped></style>
