<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <div>
            <el-input placeholder="请输入内容" clearable>
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderList" style="width: 100%" border stripe>

        <el-table-column label="#" type='index'>
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template v-slot:default='scope'>
            <el-tag type="success" v-if="scope.row.pay_status ==1 ">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template v-slot:default='scope'>
            {{scope.row.create_time|dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default='scope'>
            <el-button type="primary" icon="el-icon-edit" size='mini' @click='addressFun'>地址</el-button>
            <el-button type="success" icon="el-icon-location" size='mini' @click='progressFun'>物流</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 地址对话框 -->
    <el-dialog title="选择地址" :visible.sync="addressDialogVisible" width="50%" @close='closeAddressDialog'>
      <el-form :model="address" :rules="addressrules" ref="addressFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省/市/区/县" prop="addname">
          <el-cascader v-model="address.address1" :options="citydata" :props="{ expandTrigger: 'hover' ,label:'label',value:'value',children:'children'}"></el-cascader>
        </el-form-item>
        <el-form-item label="具体地址" prop="addname1">
          <el-input v-model="address.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流对话框 -->
    <el-dialog title="物流信息" :visible.sync="progressDialogVisible" width="30%">
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citydata from './citydata.js'
export default {
  data: function () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      progressInfo: [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }
      ],
      total: 0,
      addressDialogVisible: false,
      progressDialogVisible: false,
      citydata,
      address: {
        address1: [],
        address2: ''
      },
      addressrules: {
        addname: [{ required: true, message: '请输入省市区县', trigger: 'blur' }],
        addname1: [{ required: true, message: '请输入具体地址', trigger: 'blur' }]
      }
    }
  },
  methods: {
    getOrderList: async function () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message.error('获取订单信息失败')
      }
      console.log(res.data)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    //分页大小改变
    handleSizeChange: function (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange: function (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    addressFun: function () {
      this.addressDialogVisible = true
    },
    closeAddressDialog: function () {
      this.$refs.addressFormRef.resetFields()
    },
    progressFun: async function () {
      //   const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      //   if (res.meta.stastus !== 200) {
      //     return this.$message.error('获取物流信息失败')
      //   }
      //   console.log(res.data)
      this.progressDialogVisible = true
    }
  },
  created() {
    this.getOrderList()
  }
}
</script>

<style lang='less' scoped>
.el-cascader {
  width: 100%;
}
</style>