<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索用户 -->
          <el-input placeholder="请输入内容" v-model="queryUser.query" clearable @clear='getUserList'>
            <el-button slot="append" icon="el-icon-search" @click='getUserList'></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click='addUser'>添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="userList" style="width: 100%" stripe border>
        <el-table-column type="index" label='#'>
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="180">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态" width="180">
          <!-- 插槽的方式获取状态数据 -->
          <template v-slot:default='userdata'>
            <!-- .row是这行的数据 -->
            <!-- {{userdata.row}} -->
            <el-switch v-model="userdata.row.mg_state" @change='stateChange(userdata.row)'>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot:default='userdata'>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click='editUser(userdata.row.id)'></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click='deleteUser(userdata.row.id)'></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable=false>
              <el-button type="warning" icon="el-icon-setting" size="mini" @click='setRole(userdata.row)'></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryUser.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryUser.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="parseInt(total)">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="请输入用户信息" :visible.sync="dialogVisible" width="30%" @close='addDialogClose'>
      <!-- 信息区域 -->
      <el-form ref="addUserFormRef" :model="addUserForm" :rules="rules" label-width="80px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户信息的对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="30%">
      <!-- 信息区域 -->
      <el-form ref="editUserFormRef" :model="editUserForm" :rules="rules" label-width="80px">
        <el-form-item label="用户名称">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserSubmit( editUserForm.id)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoledialogVisible" width="50%">
      <p>当前用户: {{userInfo.username}}</p>
      <p>当前角色: {{userInfo.role_name}}</p>
      <p>要分配的角色:
        <el-select v-model="setRoleId" placeholder="请选择">
          <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data: function () {
    // 自定义校验规则
    var checkEmail = (rule, value, cb) => {
      //验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        //合法的邮箱
        return cb()
      }
      //邮箱不合法
      cb(new Error('请输入合法的邮箱！'))
    }
    //验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        //合法的手机号
        return cb()
      }
      //手机号不合法
      cb(new Error('请输入合法的手机号！'))
    }
    return {
      queryUser: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: '',
      // 添加用户信息
      dialogVisible: false,
      // 编辑用户信息
      editDialogVisible: false,
      editUserForm: {},
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 分配角色
      setRoledialogVisible: false,
      // 分配角色的用户信息
      userInfo: [],
      //角色列表
      roleList: [],
      //角色id
      setRoleId: []
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList: async function () {
      const { data: res } = await this.$http.get('/users', { params: this.queryUser })
      console.log(res)
      if (res.meta.status !== 200) {
        return console.log('获取用户数据失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    stateChange: async function (userdata) {
      const { data: res } = await this.$http.put(`users/${userdata.id}/state/${userdata.mg_state}`)
      if (res.meta.status !== 200) {
        userdata.mg_state = !userdata.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态信息成功')
      this.getUserList()
    },
    handleSizeChange: function (newSize) {
      this.queryUser.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange: function (newNum) {
      this.queryUser.pagenum = newNum
      this.getUserList()
    },
    // 添加用户
    addUser: function () {
      this.dialogVisible = true
    },
    //添加用户对话框关闭
    addDialogClose: function () {
      //resetFields()清除表单数据
      this.$refs.addUserFormRef.resetFields()
    },
    adduser: function () {
      this.$refs.addUserFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('/users', this.addUserForm)
          if (res.meta.status !== 201) {
            this.$message.error('添加用户失败')
          } else {
            this.$message.success('添加用户成功')
            this.getUserList()
          }
        } else {
          this.$message.error('添加用户失败')
        }
      })
      this.dialogVisible = false
    },
    editUser: async function (id) {
      this.editDialogVisible = true
      //获取用户信息
      const { data: res } = await this.$http.get('/users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('修改用户信息失败')
      }
      this.editUserForm = res.data
    },
    editUserSubmit: function (id1) {
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('修改用信息失败')
        } else {
          const { data: res } = await this.$http.put('/users/' + id1, { id: this.editUserForm.id, email: this.editUserForm.email, mobile: this.editUserForm.mobile })
          if (res.meta.status !== 200) {
            return this.$message.error('修改用户信息失败')
          }
          this.$message.success('修改用户信息成功')
          this.getUserList()
          this.editDialogVisible = false
        }
      })
    },
    deleteUser: function (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('/users/' + id)
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('删除用户失败')
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getUserList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    setRole: async function (userInfo) {
      this.userInfo = userInfo
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
      console.log(this.roleList)
      this.setRoledialogVisible = true
    },
    // 提交选择角色
    setRoleSubmit: async function () {
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.setRoleId })
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色失败')
      }
      this.$message.success('分配角色成功')
      this.getUserList()
      this.setRoledialogVisible = false
    }
  }
}
</script>

<style lang='less' scoped>
.el-row {
  margin-bottom: 20px;
}
</style>