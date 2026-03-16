import { defineComponent } from 'vue'
import { ElDatePicker } from 'element-plus'

export default defineComponent({
  name: 'ElDateWidget',
  props: {
    modelValue: { type: String, default: '' },
    disabled: Boolean,
    placeholder: String,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => (
      <ElDatePicker
        modelValue={props.modelValue}
        onUpdate:modelValue={(val) => emit('update:modelValue', val)}
        type="date"
        disabled={props.disabled}
        placeholder={props.placeholder ?? '请选择日期'}
        valueFormat="YYYY-MM-DD"
      />
    )
  },
})
