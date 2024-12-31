<template>
  <div class="card flex relative">
    <Button @click="visible = true" severity="danger" size="small"
      ><i class="pi pi-trash"></i
    ></Button>

    <Dialog v-model:visible="visible" modal header="Konfirmasi Hapus" :style="{ width: '25rem' }">
      <span class="text-surface-300 block mb-8"
        >Apakah anda yakin ingin menghapus kategori ini?</span
      >
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
  categoryId: {
    type: Number,
    required: true,
  },
})
const categoryStore = useFetchStore()

const { isPending, isError, mutate } = useMutation({
  mutationFn: async () => await api.delete(`/categories/${props.categoryId}`),
  onSuccess: () => {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Kategori berhasil dihapus',
      life: 3000,
    })
    categoryStore.refetchCategories()
    visible.value = false
  },
  onError: (error) => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Kategori gagal dihapus',
      life: 3000,
    })
  },
})

function handleDelete() {
  mutate()
}
</script>
