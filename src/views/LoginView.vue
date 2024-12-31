<template>
  <div class="flex justify-center items-center min-h-[80vh]">
    <div
      class="flex flex-col justify-center items-center bg-slate-900 max-w-lg py-10 px-5 rounded-xl gap-10"
    >
      <div>
        <h1 class="text-2xl text-white">Login</h1>
      </div>
      <div class="card">
        <Form @submit="submitForm" class="flex flex-col gap-7 w-full sm:w-80">
          <FormField
            v-slot="$field"
            name="email"
            initialValue=""
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
          <Button type="submit" severity="success" label="Login" :loading="isPending" />
          <p class="text-center">
            Belum punya akun?
            <RouterLink to="/#"><span class="text-green-500">Daftar</span></RouterLink>
          </p>
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
import { useToast } from 'primevue/usetoast'
import api from '../utils/api'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/stores/authStore'

const toast = useToast()

interface User {
  email: string
  password: string
}

const formData = ref<User>({
  email: '',
  password: '',
})

const zodUserEmailResolver = zodResolver(
  z.string().min(1, { message: 'Email tidak boleh kosong.' }),
)
const zodUserPasswordResolver = zodResolver(
  z.string().min(1, { message: 'Password tidak boleh kosong.' }),
)

const authStore = useAuthStore()

const { isPending, isError, mutate } = useMutation({
  mutationFn: (formData: User) => api.post('/login', formData),
  onSuccess: (data) => {
    Cookies.set('x-token', data.data.token)
    authStore.login(data.data.token)

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Login berhasil',
      life: 3000,
    })

    setTimeout(() => {
      window.location.href = '/posts'
    }, 2000)
  },
  onError: () => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Login gagal, email atau password salah',
      life: 3000,
    })
  },
})

const submitForm = ({ valid }: { valid: boolean }) => {
  if (valid) {
    mutate(formData.value)
  }
}
</script>
