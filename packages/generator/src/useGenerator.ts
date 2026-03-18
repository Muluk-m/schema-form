import { computed } from 'vue'
import { useGlobalState } from './hooks'

export function useGenerator() {
  const state = useGlobalState('useGenerator')

  return {
    schema: computed(() => state.buildSchema()),
    fields: state.fields,
    selectedField: state.selectedField,
    canUndo: state.canUndo,
    canRedo: state.canRedo,
    addField: state.addField,
    removeField: state.removeField,
    updateField: state.updateField,
    selectField: state.selectField,
    moveField: state.moveField,
    undo: state.undo,
    redo: state.redo,
    buildSchema: state.buildSchema,
    loadSchema: state.loadSchema,
  }
}
