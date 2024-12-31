<template>
  <nav class="w-full flex gap-4 justify-between items-center bg-white/10 px-52">
    <div>
      <h2>Mufid Blog</h2>
    </div>
    <div class="flex gap-4 py-5 items-center">
      <div v-for="(route, index) in routes" :key="index">
        <RouterLink
          v-if="userLogin.user ? route.lock : !route.lock"
          :to="route.path"
          class="hover:bg-slate-800 p-2 rounded-lg text-lg"
          >{{ route.name }}</RouterLink
        >
      </div>
    </div>
    <div v-if="userLogin.user">
      <div class="flex flex-row gap-2 items-center">
        <Button
          type="button"
          icon="pi pi-user"
          @click="toggle"
          aria-haspopup="true"
          aria-controls="overlay_menu"
          class="!rounded-full"
          severity="contrast"
        >
        </Button>
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" class="!list-none" />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const userLogin = authStore.state

const menu = ref()
const items = ref([
  {
    label: `${userLogin.user || JSON.parse(localStorage.getItem('user') || '{}').name}`,
    items: [
      {
        label: 'Profil Saya',
        icon: 'pi pi-id-card',
        command: () => {
          router.push('/edit-profile')
        },
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          authStore.logout()
        },
      },
    ],
  },
])

const toggle = (event: any) => {
  menu.value.toggle(event)
}

const routes = [
  {
    path: '/',
    name: 'Beranda',
  },
  {
    path: '/about',
    name: 'Tentang Saya',
  },
  // {
  //   path: '/register',
  //   name: 'Daftar',
  // },
  {
    path: '/login',
    name: 'Masuk',
  },
  {
    path: '/posts',
    name: 'Posts',
    lock: true,
  },
  {
    path: '/categories',
    name: 'Kategori',
    lock: true,
  },
]
</script>
