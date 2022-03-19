<template>
  <el-container class='home_container'>
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="danger" @click='logout'>退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="collapse? '64px':'200px'">
        <!-- 隐藏侧边栏 -->
        <div class='toggle-Collapse' @click='toggleCollapse'>|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened :collapse-transition=false :collapse='collapse'>
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key='item.id'>
            <template slot="title">
              <i :class="font[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-submenu :index="subitem.path + ''" v-for="subitem in item.children" :key="subitem.id">
              <template slot="title">
                <!-- 给每个子选项添加路由 -->
                <router-link :to='subitem.path'>
                  <i class="el-icon-menu"></i>
                  <span>
                    {{subitem.authName}}
                  </span>
                </router-link>
              </template>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主页 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data: function () {
    return {
      menuList: [],
      font: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-tools',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data'
      },
      collapse: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout: function () {
      window.sessionStorage.clear()
      this.$message.success('退出成功')
      this.$router.push('login')
    },
    getMenuList: async function () {
      const { data: res } = await this.$http.get('/menus')
      this.menuList = res.data
      console.log(this.menuList)
    },
    toggleCollapse: function () {
      this.collapse = !this.collapse
    }
  }
}
</script>

<style lang='less' scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    span {
      color: #fff;
      font-size: 20px;
      margin-left: 20px;
    }
    img {
      height: 50px;
      width: 50px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.home_container {
  height: 100%;
}
.toggle-Collapse {
  background-color: #405a64;
  font-size: 10px;
  letter-spacing: 5px;
  font-weight: 700;
  text-align: center;
  color: #fff;
  cursor: pointer;
  line-height: 24px;
}
.el-menu {
  border: 0px;
}
// 修改router-link的样式
a {
  text-decoration: none;
  color: #fff;
}
.router-link-active {
  text-decoration: none;
  color: #fff;
}
</style>