import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import './style.css'
import 'primeicons/primeicons.css'
import './assets/code.scss'
import 'highlight.js/styles/github-dark.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import InputText from 'primevue/inputtext'
import Aura from '@primevue/themes/aura'
import { Form } from '@primevue/forms'
import { FormField } from '@primevue/forms'
import Message from 'primevue/message'
import Button from 'primevue/button'
import ToastService from 'primevue/toastservice'
import Password from 'primevue/password'
import { VueQueryPlugin } from '@tanstack/vue-query'
import Select from 'primevue/select'
import Card from 'primevue/card'
import FileUpload from 'primevue/fileupload'
import Toast from 'primevue/toast'
import Breadcrumb from 'primevue/breadcrumb'
import Dialog from 'primevue/dialog'
import Menubar from 'primevue/menubar'
import { useAuthStore } from './stores/authStore'
import axios from 'axios'
import Cookies from 'js-cookie'
import Menu from 'primevue/menu'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('InputText', InputText)
app.component('Form', Form)
app.component('FormField', FormField)
app.component('Message', Message)
app.component('Button', Button)
app.component('Password', Password)
app.component('Select', Select)
app.component('Card', Card)
app.component('FileUpload', FileUpload)
app.component('Toast', Toast)
app.component('Breadcrumb', Breadcrumb)
app.component('Dialog', Dialog)
app.component('Menubar', Menubar)
app.component('Menu', Menu)
app.component('DataTable', DataTable)
app.component('Column', Column)

app.use(ToastService)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(VueQueryPlugin)
app.mount('#app')

const token: any = Cookies.get('x-token')

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

  const authStore = useAuthStore()

  authStore.state.token = token
  authStore.fetchUser()
}
