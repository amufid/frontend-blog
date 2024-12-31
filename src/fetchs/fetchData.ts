import api from '@/utils/api'

export const fetchPost = async (slug: string) => {
  try {
    const response = await api.get(`/posts/${slug}`)
    return response.data.data
  } catch (error) {
    console.log(error)
  }
}

export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories')
    return response.data.data
  } catch (error) {
    console.log(error)
  }
}
