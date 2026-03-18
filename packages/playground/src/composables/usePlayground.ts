import { ref } from 'vue'

const selectedAdapter = ref<'vant' | 'element-plus'>('vant')
const previewMode = ref<'mobile' | 'desktop'>('mobile')

export function usePlayground() {
  return {
    selectedAdapter,
    previewMode,
  }
}
