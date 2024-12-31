<script setup lang="ts">
import api from '@/utils/api'
import { useQuery } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'

const router = useRouter()

const fetchPosts = async () => {
  try {
    const response = await api.get('/posts')
    return response.data.data
  } catch (error) {
    console.log(error)
  }
}

const fetchLastestPosts = async () => {
  try {
    const response = await api.get('/postsLastestData')
    return response.data.data
  } catch (error) {
    console.log(error)
  }
}

const { isPending, isError, data } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
})

const {
  isPending: isPendingLastest,
  isError: isErrorLastest,
  data: dataLastest,
} = useQuery({
  queryKey: ['lastestPosts'],
  queryFn: fetchLastestPosts,
})

/// Fungsi truncate HTML secara manual
function truncateHTML(html: string, maxLength: number): string {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  // Ambil teks dari HTML yang diproses
  const textContent = tempDiv.innerText

  // Potong teks berdasarkan panjang maksimum
  let truncatedText = textContent.substring(0, maxLength)

  // Tambahkan ellipsis jika panjang teks lebih besar dari batas
  if (textContent.length > maxLength) {
    truncatedText += '...'
  }

  return truncatedText
}

function formatDate(date: string | Date): string {
  const validDate = typeof date === 'string' ? new Date(date) : date

  if (isNaN(validDate.getTime())) {
    throw new TypeError('Invalid date value')
  }

  const day = validDate.getDate() // Hari
  const month = validDate.toLocaleString('default', { month: 'long' }) // Nama bulan
  const year = validDate.getFullYear() // Tahun

  return `${day} ${month} ${year}`
}

const goToUrl = (post: any) => {
  router.push({
    name: post.name,
    // Slug ditampilkan di URL
    params: { slug: post.slug },
  })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1>Postingan Terbaru</h1>
    </div>
    <div v-if="isPendingLastest" class="flex justify-center items-center min-h-[70vh]">
      <i class="pi pi-spin pi-spinner-dotted" style="font-size: 3rem; text-align: center"></i>
    </div>
    <div v-else-if="isErrorLastest" class="flex justify-center items-center">
      <h2>{{ isErrorLastest }}</h2>
    </div>
    <div v-else class="grid xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mx-auto">
      <div v-for="post in dataLastest" :key="post.id">
        <div @click="goToUrl({ name: 'detail_post', slug: post.title })" class="cursor-pointer">
          <Card
            style="
              width: 22rem;
              overflow: hidden;
              height: 24rem;
              background-color: #1e1f21;
              border-width: 1px;
              border-color: #1e1f21;
            "
          >
            <template #header>
              <div class="relative">
                <img
                  alt="user header"
                  :src="post.attachment.length > 0 ? post.attachment[0].image : ''"
                  class="w-full h-52 object-cover bg-blue-900"
                />
                <div v-if="post.attachment.length == 0" class="absolute bottom-20 left-28">
                  <p>Tidak ada gambar</p>
                </div>
              </div>
            </template>
            <template #title>
              <div>
                <h2 class="truncate font-normal">
                  {{ post.title }}
                </h2>
              </div>
            </template>
            <template #content>
              <div class="my-2" v-html="truncateHTML(post.content, 70)"></div>
            </template>
            <template #footer>
              <div class="flex justify-end">
                <p class="text-xs text-gray-300">
                  {{ formatDate(post.created_at) }}
                </p>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <h1>Semua Postingan</h1>
    </div>
    <div v-if="isPending" class="flex justify-center items-center min-h-[70vh]">
      <i class="pi pi-spin pi-spinner-dotted" style="font-size: 3rem; text-align: center"></i>
    </div>
    <div v-else-if="isError" class="flex justify-center items-center">
      <h2>{{ isError }}</h2>
    </div>
    <div v-else class="grid xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mx-auto">
      <div v-for="post in data" :key="post.id">
        <div @click="goToUrl({ name: 'detail_post', slug: post.title })" class="cursor-pointer">
          <Card
            style="
              width: 22rem;
              overflow: hidden;
              height: 24rem;
              background-color: #1e1f21;
              border-width: 1px;
              border-color: #1e1f21;
            "
          >
            <template #header>
              <div class="relative">
                <img
                  alt="user header"
                  :src="post.attachment.length > 0 ? post.attachment[0].image : ''"
                  class="w-full h-52 object-cover bg-blue-900"
                />
                <div v-if="post.attachment.length == 0" class="absolute bottom-20 left-28">
                  <p>Tidak ada gambar</p>
                </div>
              </div>
            </template>
            <template #title>
              <div>
                <h2 class="truncate font-normal">
                  {{ post.title }}
                </h2>
              </div>
            </template>
            <template #content>
              <div class="my-2" v-html="truncateHTML(post.content, 70)"></div>
            </template>
            <template #footer>
              <p class="text-xs text-gray-300">
                {{ formatDate(post.created_at) }}
              </p>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
