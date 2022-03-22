<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 警告区域 -->
      <el-alert title="注意:只允许为第三级分类设置相关参数" type="warning" show-icon>
      </el-alert>
      <!-- 级联选择器区域 -->
      <el-row>
        <el-col :span="3">
          <span>请选择商品的分类:</span>
        </el-col>
        <el-col :span="15">
          <el-cascader v-model="selectedKeys" :options="cateList" :props="{ expandTrigger: 'hover',value:'cat_id' ,label:'cat_name',children:'children'}" @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页面区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size='mini' :disabled='btnDisable' @click='addAttrDialogVisible=true'>添加参数</el-button>
          <!-- 动态参数表格区域 -->
          <el-table :data="manyTableData" style="width: 100%">
            <el-table-column type='expand'>
              <!-- 参数标签区域 -->
              <template v-slot:default='scope'>
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key='i' closable @close='deleteTag(i,scope.row)'>{{item}}</el-tag>
                <!-- 新建参数标签区域 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type='index' label='#'>
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot:default='scope'>
                <el-button type="primary" icon="el-icon-edit" size='mini' @click='editAttrDialogOpen(scope.row.attr_id)'>编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size='mini' @click='deleteAttr(scope.row.attr_id)'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size='mini' :disabled='btnDisable' @click='addAttrDialogVisible=true'>添加属性</el-button>
          <!-- 静态属性表格区域 -->
          <el-table :data="onlyTableData" style="width: 100%">
            <el-table-column type='expand'>
              <!-- 参数标签区域 -->
              <template v-slot:default='scope'>
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key='i' closable @close='deleteTag(i,scope.row)'>{{item}}</el-tag>
                <!-- 新建参数标签区域 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type='index' label='#'>
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot:default='scope'>
                <el-button type="primary" icon="el-icon-edit" size='mini' @click='editAttrDialogOpen(scope.row.attr_id)'>编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size='mini' @click='deleteAttr(scope.row.attr_id)'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog :title="'添加' + dialogName" :visible.sync="addAttrDialogVisible" width="50%" @close='closeDialog'>
      <!-- 表单区域 -->
      <el-form :model="addAttrForm" :rules="addAttrrules" ref="addAttrRuleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="dialogName" prop="attr_name">
          <el-input v-model="addAttrForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAttrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttr">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数的对话框 -->
    <el-dialog :title="'编辑' + dialogName" :visible.sync="editAttrDialogVisible" width="50%">
      <!-- 表单区域 -->
      <el-form :model="editAttrForm" :rules="editAttrrules" ref="editAttrRuleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="dialogName" prop="attr_name">
          <el-input v-model="editAttrForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAttrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttr">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      cateList: [],
      //  获取分类的id数组
      selectedKeys: [],
      //   标签页面激活名称
      activeName: 'many',
      //参数数据类型
      manyTableData: [],
      onlyTableData: [],
      //对话框显示标识
      addAttrDialogVisible: false,
      //   添加参数
      addAttrForm: {
        attr_name: ''
      },
      //添加参数校验规则
      addAttrrules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      //   编辑参数对话框标识
      editAttrDialogVisible: false,
      //   编辑参数
      editAttrForm: {
        attr_name: ''
      },
      //编辑参数校验规则
      editAttrrules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    getCateList: async function () {
      const { data: res } = await this.$http.get('categories')
      this.cateList = res.data
    },
    handleChange: function () {
      this.getAttribute()
    },
    handleClick: function () {
      this.getAttribute()
    },
    //获取属性函数
    getAttribute: async function () {
      if (this.selectedKeys.length !== 3) {
        this.onlyTableData = []
        this.manyTableData = []
        this.selectedKeys.length = []
      }
      // 发起请求获取动态参数或者静态属性
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      //   console.log(this.selectedKeys)
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      //   将attr_vals分隔成数组
      res.data.forEach(item => {
        item.inputVisible = false
        item.inputValue = ''
        item.attr_vals ? (item.attr_vals = item.attr_vals.split(',')) : (item.attr_vals = [])
      })
      console.log(res.data)
      // 判断是动态还是静态属性
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    closeDialog: function () {
      this.$refs.addAttrRuleForm.resetFields()
    },
    // 点击确定添加属性
    addAttr: function () {
      this.$refs.addAttrRuleForm.validate(async valid => {
        if (!valid) {
          this.$message.error('添加参数失败')
        } else {
          // 提交参数
          const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addAttrForm.attr_name, attr_sel: this.activeName })
          if (res.meta.status !== 201) {
            return this.$message.error('添加参数失败')
          }
          this.$message.success('添加参数成功')
          this.getAttribute()
          this.addAttrDialogVisible = false
        }
      })
    },
    // 编辑属性
    editAttrDialogOpen: async function (attr_id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      //   console.log(res.data)
      this.editAttrForm = res.data
      this.editAttrDialogVisible = true
    },
    // 点击确定编辑属性
    editAttr: function () {
      this.$refs.editAttrRuleForm.validate(async valid => {
        if (!valid) {
          this.$message.error('编辑参数失败')
        } else {
          // 编辑参数
          const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editAttrForm.attr_id}`, { attr_name: this.editAttrForm.attr_name, attr_sel: this.activeName })
          if (res.meta.status !== 200) {
            return this.$message.error('编辑参数失败')
          }
          this.$message.success('编辑参数成功')
          this.getAttribute()
          this.editAttrDialogVisible = false
        }
      })
    },
    //删除参数
    deleteAttr: function (attr_id) {
      this.$confirm('此操作将删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          //删除操作
          const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除参数失败')
          }
          this.$message.success('删除参数成功')
          this.getAttribute()
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
    // 提交新建的参数标签
    handleInputConfirm: async function (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      //   判断输入是否为空 不是则进行下一步处理
      //将新属性添加到属性列表中
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      //   console.log(row.attr_vals)
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(',')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('添加参数失败')
      }
      this.$message.success('添加参数成功')
      row.inputVisible = false
    },
    // 输入框与新建标签的切换
    showInput: function (row) {
      row.inputVisible = true
      //   nextTick作用：在标识置为true时还没有input元素 所以要在他渲染完成后才能获取该dom元素 所以用nextTICK
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除标签
    deleteTag: async function (i, row) {
      row.attr_vals.splice(i, 1)
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(',')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      this.$message.success('删除参数成功')
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    //   按钮禁用标识
    btnDisable: function () {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 获取属性分类id值
    cateId: function () {
      if (this.selectedKeys.length !== 3) {
        return null
      }
      return this.selectedKeys[2]
    },
    // 共用对话框的名称
    dialogName: function () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang='less' scoped>
.el-alert {
  margin: 15px 0;
}
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 10px;
}
.el-input {
  width: 150px;
}
</style>