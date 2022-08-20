<template>
	<!-- 利用事件的委派，绑定分页按钮的点击事件 -->
	<div class="pagination" @click="sendPageNo">
		<button :disabled="pageNo == 1">上一页</button>
		<button
			v-if="startPageAndEndPage.startPage > 1"
			:class="{ active: pageNo == 1 }"
		>
			1
		</button>
		<button v-if="startPageAndEndPage.startPage > 2" disabled>···</button>

		<button
			v-for="page in showContinuesPage"
			:key="page"
			:class="{ active: pageNo == page }"
		>
			{{ page }}
		</button>

		<button v-if="startPageAndEndPage.endPage < totalPage - 1" disabled>
			···
		</button>
		<button
			v-if="startPageAndEndPage.endPage < totalPage"
			:class="{ active: pageNo == totalPage }"
		>
			{{ totalPage }}
		</button>
		<button :disabled="pageNo == totalPage">下一页</button>

		<button style="margin-left: 30px" disabled>共 {{ total }} 条</button>
	</div>
</template>

<script>
	export default {
		name: 'Pagination',
		props: ['pageNo', 'pageSize', 'total', 'continues'],
		computed: {
			//计算总页数
			totalPage() {
				//向上取整
				return Math.ceil(this.total / this.pageSize);
			},
			// 计算连续页的起始页和终止页
			startPageAndEndPage() {
				//初始化连续页的起始页和终止页
				let startPage = 1,
					endPage = 1;
				//解构this中的页数相关的属性，不用之后写this.xxx
				const { pageNo, totalPage, continues } = this;
				//当总页数少于连续页数，起始页为1，终止页为总页数
				if (continues >= totalPage) {
					endPage = totalPage;
				} else {
					startPage = pageNo - Math.floor(continues / 2);
					endPage = pageNo + Math.floor(continues / 2);
				}
				//有可能出现起始页小于1,或者终止页大于总页数
				if (startPage < 1) {
					startPage = 1;
					endPage = continues;
				} else if (endPage > totalPage) {
					startPage = totalPage - continues + 1;
					endPage = totalPage;
				}
				//返回计算出来的连续页的起始页和终止页
				return { startPage, endPage };
			},
			//计算连续显示那些页数
			showContinuesPage() {
				const pageArr = [];
				for (
					let index = this.startPageAndEndPage.startPage;
					index <= this.startPageAndEndPage.endPage;
					index++
				) {
					pageArr.push(index);
				}
				return pageArr;
			},
		},
		methods: {
			sendPageNo(event) {
				// console.dir(event.target);
				let page_no = this.pageNo;
				//如果点击的是button，则触发自定义事件并且将按钮的内容传过去
				if (event.target.tagName === 'BUTTON') {
					// 点击上下一页，就将pageNo -/+ 1传过去
					if (event.target.innerText === '上一页') {
						page_no -= 1;
					} else if (event.target.innerText === '下一页') {
						page_no += 1;
					} else {
						page_no = Number.parseInt(event.target.innerText);
					}
					this.$emit('getPageNo', page_no);
				}
			},
		},
	};
</script>

<style lang="less" scoped>
	.pagination {
		text-align: center;
		button {
			margin: 0 5px;
			background-color: #f4f4f5;
			color: #606266;
			outline: none;
			border-radius: 2px;
			padding: 0 4px;
			vertical-align: top;
			display: inline-block;
			font-size: 13px;
			min-width: 35.5px;
			height: 28px;
			line-height: 28px;
			cursor: pointer;
			box-sizing: border-box;
			text-align: center;
			border: 0;

			&[disabled] {
				color: #c0c4cc;
				cursor: not-allowed;
			}

			&.active {
				cursor: not-allowed;
				background-color: #409eff;
				color: #fff;
			}
		}
	}
</style>
