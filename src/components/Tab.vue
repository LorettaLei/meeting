<template>
  <div class="tab">
    <Tabbar :column-num="3" v-model="active">
      <TabbarItem icon="home-o" @click="$router.push('/')">首页</TabbarItem>
      <TabbarItem icon="flag-o" @click.stop="popAddShow=true">会议室预定</TabbarItem>
      <TabbarItem icon="user-circle-o" @click="$router.push('/user')">个人中心</TabbarItem>
    </Tabbar>
    <div></div>
  </div>
</template>
<script>
import { Tabbar,TabbarItem } from 'vant'
export default {
  name: 'Tab',
  components: { Tabbar,TabbarItem },
  data(){
    return{
      active: 0,
      popAddShow: false
    }
  },
  created(){
    this.active = this.$route.path==='/' ? 0 : 2;
  }
}
</script>