import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import tool from './util/tool'
require('./assets/base.css')
Vue.use(tool)
import { Icon} from 'vant'
Vue.use(Icon)
import 'vant/lib/icon/index.css'
import 'vant/lib/tabbar/index.css'
import 'vant/lib/tabbar-item/index.css'
import 'vant/lib/radio/index.css'
import 'vant/lib/dialog/index.css'
import 'vant/lib/button/index.css'
import 'vant/lib/radio-group/index.css'
import Vconsole from 'vconsole';
import { DEVELOP } from './config'
if (DEVELOP) {
  new Vconsole();  
}

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
