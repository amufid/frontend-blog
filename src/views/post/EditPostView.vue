<template>
  <div class="flex flex-col py-5 px-10 gap-5 border rounded-xl">
    <h1>Edit Post</h1>
    <div v-if="postIsPending || categoriesIsPending" class="flex justify-center items-center">
      <i class="pi pi-spin pi-spinner-dotted" style="font-size: 3rem; text-align: center"></i>
    </div>
    <div v-else class="flex flex-col gap-4 w-full">
      <Form @submit="submitForm">
        <div class="w-full flex flex-col gap-4 items-center mb-5">
          <FormField
            v-slot="$field"
            name="title"
            initialValue="formData.title"
            :resolver="zodTitleResolver"
            class="flex flex-col gap-1 w-full"
          >
            <label for="title">Judul</label>
            <InputText type="text" placeholder="Judul" v-model="formData.title" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>

          <EditorContent
            @update-content="onContentUpdate"
            :dataContent="formData.content"
            :clearContent="clearEditorContent"
          />
          <Message v-if="errorValidation.content" severity="error" size="small" variant="simple">{{
            errorValidation.content
          }}</Message>

          <div class="flex gap-4 w-full">
            <FormField
              v-slot="$field"
              name="category_id"
              initialValue="formData.category_id"
              :resolver="zodCategoryResolver"
              class="flex flex-col gap-1 min-w-80"
            >
              <Select
                v-model="categorySelect"
                :options="categories"
                optionLabel="name"
                :placeholder="post.category.name"
                class="w-full"
              />
              <Message
                v-if="errorValidation.category_id"
                severity="error"
                size="small"
                variant="simple"
                >{{ errorValidation.category_id }}</Message
              >
            </FormField>
            <Button type="submit" severity="success" label="Simpan" :loading="isPending" />
          </div>
        </div>
      </Form>
    </div>
    <h1>Daftar Gambar Post</h1>
    <CreateAttachment :post_id="post_id" />
  </div>
</template>

<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { ref, watch } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import api from '@/utils/api'
import { useToast } from 'primevue/usetoast'
import EditorContent from '@/components/editor/EditorContent.vue'
import CreateAttachment from '@/components/post/CreateAttachment.vue'
import { useRoute } from 'vue-router'
import { fetchPost, fetchCategories } from '@/fetchs/fetchData'

const toast = useToast()
const route = useRoute()
const post_id = (route.query?.id as string) ?? ''

const slug = route.params.slug

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
const errorValidation = ref({
  content: '',
  category_id: '',
})

// validation input form
const zodTitleResolver = zodResolver(z.string().min(1, { message: 'Title tidak boleh kosong.' }))
const zodCategoryResolver = ({ value }: { value: any }) => {
  const errors: any = []
  if (!value) {
    errors.push({ message: 'Kategori tidak boleh kosong.' })
  }
  return {
    errors,
  }
}

defineProps({
  onContentUpdate: {
    type: Function,
    required: true,
    default: () => {},
  },
  clearContent: {
    type: Function,
    required: false,
    default: () => {},
  },
})

// Fungsi untuk menangani event dari editor content
const onContentUpdate = (content: any) => {
  formData.value.content = content
}

const clearEditorContent = () => {
  formData.value.content = ''
}

const queryClient = useQueryClient()

const fetchPostData = async () => {
  const resolvedSlug = Array.isArray(slug) ? slug[0] : slug
  return await fetchPost(resolvedSlug)
}

const { data: post, isPending: postIsPending } = useQuery({
  queryKey: ['fetchPost', 'post_id'],
  queryFn: fetchPostData,
})

const { data: categories, isPending: categoriesIsPending } = useQuery({
  queryKey: ['categories'],
  queryFn: fetchCategories,
})

watch(post, () => {
  formData.value = {
    title: post.value.title,
    content: post.value.content,
    category_id: post.value.category_id,
  }

  categorySelect.value = {
    id: post.value.category.id,
    name: post.value.category.name,
  }
})

const { isPending, isError, isSuccess, mutate } = useMutation({
  mutationFn: (formData: Post) => api.put(`/posts/${post_id}`, formData),
  onSuccess: (data) => {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Berhasil update post',
      life: 3000,
    })
    const postId = data.data.data.id
    localStorage.setItem('post_id', postId)
    queryClient.invalidateQueries({ queryKey: ['fetchPost', post_id] })
    playSuccessSound()
  },
  onError: (err) => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Gagal update post',
      life: 3000,
    })
    console.log(err, 'error')
  },
})

function submitForm({ valid }: { valid: boolean }) {
  if (!formData.value.content && !formData.value.category_id) {
    errorValidation.value = {
      content: 'Konten tidak boleh kosong',
      category_id: 'Pilih kategori terlebih dahulu',
    }
  } else if (!formData.value.content) {
    errorValidation.value.content = 'Konten tidak boleh kosong'
  } else if (!categorySelect.value.id) {
    errorValidation.value.category_id = 'Pilih kategori terlebih dahulu'
  } else if (valid && formData.value.content) {
    formData.value.category_id = categorySelect.value?.id
    mutate(formData.value)
  }
}

const playSuccessSound = () => {
  const audio = new Audio('/success.mp3')
  audio.oncanplaythrough = () => {
    audio.play()
  }
  audio.onerror = (error) => {
    console.error('Error loading audio file:', error)
    alert('Error loading sound file')
  }
}
</script>
