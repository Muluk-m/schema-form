<script lang="ts" setup>
import { ref, defineProps, PropType, computed, defineEmits, watch, provide } from 'vue';

const text = ref('app');
</script>

<template>
  <div>{{ text }}</div>
</template>

<style lang="scss" scoped>
//
</style>
