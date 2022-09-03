import type { Component } from 'vue';
import SchemaForm from 'v3-schema-form';
import Demo from './Demo.vue';

export const globals: [string, Component][] = [
  ['Demo', Demo],
  ['SchemaForm', SchemaForm],
];
