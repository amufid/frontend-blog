<template>
  <div class="card flex relative">
    <button
      @click="visible = true"
      class="absolute h-5 w-5 p-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xl right-1 bottom-24 hover:bg-red-400 shadow-md"
    >
      <i class="pi pi-trash"></i>
    </button>
    <Dialog v-model:visible="visible" modal header="Konfirmasi Hapus" :style="{ width: '25rem' }">
      <span class="text-surface-300 block mb-8">Apakah anda yakin ingin menghapus gambar ini?</span>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Batal" severity="secondary" @click="visible = false"></Button>
        <Button
          type="button"
          label="Ya Hapus"
          severity="danger"
          @click="handleDelete()"
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
import { useFetchStore } from '@/stores/fetchStore'

const toast = useToast()
const visible = ref(false)
const props = defineProps({
  attachmentId: {
    type: Number,
    required: true,
  },
})
const attachmentStore = useFetchStore()

const { isPending, isError, mutate } = useMutation({
  mutationFn: async () => await api.delete(`/attachments/${props.attachmentId}`),
  onSuccess: () => {
    toast.add({
      severity: 'success',
      summary: 'Success Message',
      detail: 'Gambar berhasil dihapus',
      life: 3000,
    })
    attachmentStore.refetchAttachments()
    visible.value = false
  },
  onError: (error) => {
    toast.add({
      severity: 'error',
      summary: 'Error Message',
      detail: 'Gambar gagal dihapus',
      life: 3000,
    })
  },
})

function handleDelete() {
  mutate()
}
</script>
