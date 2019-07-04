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
			<el-table-column label="Operation" width="150">
				<template slot-scope="scope">
					<el-button type="danger" size="small" @click="handleDisapprove(scope.$index, scope.row)" :loading="disapproveLoading">Disapprove</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="handleBatchDisapprove" :disabled="this.sels.length===0" :loading="disapproveLoading">All Disapprove</el-button>
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
				disapproveLoading: false,
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
							if(info.data[i].status != 1){
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
			},

			//Search
			searchProduct () {
				let id = this.filters.id;
				this.listLoading = true;
				const Products = [];
				axios
				  .get('https://18.219.121.53:8080/product/review/list/all')
				  .then(function(info){
				    for(let i = 0; i < info.data.length; i++){
							if(id != info.data[i].id || info.data[i].status != 1){
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


			//Dispprove
			handleDisapprove: function (index, row) {
				this.$confirm('Are you sure to disapprove this comment?', 'Warning', {
					type: 'warning'
				}).then(() => {
					this.disapproveLoading = true;
					//NProgress.start();
					var url='https://18.219.121.53:8080/product/review/disapprove/' + row.id;
					axios.put(url).then((res) => {
						this.disapproveLoading = false;
						//NProgress.done();
						this.$message({
							message: 'Disapprove success',
							type: 'success'
						});
						this.getProduct();
					});
				}).catch(() => {

				});
			},


			//batchDisapprove
			handleBatchDisapprove: function () {
				let ids = this.sels.map(item => item.id);
				this.$confirm('Are you sure to disapprove these comments？', 'Warning', {
					type: 'warning'
				}).then(() => {
					for(let i = 0; i < ids.length; i++){
						this.disapproveLoading = true;
						//NProgress.start();
						var url='https://18.219.121.53:8080/product/review/disapprove/' + ids[i];
						axios.put(url).then((res) => {
							this.disapproveLoading = false;
							//NProgress.done();
							this.getProduct();
					}).catch(function (error) { // 请求失败处理
						console.log(error);
					});
				}
				this.$message({
					message: 'Dispprove success',
					type: 'success'
				});
				}).catch(() => {
				});
			},
			//选中
			selsChange: function (sels) {
				this.sels = sels;
			}
		},
		mounted() {
			this.getProduct();
		}
	}

</script>

<style scoped>

</style>
