import Vue from 'vue';
import App from './App.vue';
import router from './router/router.js';
import VueAxios from 'vue-axios';
import axios from 'axios';
Vue.use(VueAxios, axios);

new Vue({
   router,
  el: '#app',
  template: '<App/>',
  components: { App }
})