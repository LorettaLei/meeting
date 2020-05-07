<template>
  <div id="app">
    <!-- <div v-if="$route.path==='/'||$route.path==='/user'||$route.path==='/history'"> -->
    <div v-if="isLogin">
      <router-view/>
      <Tabbar :column-num="3" v-model="active">
        <TabbarItem icon="home-o" @click="$router.push('/')">预定中心</TabbarItem>
        <TabbarItem icon="label-o" @click="$router.push('/history')">历史记录</TabbarItem>
        <!-- <TabbarItem icon="user-circle-o" @click="$router.push('/user')">个人中心</TabbarItem> -->
      </Tabbar>
    </div>
    <div v-else>
    </div>
  </div>
</template>
<script>
import { Tabbar,TabbarItem } from 'vant'
import action from './store/action';
export default {
  components: { Tabbar,TabbarItem},
  data(){
    return{
      active: 0,
      isLogin: false
    }
  },
  created(){
    this.active = this.$route.path==='/' ? 0 : 2;
    let code = this.base_getUrl('code');
    this.$store.dispatch('login',{
      code: code
    }).then(()=>{
      this.isLogin = true;
      this.$router.push('/')
    })
    this.initWxsdk();
  },
  methods:{
    initWxsdk(){
      let timestamp = +new Date();
      let data = {
        beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: '1234567890', // 必填，企业微信的corpID
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: this.base_randomWord(false,16), // 必填，生成签名的随机串
        signature: '',// 必填，签名，见 附录-JS-SDK使用权限签名算法
        jsApiList: [
          'openUserProfile'
        ] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
      }
      action.getToken({
        timestamp: timestamp,
        noncestr: data.nonceStr
      }).then(d=>{
        if(d.status==200){
          data.signature = d.result;
          window.wx.config(data);
        }
      })
    },
    base_getUrl(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    base_randomWord(randomFlag, min, max) {
      var str = "",
          pos,
          range = min,
          arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      // 随机产生
      if (randomFlag) {
          range = Math.round(Math.random() * (max - min)) + min;
      }
      for (var i = 0; i < range; i++) {
          pos = Math.round(Math.random() * (arr.length - 1));
          str += arr[pos];
      }
      return str;
    }
  }
}
</script>

<style lang="scss">
html,body,#app{
  background: #f4f4f4;
}
#app{
  overflow-y: auto;
}
</style>