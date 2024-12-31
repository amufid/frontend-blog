<template>
  <div class="flex flex-col gap-6 min-h-[70vh]">
    <h1>Kategori</h1>
    <CreateCategoryModal />
    <div v-if="isPending" class="flex justify-center items-center">
      <i class="pi pi-spin pi-spinner-dotted" style="font-size: 3rem; text-align: center"></i>
    </div>
    <div v-if="data" class="card">
      <table class="w-full table-auto">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Deskripsi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="data" v-for="(category, index) in data" :key="category.id">
            <td class="text-center">{{ index + 1 }}</td>
            <td>{{ category.name }}</td>
            <td>{{ category.description }}</td>
            <td class="items-center">
              <div class="w-full">
                <div class="flex w-24 mx-auto">
                  <EditCategoryModal :category="category" />
                  <DeleteCategoryModal :categoryId="category.id" />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/utils/api'
import { useQuery } from '@tanstack/vue-query'
import CreateCategoryModal from '@/components/category/CreateCategoryModal.vue'
import EditCategoryModal from '@/components/category/EditCategoryModal.vue'
import DeleteCategoryModal from '@/components/category/DeleteCategoryModal.vue'

const fetchCategories = async () => {
  try {
    const response = await api.get('/categories')
    return response.data.data
  } catch (error) {
    console.log('Fetch Categories Error: ', error)
  }
}

const { isPending, data, error } = useQuery({
  queryKey: ['categories'],
  queryFn: fetchCategories,
})
</script>

<style scoped>
th {
  @apply p-2;
}

td {
  @apply p-3 border-t border-gray-400;
}
</style>
