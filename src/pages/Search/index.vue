<template>
	<div>
		<h3>{{ $route.params.keyWords }}</h3>
		<h3>{{ $route.query.KW }}</h3>
	</div>
</template>

<script>
export default {
	name: "Search",
};
</script>

<style lang="less" scoped></style>
