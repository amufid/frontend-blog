<template>
  <div class="card flex relative">
    <Button @click="visible = true" severity="info"> + Buat Kategori </Button>
    <Dialog v-model:visible="visible" modal header="Buat Kategori" :style="{ width: '25rem' }">
      <Form @submit="onSubmit">
        <div class="flex items-center gap-4 mb-4">
          <label for="name" class="font-semibold w-36">Nama</label>
          <FormField
            v-slot="$field"
            name="name"
            initialValue=""
            :resolver="nameResolver"
            class="flex flex-col gap-1 w-full"
          >
            <InputText
              id="name"
              class="flex-auto"
              autocomplete="off"
              v-model="formData.name"
              placeholder="Nama"
            />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>
        </div>
        <div class="flex items-center gap-4 mb-8">
          <label for="description" class="font-semibold w-24">Deskripsi</label>
          <InputText
            id="description"
            class="flex-auto"
            autocomplete="off"
            v-model="formData.description"
            placeholder="Deskripsi"
          />
        </div>
        <div class="flex justify-end gap-2">
          <Button
            type="button"
            label="Batal"
            severity="secondary"
            @click="visible = false"
          ></Button>
          <Button type="submit" label="Submit" :loading="isPending"></Button>
        </div>
      </Form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import api from '@/utils/api'
import { ref } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

const toast = useToast()
const visible = ref(false)
const queryClient = useQueryClient()

interface Category {
  name: string
  description: string
}

const nameResolver = zodResolver(
  z
    .string()
    .min(1, { message: 'Nama tidak boleh kosong.' })
    .min(3, { message: 'Nama minimal 3 karakter.' }),
)

const formData = ref<Category>({
  name: '',
  description: '',
})

const { isPending, isError, mutate } = useMutation({
  mutationFn: async () => await api.post('/categories', formData.value),

  onSuccess: () => {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Berhasil menambahkan kategori',
      life: 3000,
    })
    queryClient.invalidateQueries({ queryKey: ['categories'] })
    formData.value = {
      name: '',
      description: '',
    }
    visible.value = false
  },

  onError: () => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Gagal menambahkan kategori',
      life: 3000,
    })
  },
})

function onSubmit({ valid }: { valid: boolean }) {
  if (valid) {
    mutate()
  }
}
</script>
