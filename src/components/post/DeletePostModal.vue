<template>
  <div class="card flex">
    <Button label="Hapus" @click="visible = true" severity="danger" />
    <Dialog v-model:visible="visible" modal header="Konfirmasi Hapus" :style="{ width: '25rem' }">
      <span class="text-surface-300 block mb-8">Apakah anda yakin ingin menghapus post ini?</span>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Batal" severity="secondary" @click="visible = false"></Button>
        <Button
          type="button"
          label="Ya Hapus"
          severity="danger"
          @click="handleDeletePost()"
          :loading="isPending"
        ></Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import api from '@/utils/api'
import { ref } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()
const visible = ref(false)
const props = defineProps({
  post: {
    type: Number,
    required: true,
  },
})

const { isPending, isError, mutate } = useMutation({
  mutationFn: async () => await api.delete(`/posts/${props.post}`),
  onSuccess: () => {
    toast.add({
      severity: 'success',
      summary: 'Success Message',
      detail: 'Post berhasil dihapus',
      life: 3000,
    })
    visible.value = false
    router.push('/posts')
  },
  onError: (error) => {
    toast.add({
      severity: 'error',
      summary: 'Error Message',
      detail: 'Post gagal dihapus',
      life: 3000,
    })
  },
})

function handleDeletePost() {
  mutate()
}
</script>
