import { defineAdapter } from '@v3sf/core'
import Input from './widgets/Input'
import Checkbox from './widgets/Checkbox'
import SwitchWidget from './widgets/Switch'
import Stepper from './widgets/Stepper'
import Radio from './widgets/Radio'
import RadioButton from './widgets/RadioButton'
import Picker from './widgets/Picker'
import Cascader from './widgets/Cascader'
import DateWidget from './widgets/Date'

const vantAdapter = defineAdapter({
  widgets: {
    input: { component: Input, propsMap: { error: 'error-message' } },
    textarea: { component: Input, propsMap: { error: 'error-message' } },
    checkbox: { component: Checkbox },
    switch: { component: SwitchWidget },
    stepper: { component: Stepper },
    number: { component: Stepper },
    radio: { component: Radio },
    radioButton: { component: RadioButton },
    picker: { component: Picker },
    cascader: { component: Cascader },
    date: { component: DateWidget },
    // Type fallbacks
    string: { component: Input, propsMap: { error: 'error-message' } },
    boolean: { component: SwitchWidget },
    array: { component: Checkbox },
  },
  globalPropsMap: {
    disabled: 'disabled',
    readonly: 'readonly',
    placeholder: 'placeholder',
  },
})

export default vantAdapter
export { vantAdapter }
