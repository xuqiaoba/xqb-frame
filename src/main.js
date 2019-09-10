import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from './http'
import utils from './utils.js';

Vue.use(ElementUI);

Vue.prototype.$axios = axios
Vue.prototype.$utils = utils

Vue.config.productionTip = false


//界面刷新前，将store里面的数据暂存在localStorage里面
window.addEventListener('beforeunload', ()=>{
  localStorage.setItem('store',JSON.stringify(store.state));
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
