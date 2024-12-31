<template>
  <div class="flex flex-wrap gap-5">
    <div v-if="data" v-for="item in data" :key="item.id" class="relative">
      <img :src="item.image" alt="image" class="w-40 h-36 object-cover rounded-md" />
      <div class="absolute bottom-12 left-[120px]">
        <button
          @click="copyToClipboard(item.image)"
          class="bg-blue-600 rounded-md p-2 hover:bg-blue-500"
        >
          <i class="pi pi-copy" style="font-size: 1rem"></i>
        </button>
      </div>
      <DeleteAttachment :attachmentId="item.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/utils/api'
import { useRoute } from 'vue-router'
import DeleteAttachment from './DeleteAttachment.vue'
import { useQuery } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const route = useRoute()

const fetchAttachments = async () => {
  try {
    const response = await api.get(
      `/attachments/filterPost/${route.params.id || localStorage.getItem('post_id')}`,
    )
    return response.data.data
  } catch (error) {
    console.log(error)
  }
}

const { data, isPending, refetch } = useQuery({
  queryKey: ['attachments'],
  queryFn: fetchAttachments,
  staleTime: 1000,
})

const copyToClipboard = async (link: string) => {
  try {
    await navigator.clipboard.writeText(link)
    toast.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Link berhasil disalin',
      life: 3000,
    })
  } catch (error) {
    console.error('Error copying text: ', error)
  }
}
</script>
