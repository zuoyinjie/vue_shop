<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 警告区域 -->
      <el-alert title="请添加商品信息" type="info" center show-icon :closable='false'>
      </el-alert>
      <!-- 进度条区域 -->
      <el-steps :space="200" :active="activeSign-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 侧边导航兰 -->
      <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px" label-position='top'>
        <el-tabs v-model="activeSign" tab-position='left' :before-leave='beforeLeaveTag' @tab-click='tabClick'>
          <el-tab-pane label="基本信息" name='0'>
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type='number'></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type='number'></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type='number'></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name='1'>
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key='item.attr_id'>
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item1" v-for="(item1,i) in item.attr_vals" :key='i' border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name='2'>
            <el-form-item :label='item.attr_name' v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name='3'>
            <el-upload class="upload-demo" action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers='uploadHeader' :on-success='handleSuccess'>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name='4'>
            <!-- 富文本编辑器 -->
            <quill-editor ref="myQuillEditor" v-model="addForm.goods_introduce" />
            <el-button type="primary" @click='addGoods'>添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="picDialogVisible" width="50%">
      <img :src="picUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      // 步骤栏标识符串联了侧边导航栏
      activeSign: 0,
      //添加的商品信息表
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      //分类菜单
      cateList: [],
      //动态参数表格
      manyTableData: [],
      //静态属性表格
      onlyTableData: [],
      //由于upload用的不是axios来上传 所以axios拦截器并不会在这个请求的头部加上token 所以要手动给头部写上token
      uploadHeader: {
        Authorization: window.sessionStorage.getItem('token')
      },
      //图片预览对话框标识符
      picDialogVisible: false,
      //预览图片路径
      picUrl: '',
      //添加的商品信息表验证表
      addRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      }
    }
  },
  methods: {
    //获取分类
    getCateList: async function () {
      const { data: res } = await this.$http.get('/categories')
      this.cateList = res.data
    },
    //级联选择器状态改变
    handleChange: function () {
      console.log(this.addForm.goods_cat)
    },
    //离开标签页一时先判断是否选择了商品分类因为后几页都需要分类才能实现 其他的表单如果每没填可以在最后进行预验证
    beforeLeaveTag: function (newActiveName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    tabClick: async function () {
      // 如果是商品参数页面则获取商品动态参数
      if (this.activeSign === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数失败')
        }
        res.data.forEach(item => {
          item.attr_vals ? (item.attr_vals = item.attr_vals.split(',')) : []
        })
        this.manyTableData = res.data
        console.log(this.manyTableData)
      } else if (this.activeSign === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数失败')
        }
        this.onlyTableData = res.data
      }
    },
    //图像预览事件
    handlePreview: function (file) {
      this.picUrl = file.response.data.url
      this.picDialogVisible = true
    },
    //图像移除事件
    handleRemove: function (file) {
      //将pic中的对应图片的临时路径对象删除
      const i = this.addForm.pics.findIndex(item => item.pic === file.response.data.tmp_path)
      //   console.log(i)
      this.addForm.pics.splice(i, 1)
      //   console.log(this.addForm)
    },
    //图像上传成功的事件,吧图像临时路径放进表单中
    handleSuccess: function (response) {
      //   console.log(response)
      const picPath = { pic: response.data.tmp_path }
      this.addForm.pics.push(picPath)
      //   console.log(this.addForm)
    },
    // 添加商品
    addGoods: function () {
      //预验证
      this.$refs.addForm.validate(async valid => {
        if (!valid) {
          return this.$message.error('请输入完整的商品信息')
        }
        //对提交的商品数据处理
        // 因为级联选择器双向绑定的是数组 所以直接将分类id改为字符串会出错 腰身拷贝一份addform 最后提交这个深拷贝
        //json方式实现深拷贝
        const form = JSON.parse(JSON.stringify(this.addForm))
        //将分类id改为字符串
        form.goods_cat = form.goods_cat.join(',')
        //处理attrs
        //动态
        this.manyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(',') }
          this.addForm.attrs.push(newInfo)
        })
        //静态
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // console.log(form)
        //发起添加请求
        const { data: res } = await this.$http.post('/goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId: function () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang='less' scoped>
.el-alert {
  margin-bottom: 20px;
}
.el-steps {
  margin-bottom: 20px;
}
/deep/ .el-dialog {
  text-align: center;
}
.el-button {
  margin-top: 15px;
}
</style>