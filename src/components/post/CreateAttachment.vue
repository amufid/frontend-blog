<template>
  <div class="flex flex-col gap-4">
    <Form @submit="onSubmit">
      <div class="flex gap-4 w-full items-end">
        <div class="flex flex-col gap-1">
          <label for="image">Tambahkan Gambar</label>
          <input
            type="file"
            placeholder="Upload Gambar"
            @change="handleChangeImage"
            accept="image/*"
            class="py-1 border rounded-md border-slate-300 min-w-80"
          />
          <Message severity="error" size="small" variant="simple" v-if="errors">{{
            errors
          }}</Message>
        </div>
        <div>
          <Button type="submit" severity="success" :loading="isPending" label="Upload" />
        </div>
      </div>
    </Form>
    <Attachments />
    <div class="flex flex-wrap gap-4 mt-4">
      <div v-for="(image, index) in images" :key="index" class="flex flex-row">
        <img :src="image.url" :alt="`Gambar ${index + 1}`" class="w-40 object-cover rounded-md" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFetchStore } from '@/stores/fetchStore'
import api from '@/utils/api'
import { useMutation } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import Attachments from './Attachments.vue'

const toast = useToast()

const props = defineProps({
  post_id: {
    type: String,
    required: false,
  },
})

// State untuk menyimpan daftar gambar
const images = ref<{ url: string }[]>([])
const path = ref<File | null>(null)
const errors = ref<string>('')
const attachmentStore = useFetchStore()

const { isPending, isError, mutate } = useMutation({
  mutationFn: (formData: FormData) => api.post('/attachments', formData),
  onSuccess: (data) => {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Gambar berhasil diupload',
      life: 3000,
    })
    attachmentStore.refetchAttachments()
    path.value = null
  },
  onError: () => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Gagal menambahkan gambar',
      life: 3000,
    })
  },
})

function onSubmit() {
  const postId = props.post_id ?? localStorage.getItem('post_id') ?? ''
  const formData = new FormData()

  if (!path.value) {
    errors.value = 'Pilih file terlebih dahulu.'
  } else {
    formData.append('image', path.value)
    formData.append('post_id', postId)
    mutate(formData)
  }
}

const handleChangeImage = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file?.type.startsWith('image/')) {
    errors.value = 'File yang dipilih bukan gambar.'
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    // Maksimal 2MB
    errors.value = 'Ukuran file tidak boleh lebih dari 2MB.'
    return
  }

  if (target?.files && target.files[0]) {
    const file = target.files[0]
    // Buat URL objek untuk file
    const imageUrl = URL.createObjectURL(file)
    if (path.value) {
      images.value = []
      images.value.push({ url: imageUrl })
      return
    }
    images.value.push({ url: imageUrl })
    path.value = file
    target.value = ''
    errors.value = ''
  }
}
</script>
