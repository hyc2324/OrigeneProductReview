<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.id" placeholder="Product ID"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="searchProduct">Search</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="products" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="id" label="ID" width="100" sortable>
			</el-table-column>
			<el-table-column prop="sku" label="SKU" width="100" sortable>
			</el-table-column>
			<el-table-column prop="rate" label="Rate" width="90" sortable>
			</el-table-column>
			<el-table-column prop="date" label="Date" width="120" sortable>
			</el-table-column>
			<el-table-column prop="description" label="Description" min-width="180" sortable>
			</el-table-column>
			<el-table-column label="Operation" width="190">
				<template slot-scope="scope">
					<el-button type="success" size="small" @click="handleApprove(scope.$index, scope.row)" :loading="approveLoading">Approve</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="success" @click="handleBatchApprove" :disabled="this.sels.length===0" :loading="approveLoading">All Approve</el-button>
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">All Delete</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'

	export default {
		data() {
			return {
				filters: {
					id: ''
				},
				products: [],
				total: 0,
				page: 1,
				listLoading: false,
				approveLoading: false,
				sels: []//列表选中列
			}
		},
		methods: {
			//选择页面
			handleCurrentChange(val) {
				this.page = val;
				this.getProduct();
			},
			//获取用户列表
			getProduct() {
				this.listLoading = true;
				const Products = [];
				axios
				  .get('https://18.219.121.53:8080/product/review/list/all')
				  .then(function(info){
				    for(let i = 0; i < info.data.length; i++){
							if(info.data[i].status != 2){
								continue;
							}
				      Products.push({
				        number: i,
				        id: info.data[i].id,
				        sku: info.data[i].sku,
				        rate: info.data[i].rating,
				        date: info.data[i].dateUpdated,
				        description: info.data[i].description,
				        status: info.data[i].status
				      });
				    }
				  })
				  .catch(function (error) { // 请求失败处理
				    console.log(error);
				  });
					this.products = Products;
					this.listLoading = false;
					//NProgress.done();
			},

			//Search
			searchProduct() {
				let id = this.filters.id;
				this.listLoading = true;
				const Products = [];
				axios
				  .get('https://18.219.121.53:8080/product/review/list/all')
				  .then(function(info){
				    for(let i = 0; i < info.data.length; i++){
							if(id != info.data[i].id || info.data[i].status != 2){
								continue;
							}
				      Products.push({
				        number: i,
				        id: info.data[i].id,
				        sku: info.data[i].sku,
				        rate: info.data[i].rating,
				        date: info.data[i].dateUpdated,
				        description: info.data[i].description,
				        status: info.data[i].status
				      });
				    }
				  })
				  .catch(function (error) { // 请求失败处理
				    console.log(error);
				  });
					this.products = Products;
					this.listLoading = false;
					//NProgress.done();
			},


			//Approve
			handleApprove: function (index, row) {
				this.$confirm('Are you sure to approve this comment?', 'Warning', {
					type: 'warning'
				}).then(() => {
					this.approveLoading = true;
					//NProgress.start();
					var url='https://18.219.121.53:8080/product/review/approve/' + row.id;
					axios.put(url).then((res) => {
						this.approveLoading = false;
						//NProgress.done();
						this.$message({
							message: 'Approve success',
							type: 'success'
						});
						this.getProduct();
					});
				}).catch(() => {

				});
			},

			//选中
			selsChange: function (sels) {
				this.sels = sels;
			},



			//batchApprove
			handleBatchApprove: function () {
				let ids = this.sels.map(item => item.id);
				this.$confirm('Are you sure to approve these comments？', 'Warning', {
					type: 'warning'
				}).then(() => {
					for(let i = 0; i < ids.length; i++){
						this.approveLoading = true;
						//NProgress.start();
						var url='https://18.219.121.53:8080/product/review/approve/' + ids[i];
						axios.put(url).then((res) => {
							this.approveLoading = false;
							//NProgress.done();
							this.getProduct();
					}).catch(function (error) { // 请求失败处理
						console.log(error);
					});
				}

				this.$message({
					message: 'Approve success',
					type: 'success'
				});
				}).catch(() => {
				});
			},


			//删除
			handleDel: function (index, row) {
				this.$confirm('Are you sure to delete this comment?', 'Warning', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { number: row.number};
					removeProduct(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: 'Delete success',
							type: 'success'
						});
						this.getProduct();
					});
				}).catch(() => {

				});
			},

			//批量删除
			batchRemove: function () {
				var numbers = this.sels.map(item => item.number).toString();
				this.$confirm('Are you sure to delete these comments？', 'Warning', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { numbers: numbers };
					batchRemoveProduct(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: 'Delete success',
							type: 'success'
						});
						this.getProduct();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getProduct();
		}
	}

</script>

<style scoped>

</style>
