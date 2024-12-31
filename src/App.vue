<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/ui/NavbarView.vue'
</script>

<template>
  <header>
    <Navbar />
  </header>

  <main>
    <div class="container">
      <RouterView />
    </div>
  </main>

  <footer>
    <div class="flex justify-center">
      <p class="text-center text-gray-400 pb-5">Copyright @2024 Mufid Blog</p>
    </div>
  </footer>
  <Toast position="bottom-right" />
</template>
