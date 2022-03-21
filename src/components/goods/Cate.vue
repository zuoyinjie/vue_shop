<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-button type="primary" @click='showAddCateDialog'>添加分类</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 使用插件的商品分类表格区域 -->
    <tree-table :data='cateList' :columns='columns' :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
      <!-- 是否有效的作用域插槽 -->
      <template v-slot:isOk='isOkInfo'>
        <i v-if="isOkInfo.row.cat_deleted" class="el-icon-error" style='color:red'></i>
        <i v-else class="el-icon-success" style='color:green'></i>
      </template>
      <!-- 分类等级的作用域插槽 -->
      <template v-slot:cateLevel='levelInfo'>
        <el-tag type="success" v-if="levelInfo.row.cat_level===0" size='mini'>一级标签</el-tag>
        <el-tag type="warning" v-else-if="levelInfo.row.cat_level===1" size='mini'>二级标签</el-tag>
        <el-tag type="danger" v-else size='mini'>三级标签</el-tag>
      </template>
      <!-- 操作的作用域插槽 -->
      <template v-slot:operation='operate'>
        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
      </template>
    </tree-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="cateQueryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="cateQueryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close='addCateClose'>
      <!-- 表单区域 -->
      <el-form :model="addCateForm" :rules="addCaterules" ref="addCateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- 级联选择器区域 -->
        <el-form-item label="父级分类">
          <el-cascader v-model="selectKeys" :options="parentCateList" :props="{ expandTrigger: 'hover' ,value:'cat_id',label:'cat_name',children:'children',checkStrictly:'true'}" @change="handleChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 尾部取消确定按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data: function () {
    return {
      cateQueryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      cateList: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          // 自定义插槽
          type: 'template',
          template: 'isOk'
        },
        {
          label: '分类等级',
          prop: 'cat_level',
          // 自定义插槽
          type: 'template',
          template: 'cateLevel'
        },
        {
          label: '操作',
          // 自定义插槽
          type: 'template',
          template: 'operation'
        }
      ],
      //   添加分类对话框
      addCateDialogVisible: false,
      //  添加分类的携带参数
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      //   添加分类表单验证规则
      addCaterules: {},
      //   父级分类列表
      parentCateList: [],
      //   选择的父级类别id列表
      selectKeys: []
    }
  },
  methods: {
    getGoodsCateList: async function () {
      const { data: res } = await this.$http.get('/categories', { params: this.cateQueryInfo })
      this.cateList = res.data.result
      this.total = res.data.total
      //   console.log(this.total)
      //   console.log(this.cateList)
    },
    // 分页大小
    handleSizeChange: function (newSize) {
      this.cateQueryInfo.pagesize = newSize
      this.getGoodsCateList()
    },
    handleCurrentChange: function (newPage) {
      this.cateQueryInfo.pagenum = newPage
      this.getGoodsCateList()
    },
    // 显示添加分类对话框
    showAddCateDialog: function () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类列表
    getParentCateList: async function () {
      const { data: res } = await this.$http.get('/categories', { params: { type: 2 } })
      //   console.log(res.data)
      this.parentCateList = res.data
    },
    // 分类改变事件
    handleChange: function () {
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addCateForm.cat_level = this.selectKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
      //   console.log(this.selectKeys)
    },
    // 添加分类确定
    addCate: function () {
      this.$refs.addCateForm.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('categories', this.addCateForm)
          if (res.meta.status !== 201) {
            this.$message.error('添加分类失败')
          }
          this.$message.success('添加分类成功')
          this.getGoodsCateList()
        } else {
          this.$message.error('添加分类失败')
        }
      })
      //   console.log(this.addCateForm)
      this.addCateDialogVisible = false
    },
    // 添加分类对话框关闭事件
    addCateClose: function () {
      this.$refs.addCateForm.resetFields()
      // 清空数据
      this.selectKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  },
  created() {
    this.getGoodsCateList()
  }
}
</script>

<style lang='less' scoped>
.el-row {
  margin-bottom: 20px;
}
.el-cascader {
  width: 100%;
}
</style>