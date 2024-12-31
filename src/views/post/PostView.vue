<template>
  <div>
    <h1>Post</h1>
    <div class="py-4">
      <Button severity="info">
        <RouterLink to="/posts/create">+ Buat Post</RouterLink>
      </Button>
    </div>
  </div>
  <div>
    <div v-if="isPending" class="flex justify-center items-center">
      <i class="pi pi-spin pi-spinner-dotted" style="font-size: 3rem; text-align: center"></i>
    </div>
    <div v-else class="flex flex-wrap gap-4 mx-auto">
      <table class="w-full table-auto">
        <thead>
          <tr>
            <th>No</th>
            <th>Image</th>
            <th>Judul</th>
            <th>Konten</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(post, index) in data" :key="post.id">
            <td class="text-center">{{ index + 1 }}</td>
            <td>
              <img
                alt="user header"
                :src="post.attachment.length > 0 ? post.attachment[0].image : ''"
                class="w-20 h-20 object-cover bg-blue-900"
              />
            </td>
            <td>{{ post.title }}</td>
            <td><div class="m-0" v-html="truncateHTML(post.content, 50)"></div></td>
            <td class="items-center">
              <div class="w-full">
                <Button
                  @click="goToUrl({ name: 'post-detail', slug: post.title, id: post.id })"
                  label="Lihat"
                  severity="contrast"
                  class="w-auto !rounded-full"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/utils/api'
import { useQuery } from '@tanstack/vue-query'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

const fetchPosts = async () => {
  try {
    const response = await api.get('/posts')
    return response.data.data
  } catch (error) {
    console.log(error)
  }
}

const { isPending, isError, data } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
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
    // ID disembunyikan di query parameter
    query: { id: post.id },
  })
}
</script>
