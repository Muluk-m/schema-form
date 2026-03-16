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
    number: { component: Number },
    switch: { component: SwitchWidget },
    radio: { component: Radio },
    checkbox: { component: Checkbox },
    select: { component: Select },
    cascader: { component: Cascader },
    date: { component: DateWidget },
    textarea: { component: Textarea },
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
