<script lang="ts" setup>
import { ref, defineProps, PropType, computed, defineEmits, watch, provide } from 'vue';

const props = defineProps({
  schema: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
});
</script>

<template>
  <div>
    <div>
      <SchemaForm :schema="props.schema" />
    </div>
    <div>schema</div>
    <div>data</div>
  </div>
</template>

<style lang="scss" scoped>
//
</style>
