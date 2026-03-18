import { ref } from 'vue'

const selectedAdapter = ref<'vant' | 'element-plus'>('vant')
const viewportMode = ref<'mobile' | 'desktop'>('mobile')
const interactionMode = ref<'edit' | 'preview'>('edit')

export function usePlayground() {
  return {
    selectedAdapter,
    viewportMode,
    interactionMode,
  }
}
