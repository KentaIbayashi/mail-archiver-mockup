import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import VueScreenSize from 'vue-screen-size'


Vue.config.productionTip = false
Vue.use(ElementUI, {locale})
Vue.use(VueScreenSize)

new Vue({
  render: h => h(App),
}).$mount('#app')
