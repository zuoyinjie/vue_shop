<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索和添加商品区域 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <div>
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getGoodsList'>
              <el-button slot="append" icon="el-icon-search" @click='getGoodsList'></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click='addGoods'>添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type='index' label='#'>
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width='95px'>
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width='95px'>
        </el-table-column>
        <el-table-column prop="add_time" label="添加日期" width='180px'>
          <template v-slot:default='scope'>
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width='200px'>
          <template v-slot:default='scope'>
            <el-button type="primary" size='mini' icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size='mini' icon="el-icon-delete" @click='deleteGoods(scope.row.goods_id)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="parseInt(total)">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      //获取商品列表的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      //商品总数
      total: 0,
      //商品列表
      goodsList: []
    }
  },
  methods: {
    //获取商品列表
    getGoodsList: async function () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.$message.success('获取商品列表成功')
      //   console.log(res.data)
      this.goodsList = res.data.goods
      this.total = res.data.total
      //   console.log(this.total)
    },
    // 每页个数变化事件
    handleSizeChange: function (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    //切换页码事件
    handleCurrentChange: function (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 删除商品
    deleteGoods: function (id) {
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`goods/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除商品失败')
          }
          this.$message.success('删除商品成功')
          this.getGoodsList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //添加商品
    addGoods: function () {
      this.$router.push('/goods/add')
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin: 20px;
}
</style>