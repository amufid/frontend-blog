<template>
  <div class="flex justify-center items-center min-h-[80vh]">
    <div
      class="flex flex-col justify-center items-center bg-slate-900 max-w-lg py-10 px-5 rounded-xl gap-10"
    >
      <div>
        <h1 class="text-2xl text-white">Edit Profile</h1>
      </div>
      <div class="card">
        <Form @submit="submitForm" class="flex flex-col gap-7 w-full sm:w-80">
          <FormField
            v-slot="$field"
            name="name"
            initialValue="formData.name"
            :resolver="zodUserNameResolver"
            class="flex flex-col gap-1"
          >
            <InputText type="text" placeholder="Username" v-model="formData.name" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>
          <FormField
            v-slot="$field"
            name="email"
            initialValue="formData.email"
            :resolver="zodUserEmailResolver"
            class="flex flex-col gap-1"
          >
            <InputText type="email" placeholder="Email" v-model="formData.email" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>
          <FormField
            v-slot="$field"
            name="password"
            initialValue=""
            :resolver="zodUserPasswordResolver"
            class="flex flex-col gap-1"
          >
            <Password
              type="text"
              placeholder="Password"
              :feedback="false"
              toggleMask
              fluid
              v-model="formData.password"
            />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>
          <Button type="submit" severity="success" label="Update" :loading="isPending" />
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { ref } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import api from '@/utils/api'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const toast = useToast()
const router = useRouter()
const user = useAuthStore()

interface User {
  id: number
  name: string
  email: string
  password: string
}

const formData = ref<User>({
  id: 0,
  name: '',
  email: '',
  password: '',
})

const zodUserNameResolver = zodResolver(
  z.string().min(1, { message: 'Username minimal 3 karakter.' }),
)
const zodUserEmailResolver = zodResolver(
  z.string().min(1, { message: 'Email minimal 5 karakter.' }),
)
const zodUserPasswordResolver = zodResolver(
  z.string().min(1, { message: 'Username minimal 7 karakter.' }),
)

const getUser = async () => {
  const response = await user.fetchUser()
  formData.value = {
    id: response.id,
    name: response.name,
    email: response.email,
    password: '',
  }
}

getUser()

const { isPending, error, mutate } = useMutation({
  mutationFn: (formData: User) => api.put(`/users/${formData.id}`, formData),
  onSuccess: () => {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Update profil berhasil',
      life: 3000,
    })
    setTimeout(() => {
      router.push('/posts')
    }, 2000)
  },
  onError: (err) => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Update profil gagal',
      life: 3000,
    })
    console.log(err, 'error')
  },
})

const submitForm = ({ valid }: { valid: boolean }) => {
  if (valid) {
    mutate(formData.value)
  }
}
</script>
