<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import SchemaForm from './schema-form';
import { ref } from 'vue'

const formData = ref({
  properties: '',
  partAtitle: ''
})

const schema = {
  type: 'object',
  properties: {
    contractStatus: {
      type: 'string',
      title: 'a',
    },
    partAtitle: {
      type: 'string',
      title: 'b',
    },
  }
}
</script>

<template>
  <SchemaForm :schema="schema" v-model="formData" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
