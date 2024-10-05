import Vue from 'vue'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'

import { required, numeric } from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: 'กรุณากรอกข้อมูล'
})

extend('numeric', {
  ...numeric,
  message: 'กรุณาระบุตัวเลขเท่านั้น'
})

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
