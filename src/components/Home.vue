<template>
  <div>
    <el-button type="danger" @click='logout'>退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout: function () {
      window.sessionStorage.clear()
      this.$message.success('退出成功')
      this.$router.push('login')
    }
  }
}
</script>

<style lang='less' scoped>
</style>