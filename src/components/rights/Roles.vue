<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 添加角色区域 -->
      <el-row :gutter="20" style="margin-bottom:10px;">
        <el-col :span="6">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色信息区域 -->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type='expand'>
          <template v-slot:default='roles'>
            <el-row v-for="(item,index) in roles.row.children" :key="item.id" :class="['bd-bottom',index==0?'bd-top':'','vertical-center']">
              <!-- 一级权限 -->
              <el-col :span="6">
                <el-tag closable @close='deleteRights( roles.row,item.id)'>{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="18">
                <el-row v-for="(item1,index1) in item.children" :key="item1.id" :class="[index1===0?'':'bd-top','vertical-center']">
                  <el-col :span="6">
                    <el-tag type='success' closable @close='deleteRights( roles.row,item1.id)'>{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag type='warning' v-for="item2 in item1.children" :key='item2.id' closable @close='deleteRights( roles.row,item2.id)'>{{item2.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type='index' label="#">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>

        <el-table-column label="操作">
          <template v-slot:default='scope'>
            <el-button type="primary" icon="el-icon-edit" size='mini'>编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size='mini'>删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size='mini' @click='editRights(scope.row)'>分配权限</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
    <!-- 操作权限的对话框 -->
    <el-dialog title="修改权限" :visible.sync="editRightDialogVisible" width="50%">
      <!-- 权限区域树形控件 -->
      <el-tree :data="rightsList" :props="rightProps" show-checkbox default-expand-all node-key='id' :default-checked-keys='defaultChooseArr' ref='treeRef'></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRightsSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      rolesList: [],
      editRightDialogVisible: false,
      rightsList: [],
      rightProps: {
        label: 'authName',
        children: 'children'
      },
      defaultChooseArr: [],
      rightsId: [],
      rolesId: []
    }
  },
  methods: {
    getRolesList: async function () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    deleteRights: function (role, rightsId) {
      this.$confirm('是否删除该权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightsId}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除权限失败')
          }
          role.children = res.data
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    editRights: async function (node) {
      this.rolesId = node.id
      this.editRightDialogVisible = true
      const { data: res } = await this.$http.get('rights/tree')
      this.rightsList = res.data
      this.defaultChooseArr = []
      this.defaultKeys(node, this.defaultChooseArr)
    },
    // 递归写入默认选中的节点的id的函数
    defaultKeys: function (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.defaultKeys(item, arr)
      })
    },
    editRightsSubmit: async function () {
      this.rightsId = [...this.$refs.treeRef.getHalfCheckedKeys(), ...this.$refs.treeRef.getCheckedKeys()]
      const idStr = this.rightsId.join(',')
      const { data: res } = await this.$http.post(`roles/${this.rolesId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('角色授权失败')
      }
      this.$message.success('角色授权成功')
      this.getRolesList()
      this.editRightDialogVisible = false
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style lang='less' scoped>
.bd-top {
  border-top: 1px solid #eee;
}
.bd-bottom {
  border-bottom: 1px solid #eee;
}
.vertical-center {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 7px 7px 7px 0;
}
</style>