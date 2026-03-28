import { defineAdapter } from '@v3sf/core'
import Input from './widgets/Input'
import Number from './widgets/Number'
import SwitchWidget from './widgets/Switch'
import Radio from './widgets/Radio'
import Checkbox from './widgets/Checkbox'
import Select from './widgets/Select'
import Cascader from './widgets/Cascader'
import DateWidget from './widgets/DateWidget'
import Textarea from './widgets/Textarea'

const elementPlusAdapter = defineAdapter({
  widgets: {
    input: { component: Input },
    textarea: { component: Textarea },
    number: { component: Number },
    stepper: { component: Number },
    switch: { component: SwitchWidget },
    radio: { component: Radio },
    radioButton: { component: Radio },
    checkbox: { component: Checkbox },
    select: { component: Select },
    picker: { component: Select },
    cascader: { component: Cascader },
    date: { component: DateWidget },
    // Type fallbacks
    string: { component: Input },
    boolean: { component: SwitchWidget },
    array: { component: Checkbox },
  },
  globalPropsMap: {
    disabled: 'disabled',
    readonly: 'readonly',
    placeholder: 'placeholder',
  },
})

export default elementPlusAdapter
export { elementPlusAdapter }
