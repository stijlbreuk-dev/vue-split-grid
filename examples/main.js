import Vue from 'vue';
import VueSplitGrid from '../src/wrapper';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VueSplitGrid);

new Vue({
  render: h => h(App)
}).$mount('#app');
