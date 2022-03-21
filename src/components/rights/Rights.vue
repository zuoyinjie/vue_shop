<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 表格区域 -->
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type='index' label='#'>
        </el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot:default='rights'>
            <el-tag v-if="rights.row.level==0" type="success">一级权限</el-tag>
            <el-tag v-else-if="rights.row.level==1" type="warning">二级权限</el-tag>
            <el-tag v-else type="danger">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      rightsList: []
    }
  },
  methods: {
    getRightsList: async function () {
      const { data: res } = await this.$http('/rights/list')
      this.rightsList = res.data
    }
  },
  created() {
    this.getRightsList()
  }
}
</script>

<style lang='less' scoped>
</style>