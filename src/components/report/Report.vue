<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 为echarts指定区域 -->
      <div id="main" style="width: 1000px;height:600px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data: function () {
    return {
      // 要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {},
  created() {},
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    // 指定图表的配置项和数据
    const { data: res } = await this.$http.get('reports/type/1')
    console.log(res.data)

    // 使用刚指定的配置项和数据显示图表。
    const option = { ...this.options, ...res.data }
    myChart.setOption(option)
  }
}
</script>

<style lang='less' scoped>
</style>