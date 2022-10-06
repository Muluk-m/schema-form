import {
  ref,
  defineProps,
  PropType,
  computed,
  watch,
  defineComponent,
  ExtractPropTypes,
} from 'vue';

export default defineComponent({
  setup: () => {
    return () => (
      <div class='v3jsf-Canvas-Empty'>
        <p>拖拽左侧组件来添加</p>
      </div>
    );
  },
});
