<template>
  <div class="w-[1000px] md:w-full flex flex-col py-5 px-10 gap-5 border rounded-xl mx-auto">
    <h1>Buat Post</h1>
    <div class="flex flex-col gap-4 w-full">
      <Form @submit="submitForm">
        <div class="w-full flex md:flex-col gap-4">
          <FormField
            v-slot="$field"
            name="title"
            initialValue=""
            :resolver="zodTitleResolver"
            class="flex flex-col gap-1 min-w-80"
          >
            <label for="title">Judul</label>
            <InputText type="text" placeholder="Judul" v-model="formData.title" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>
          <EditorContent @update-content="onContentUpdate" />
          <Message v-if="errorValidation" severity="error" size="small" variant="simple">{{
            errorValidation
          }}</Message>
          <div class="flex items-end gap-4">
            <FormField
              v-slot="$field"
              name="category_id"
              initialValue=""
              :resolver="zodCategoryResolver"
              class="flex flex-col gap-1 min-w-80"
            >
              <label for="category">Kategori</label>
              <Select
                v-model="categorySelect"
                :options="data"
                optionLabel="name"
                placeholder="Pilih Kategori"
              />
              <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                $field.error?.message
              }}</Message>
            </FormField>
            <Button type="submit" severity="success" :loading="isPending" label="Simpan" />
          </div>
        </div>
      </Form>
    </div>
    <CreateAttachment :allowSubmit="allowSubmit" />
  </div>
</template>

<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { ref } from 'vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import api from '@/utils/api'
import { useToast } from 'primevue/usetoast'
import EditorContent from '@/components/editor/EditorContent.vue'
import CreateAttachment from '@/components/post/CreateAttachment.vue'

const toast = useToast()

const defineProps = {
  onContentUpdate: {
    type: Function,
    required: false,
    default: () => {},
  },
}

interface Post {
  title: string
  content: string
  category_id: string
}

interface Category<T> {
  id: string
  name: string
}

const categorySelect = ref<Category<string>>({
  id: '',
  name: '',
})
const formData = ref<Post>({
  title: '',
  content: '',
  category_id: '',
})
const errorValidation = ref<string>('')
const allowSubmit = ref<boolean>(true)

// validation input form
const zodTitleResolver = zodResolver(z.string().min(1, { message: 'Title tidak boleh kosong.' }))
const zodCategoryResolver = ({ value }: { value: any }) => {
  const errors: any = []
  if (!value) {
    errors.push({ message: 'Pilih kategori terlebih dahulu.' })
  }
  return {
    errors,
  }
}

// Fungsi untuk menangani event dari child
const onContentUpdate = (content: any) => {
  formData.value.content = content
}

const fetchCategories = async () => {
  try {
    const response = await api.get('/categories')
    return response.data.data
  } catch (error) {
    console.log(error)
  }
}

const { status, data, error } = useQuery({
  queryKey: ['categories'],
  queryFn: fetchCategories,
})

const { isPending, isError, isSuccess, mutate } = useMutation({
  mutationFn: (formData: Post) => api.post('/posts', formData),
  onSuccess: (data) => {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Berhasil menambahkan post',
      life: 3000,
    })
    localStorage.setItem('post_id', data.data.data.id)
    formData.value = { title: '', content: '', category_id: '' }
    categorySelect.value = { id: '', name: '' }
  },
  onError: () => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Gagal menambahkan post',
      life: 3000,
    })
  },
})

function submitForm({ valid }: { valid: boolean }) {
  if (valid && formData.value.content) {
    allowSubmit.value = true
    formData.value.category_id = categorySelect.value?.id.toString()
    setTimeout(() => {
      mutate(formData.value)
    }, 1000)
  } else {
    errorValidation.value = 'Konten tidak boleh kosong'
  }
}
</script>
