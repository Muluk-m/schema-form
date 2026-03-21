import { ref } from 'vue'

const selectedAdapter = ref<'vant' | 'element-plus'>('vant')
const viewportMode = ref<'mobile' | 'desktop'>('mobile')
/** AI mode (default) or Build mode (generator drag-and-drop) */
const playgroundMode = ref<'ai' | 'build'>('ai')
/** Within build mode: edit canvas or preview form */
const interactionMode = ref<'edit' | 'preview'>('edit')

export function usePlayground() {
  return {
    selectedAdapter,
    viewportMode,
    playgroundMode,
    interactionMode,
  }
}
