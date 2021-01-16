import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import VueScreenSize from 'vue-screen-size'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.config.productionTip = false
Vue.use(ElementUI, {locale})
Vue.use(VueScreenSize)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

new Vue({
  render: h => h(App),
}).$mount('#app')
