import { useQueryClient } from '@tanstack/vue-query'
import { defineStore } from 'pinia'

export const useFetchStore = defineStore('attachments', () => {
  const queryClient = useQueryClient()

  // fetch data global
  const refetchAttachments = () => {
    queryClient.invalidateQueries({ queryKey: ['attachments'] })
  }

  const refetchCategories = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] })
  }

  const refechPost = () => {
    queryClient.invalidateQueries({ queryKey: ['fetchPost', 'post_id'] })
  }

  return {
    refetchAttachments,
    refetchCategories,
    refechPost,
  }
})
