<template>
  <Form>
    <div v-if="editor" class="mx-auto mt-4 rounded-lg">
      <h3 class="font-normal mb-4">Konten</h3>
      <div class="control-group mb-4">
        <div class="button-group flex flex-wrap gap-2">
          <button
            class="px-4 py-2 border rounded-md disabled:opacity-50"
            @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :class="{ 'bg-blue-500 text-white': editor.isActive('bold') }"
          >
            Bold
          </button>
          <button
            class="px-4 py-2 border rounded-md disabled:opacity-50"
            @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :class="{ 'bg-blue-500 text-white': editor.isActive('italic') }"
          >
            Italic
          </button>
          <button
            class="px-4 py-2 border rounded-md disabled:opacity-50"
            @click="editor.chain().focus().toggleStrike().run()"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            :class="{ 'bg-blue-500 text-white': editor.isActive('strike') }"
          >
            Strike
          </button>
          <button
            class="px-4 py-2 border rounded-md disabled:opacity-50"
            @click="editor.chain().focus().toggleCode().run()"
            :disabled="!editor.can().chain().focus().toggleCode().run()"
            :class="{ 'bg-blue-500 text-white': editor.isActive('code') }"
          >
            Code
          </button>
          <button
            class="px-4 py-2 border rounded-md"
            @click="editor.chain().focus().unsetAllMarks().run()"
          >
            Clear marks
          </button>
          <button
            class="px-4 py-2 border rounded-md"
            @click="editor.chain().focus().clearNodes().run()"
          >
            Clear nodes
          </button>
          <button
            class="px-4 py-2 border rounded-md"
            @click="editor.chain().focus().setParagraph().run()"
            :class="{ 'bg-blue-500 text-white': editor.isActive('paragraph') }"
          >
            Paragraph
          </button>
          <button
            class="px-4 py-2 border rounded-md"
            v-for="level in [1, 2, 3, 4, 5, 6] as const"
            :key="level"
            @click="editor?.chain().focus().toggleHeading({ level }).run()"
            :class="{ 'bg-blue-500 text-white': editor?.isActive('heading', { level }) }"
          >
            H{{ level }}
          </button>
          <button
            class="px-4 py-2 border rounded-md"
            @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'bg-blue-500 text-white': editor.isActive('bulletList') }"
          >
            Bullet list
          </button>
          <button
            class="px-4 py-2 border rounded-md"
            @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'bg-blue-500 text-white': editor.isActive('orderedList') }"
          >
            Ordered list
          </button>
          <!-- <button
          class="px-4 py-2 border rounded-md"
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'bg-blue-500 text-white': editor.isActive('codeBlock') }"
        >
          Code block
        </button> -->
          <button
            class="px-4 py-2 border rounded-md"
            @click="editor.chain().focus().toggleCodeBlock().run()"
            :class="{ 'bg-blue-500 text-white': editor.isActive('codeBlock') }"
          >
            Toggle code block
          </button>
          <button
            class="px-4 py-2 border rounded-md"
            @click="editor.chain().focus().setCodeBlock().run()"
            :disabled="editor.isActive('codeBlock')"
          >
            Set code block
          </button>
          <button
            class="px-4 py-2 border rounded-md"
            @click="editor.chain().focus().toggleBlockquote().run()"
            :class="{ 'bg-blue-500 text-white': editor.isActive('blockquote') }"
          >
            Blockquote
          </button>
          <button
            class="px-4 py-2 border rounded-md"
            @click="editor.chain().focus().setHorizontalRule().run()"
          >
            Horizontal rule
          </button>
          <button
            class="px-4 py-2 border rounded-md"
            @click="editor.chain().focus().setHardBreak().run()"
          >
            Hard break
          </button>
          <button
            class="px-4 py-2 border rounded-md disabled:opacity-50"
            @click="editor.chain().focus().undo().run()"
            :disabled="!editor.can().chain().focus().undo().run()"
          >
            Undo
          </button>
          <button
            class="px-4 py-2 border rounded-md disabled:opacity-50"
            @click="editor.chain().focus().redo().run()"
            :disabled="!editor.can().chain().focus().redo().run()"
          >
            Redo
          </button>
          <button
            class="px-4 py-2 border rounded-md"
            @click="editor.chain().focus().setColor('#958DF1').run()"
            :class="{
              'bg-purple-500 text-white': editor.isActive('textStyle', { color: '#958DF1' }),
            }"
          >
            Purple
          </button>
          <button @click="addImage" class="px-4 py-2 border rounded-md disabled:opacity-50">
            Set image
          </button>
          <button @click="clearEditorContent" class="px-4 py-2 bg-red-500 text-white rounded-md">
            Clear Content
          </button>
        </div>
      </div>
      <EditorContent :editor="editor" class="prose max-w-full border" />
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Editor, EditorContent } from '@tiptap/vue-3'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import '@/assets/custom.css'
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from 'lowlight'

// create a lowlight instance
const lowlight = createLowlight(all)

// you can also register languages
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

const props = defineProps({
  onContentUpdate: {
    type: Function,
    required: true,
  },
  dataContent: {
    type: String,
    required: true,
  },
  clearContent: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['update-content'])
const editor = ref<Editor>()
const outputContent = ref<string>('')

// Inisialisasi editor pada mount
onMounted(() => {
  editor.value = new Editor({
    extensions: [
      Color,
      TextStyle,
      ListItem,
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'md:w-full xl:w-[700px] h-auto object-cover mx-auto justify-center',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        languageClassPrefix: 'language-',
        defaultLanguage: 'javascript',
        HTMLAttributes: {
          class: '!bg-gray-900 p-2 rounded-lg text-lg',
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-3 focus:outline-none min-h-20 max-h-screen overflow-y-auto',
      },
    },
    content: `${props.dataContent ?? ''}`,
    onUpdate: () => {
      updateContent()
    },
  })
})

// Hancurkan editor sebelum komponen di-unmount
onBeforeUnmount(() => {
  editor.value?.destroy()
})

// Method to add an image
const addImage = () => {
  const url = window.prompt('Enter the image URL')

  if (url) {
    // Access the editor's chain method to set an image
    editor.value?.chain().focus().setImage({ src: url }).run()
  }
}

// Fungsi untuk menghapus seluruh konten editor
function clearEditorContent() {
  if (editor.value) {
    editor.value.commands.clearContent()
  }
  props.clearContent()
}

// Fungsi untuk memperbarui konten
function updateContent() {
  if (editor.value) {
    outputContent.value = editor.value.getHTML()
    emit('update-content', outputContent.value)
  }
}
</script>

<style lang="scss" scoped>
/* Basic editor styles */
.tiptap {
  :first-child {
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
      font-size: 1rem;
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

li {
  list-style-type: disc !important;
}
</style>
