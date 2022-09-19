<script lang="ts" setup>
import { ref } from 'vue';
import { Switch } from 'vant';
import { useAddon } from '../../../vue3-schema-form/src';

const value = ref(false);
const addon = useAddon();

const change = async (v) => {
  value.value = v;
  const error = await addon.value.validateFields(['string5']);
  console.log(error);
};
</script>

<template>
  <Switch
    :model-value="value"
    @update:model-value="change"
  />
</template>
