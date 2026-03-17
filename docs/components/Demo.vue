<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { createSchemaForm } from '@v3sf/core'
import { vantAdapter } from '@v3sf/vant'
import { createDataBySchema } from '../utils'

const props = defineProps<{
  schema: string
  description?: string
  path?: string
}>()

const SchemaForm = createSchemaForm(vantAdapter)

const activeTab = ref<'preview' | 'schema' | 'data'>('preview')
const formRef = ref()

const schemaObj = computed(() => {
  try {
    return JSON.parse(decodeURIComponent(props.schema))
  } catch {
    return { type: 'object', properties: {} }
  }
})

const descriptionText = computed(() => {
  return props.description ? decodeURIComponent(props.description) : ''
})

const formData = ref<Record<string, any>>({})

onMounted(() => {
  formData.value = createDataBySchema(schemaObj.value)
})

const schemaFormatted = computed(() => {
  return JSON.stringify(schemaObj.value, null, 2)
})

const dataFormatted = computed(() => {
  return JSON.stringify(formData.value, null, 2)
})

function colorizeJson(json: string): string {
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /("(?:\\.|[^"\\])*")\s*:/g,
      '<span class="json-key">$1</span>:'
    )
    .replace(
      /:\s*("(?:\\.|[^"\\])*")/g,
      ': <span class="json-string">$1</span>'
    )
    .replace(
      /:\s*(\d+(?:\.\d+)?)/g,
      ': <span class="json-number">$1</span>'
    )
    .replace(
      /:\s*(true|false)/g,
      ': <span class="json-boolean">$1</span>'
    )
    .replace(
      /:\s*(null)/g,
      ': <span class="json-null">$1</span>'
    )
}

async function handleValidate() {
  if (formRef.value) {
    await formRef.value.validate()
  }
}

const tabs = [
  { key: 'preview' as const, label: '效果' },
  { key: 'schema' as const, label: 'Schema' },
  { key: 'data' as const, label: 'Data' },
]
</script>

<template>
  <div class="demo-container">
    <div v-if="descriptionText" class="demo-description">
      {{ descriptionText }}
    </div>
    <div class="demo-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['demo-tab', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="demo-content">
      <div v-show="activeTab === 'preview'" class="demo-preview">
        <div class="demo-form-area">
          <SchemaForm ref="formRef" v-model="formData" :schema="schemaObj" />
        </div>
        <div class="demo-actions">
          <button class="demo-validate-btn" @click="handleValidate">
            测试
          </button>
        </div>
      </div>
      <div v-show="activeTab === 'schema'" class="demo-code">
        <pre><code v-html="colorizeJson(schemaFormatted)" /></pre>
      </div>
      <div v-show="activeTab === 'data'" class="demo-code">
        <pre><code v-html="colorizeJson(dataFormatted)" /></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  max-width: 520px;
}

.demo-description {
  padding: 12px 16px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  border-bottom: 1px solid var(--vp-c-divider);
}

.demo-tabs {
  display: flex;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.demo-tab {
  flex: 1;
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  color: var(--vp-c-text-2);
  transition: color 0.2s, border-color 0.2s;
  border-bottom: 2px solid transparent;
  font-family: inherit;
}

.demo-tab:hover {
  color: var(--vp-c-text-1);
}

.demo-tab.active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

.demo-content {
  min-height: 120px;
}

.demo-preview {
  padding: 16px;
}

.demo-form-area {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 12px;
  background: var(--vp-c-bg);
}

.demo-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.demo-validate-btn {
  padding: 6px 20px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 4px;
  background: var(--vp-c-brand-1);
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  transition: opacity 0.2s;
}

.demo-validate-btn:hover {
  opacity: 0.85;
}

.demo-code {
  background: var(--vp-code-block-bg);
  padding: 16px;
  overflow-x: auto;
}

.demo-code pre {
  margin: 0;
  padding: 0;
  background: none;
}

.demo-code code {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

.demo-code :deep(.json-key) {
  color: var(--vp-c-brand-1);
}

.demo-code :deep(.json-string) {
  color: #b56959;
}

.demo-code :deep(.json-number) {
  color: #2f798a;
}

.demo-code :deep(.json-boolean) {
  color: #1e754f;
}

.demo-code :deep(.json-null) {
  color: #8e8e8e;
}

:root.dark .demo-code :deep(.json-string) {
  color: #c98a7d;
}

:root.dark .demo-code :deep(.json-number) {
  color: #4ec9b0;
}

:root.dark .demo-code :deep(.json-boolean) {
  color: #4ec9b0;
}
</style>
