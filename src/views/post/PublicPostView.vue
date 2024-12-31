<template>
  <div class="flex flex-col gap-6 bg-white/10 rounded-xl p-5">
    <div v-if="isPending" class="flex justify-center items-center min-h-[70vh]">
      <i class="pi pi-spin pi-spinner-dotted" style="font-size: 3rem; text-align: center"></i>
    </div>
    <div v-else-if="isError" class="flex justify-center items-center">
      <h1>Post Tidak Ditemukan</h1>
    </div>
    <div v-else="data" class="flex flex-col gap-4">
      <h1>{{ data.title }}</h1>
      <div class="card flex">
        <div class="card flex justify-center">
          <div class="flex gap-2 items-center">
            <div>
              <i class="pi pi-home" style="font-size: 0.8rem"></i>
            </div>
            <div>
              <i class="pi pi-chevron-right" style="font-size: 0.8rem; color: darkgray"></i>
            </div>
            <RouterLink to="/">Post</RouterLink>
            <div>
              <i class="pi pi-chevron-right" style="font-size: 0.8rem; color: darkgray"></i>
            </div>
            <RouterLink to="" class="text-gray-400 cursor-default" v-if="data">{{
              data.title
            }}</RouterLink>
          </div>
        </div>
      </div>
      <h4>Kategori: {{ data.category.name }}</h4>
      <div class="w-full flex justify-center" v-if="data.attachment.length > 0">
        <img :src="data.attachment[0].image" alt="" class="w-auto h-60 rounded-md object-cover" />
      </div>
      <div class="tiptap">
        <div v-html="data.content"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import api from '@/utils/api'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { all, createLowlight } from 'lowlight'
import hljs from 'highlight.js'
import { nextTick, onMounted } from 'vue'
import '@/assets/custom.css'

// create a lowlight instance
const lowlight = createLowlight(all)

// you can also register languages
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

onMounted(() => {
  const codeBlocks = document.querySelectorAll('.tiptap pre code')
  codeBlocks.forEach((block) => {
    hljs.highlightBlock(block as HTMLElement)
  })
})

const route = useRoute()
const router = useRouter()
const slug = route.params.slug

const fetchPost = async () => {
  try {
    const response = await api.get(`posts/${slug}`)
    return response.data.data
  } catch (error) {
    console.log('Failed fetch post', error)
  }
}

const { isPending, data, isError } = useQuery({
  queryKey: ['post', slug],
  queryFn: fetchPost,
})

const goToUrl = async (post: any) => {
  await router.push({
    name: post.name,
    params: { slug: post.slug },
    query: { id: post.id },
  })

  // Setelah navigasi selesai, lakukan reload
  await nextTick(() => window.location.reload())
}
</script>

<style lang="scss" scoped>
/* Basic editor styles */
.tiptap {
  div:first-child {
    margin-top: 0;
  }

  pre {
    background: var(--black);
    border-radius: 0.5rem;
    color: var(--white);
    font-family: 'JetBrainsMono', monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }

    /* Code styling */
    .hljs-comment,
    .hljs-quote {
      color: #616161;
    }

    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #f98181;
    }

    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #fbbc88;
    }

    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #b9f18d;
    }

    .hljs-title,
    .hljs-section {
      color: #faf594;
    }

    .hljs-keyword,
    .hljs-selector-tag {
      color: #70cff8;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: 700;
    }
  }
}

.tiptap div {
  color: inherit;
}
</style>
