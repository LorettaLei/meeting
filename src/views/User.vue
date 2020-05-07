<template>
  <div class="user">
    <div class="user-title">
      <div class="user-title-avatar">
        <img :src="userInfo.avatar" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed:{
    userInfo(){
      return this.$store.state.userInfo||{}
    }
  }
}
</script>
<style lang="scss" scoped>
.user{
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 50px;
  &-title{
    padding: 20px 0;
    &-avatar{
      width: 100px;
      height: 100px;
      border-radius: 50px;
      overflow: hidden;
      margin: 0 auto;
    }
  }
}
</style>
