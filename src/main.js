
import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import './styles/element-variables.scss'

import Element from 'element-ui'
import enLang from 'element-ui/lib/locale/lang/en'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import './icons'
import './permission'

Vue.use(Element, {
  size: Cookies.get('size') || 'medium',
  locale: enLang
})

// Moment
import VueMoment from 'vue-moment'
import Moment from 'moment-timezone'
require('moment/locale/vi')

Vue.use(VueMoment, {
  moment: Moment.tz.setDefault(Moment.tz.guess())
})

// Vue mask
import VueTheMask from 'vue-the-mask'
import money from 'v-money'
Vue.use(VueTheMask)
Vue.use(money, { precision: 4 })

// Alert
import VueSimpleAlert from 'vue-simple-alert'

Vue.use(VueSimpleAlert)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
